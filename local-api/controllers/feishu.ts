import type { Request, Response } from 'express'
import { getDatabase } from '../store/sqlite'

function now(): string {
  return new Date().toISOString()
}

let cachedToken: string | null = null
let tokenExpireAt: number = 0

async function getTenantAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpireAt) {
    return cachedToken
  }

  const appId = process.env.FEISHU_APP_ID || ''
  const appSecret = process.env.FEISHU_APP_SECRET || ''
  if (!appId || !appSecret) {
    throw new Error('FEISHU_APP_ID or FEISHU_APP_SECRET not set')
  }

  const resp = await fetch(
    'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
    }
  )

  const data = (await resp.json()) as { code: number; tenant_access_token: string; expire: number }
  if (data.code !== 0) {
    throw new Error(`飞书获取 token 失败: ${JSON.stringify(data)}`)
  }

  cachedToken = data.tenant_access_token
  tokenExpireAt = Date.now() + (data.expire - 300) * 1000
  return cachedToken!
}

async function sendFeishuMessage(chatId: string, text: string): Promise<void> {
  const token = await getTenantAccessToken()
  const content = JSON.stringify({ text })

  const resp = await fetch(
    'https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receive_id: chatId,
        msg_type: 'text',
        content,
      }),
    }
  )

  const data = (await resp.json()) as { code: number; msg: string }
  if (data.code !== 0) {
    throw new Error(`飞书发送消息失败: ${JSON.stringify(data)}`)
  }

  console.log(`[Feishu] 消息已发送: chat=${chatId}, text=${text.slice(0, 50)}`)
}

export function webhook(req: Request, res: Response): void {
  const body = req.body

  if (body.type === 'url_verification') {
    res.json({ challenge: body.challenge })
    return
  }

  const db = getDatabase()
  const msgId = body?.event?.message?.message_id || `msg_${Date.now()}`
  const chatId = body?.event?.message?.chat_id || ''
  const userId = body?.event?.sender?.sender_id?.open_id || ''
  const chatType = body?.event?.message?.chat_type || 'private'
  const content = body?.event?.message?.content || ''

  const msgType = chatType === 'group' ? 'group' : 'private'

  const isOnline = checkTraeOnline(db)

  if (isOnline) {
    db.prepare(
      `
      INSERT INTO feishu_messages (id, chat_id, user_id, content, msg_type, status, source, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    ).run(msgId, chatId, userId, JSON.stringify(content), msgType, 'pending', 'feishu', now())
    console.log(`[Feishu] 消息已入队(Trae在线): ${msgId}`)
    res.json({ code: 0, msg: 'queued_for_trae' })
  } else {
    db.prepare(
      `
      INSERT INTO feishu_messages (id, chat_id, user_id, content, msg_type, status, source, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    ).run(msgId, chatId, userId, JSON.stringify(content), msgType, 'pending', 'feishu', now())
    console.log(`[Feishu] 消息已入队(离线): ${msgId}`)
    res.json({ code: 0, msg: 'queued_offline' })
    handleOffline(msgId, chatId).catch(err => {
      console.error('[Feishu] 离线处理失败:', err)
    })
  }
}

export function getQueue(_req: Request, res: Response): void {
  const db = getDatabase()
  const rows = db
    .prepare(
      `
    SELECT id, chat_id, user_id, content, msg_type, status, created_at
    FROM feishu_messages
    WHERE status = 'pending' AND source = 'feishu'
    ORDER BY created_at ASC
    LIMIT 20
  `
    )
    .all()
  res.json(rows)
}

export function getMessages(_req: Request, res: Response): void {
  const db = getDatabase()
  const rows = db
    .prepare(
      `
    SELECT id, chat_id, user_id, content, msg_type, status, source, reply_content, created_at, processed_at
    FROM feishu_messages
    WHERE source = 'feishu'
    ORDER BY created_at DESC
    LIMIT 30
  `
    )
    .all()
  res.json(rows)
}

export async function respond(req: Request, res: Response): Promise<void> {
  const db = getDatabase()
  const { msg_id, reply_content } = req.body

  if (!msg_id || !reply_content) {
    res.status(400).json({ error: 'msg_id and reply_content required' })
    return
  }

  const msg = db.prepare('SELECT chat_id FROM feishu_messages WHERE id = ?').get(msgId) as
    | { chat_id: string }
    | undefined

  if (!msg) {
    res.status(404).json({ error: 'message not found' })
    return
  }

  db.prepare(
    `
    UPDATE feishu_messages
    SET status = 'done', reply_content = ?, processed_at = ?, source = 'trae'
    WHERE id = ?
  `
  ).run(reply_content, now(), msgId)

  await sendFeishuMessage(msg.chat_id, reply_content)
  console.log(`[Feishu] Trae回复已发送: ${msgId}`)
  res.json({ code: 0, msg: 'replied' })
}

export function heartbeat(_req: Request, res: Response): void {
  const db = getDatabase()
  const heartbeatId = 'trae_heartbeat'

  const existing = db.prepare('SELECT id FROM feishu_heartbeat WHERE id = ?').get(heartbeatId)
  if (existing) {
    db.prepare('UPDATE feishu_heartbeat SET updated_at = ? WHERE id = ?').run(now(), heartbeatId)
  } else {
    db.prepare('INSERT INTO feishu_heartbeat (id, source, updated_at) VALUES (?, ?, ?)').run(
      heartbeatId,
      'trae',
      now()
    )
  }

  res.json({ code: 0, msg: 'heartbeat_ok' })
}

export function getStatus(_req: Request, res: Response): void {
  const db = getDatabase()
  const isOnline = checkTraeOnline(db)
  const pendingCount = db
    .prepare(
      "SELECT COUNT(*) as count FROM feishu_messages WHERE status = 'pending' AND source = 'feishu'"
    )
    .get() as { count: number }

  res.json({
    trae_online: isOnline,
    pending_messages: pendingCount.count,
  })
}

function checkTraeOnline(db: ReturnType<typeof getDatabase>): boolean {
  const heartbeatTimeout = 300
  const row = db
    .prepare("SELECT updated_at FROM feishu_heartbeat WHERE id = 'trae_heartbeat'")
    .get() as { updated_at: string } | undefined

  if (!row) return false

  const lastHeartbeat = new Date(row.updated_at).getTime()
  const elapsed = (Date.now() - lastHeartbeat) / 1000
  return elapsed < heartbeatTimeout
}

async function handleOffline(msgId: string, chatId: string): Promise<void> {
  const db = getDatabase()
  const reply = '林墨当前不在线，已收到你的消息，上线后会尽快处理。'

  db.prepare(
    `
    UPDATE feishu_messages
    SET status = 'done', reply_content = ?, processed_at = ?, source = 'ai_fallback'
    WHERE id = ?
  `
  ).run(reply, now(), msgId)

  await sendFeishuMessage(chatId, reply)
}
