import { useMemo, useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useWBSStore } from '@/store/wbsStore'
import { parseDependencies } from '@/lib/wbs-gantt-utils'
import { calculateCriticalPath } from '@/lib/wbs-cpm'
import { WBSNetworkNode, type WBSNetworkNodeData } from './WBSNetworkNode'

const nodeTypes = { wbsNode: WBSNetworkNode }

const NODE_GAP_X = 240
const NODE_GAP_Y = 100

function topologicalLayout(nodes: Node<WBSNetworkNodeData>[], edges: Edge[]): Node<WBSNetworkNodeData>[] {
  const adj = new Map<string, string[]>()
  const inDegree = new Map<string, number>()

  for (const n of nodes) {
    adj.set(n.id, [])
    inDegree.set(n.id, 0)
  }
  for (const e of edges) {
    adj.get(e.source)?.push(e.target)
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1)
  }

  const queue: string[] = []
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id)
  }

  const levels = new Map<string, number>()
  let maxLevel = 0

  let head = 0
  while (head < queue.length) {
    const current = queue[head++]
    const level = levels.get(current) ?? 0
    for (const next of adj.get(current) ?? []) {
      const newLevel = level + 1
      levels.set(next, Math.max(levels.get(next) ?? 0, newLevel))
      maxLevel = Math.max(maxLevel, newLevel)
      const newDeg = (inDegree.get(next) ?? 1) - 1
      inDegree.set(next, newDeg)
      if (newDeg === 0) queue.push(next)
    }
  }

  const levelNodes = new Map<number, string[]>()
  for (const n of nodes) {
    const lv = levels.get(n.id) ?? 0
    if (!levelNodes.has(lv)) levelNodes.set(lv, [])
    levelNodes.get(lv)!.push(n.id)
  }

  const result = nodes.map(n => ({ ...n }))
  for (let lv = 0; lv <= maxLevel; lv++) {
    const ids = levelNodes.get(lv) ?? []
    ids.forEach((id, i) => {
      const node = result.find(n => n.id === id)
      if (node) {
        node.position = { x: i * NODE_GAP_X, y: lv * NODE_GAP_Y }
      }
    })
  }

  return result
}

export function WBSNetworkDiagram() {
  const flatNodes = useWBSStore(s => s.flatNodes)
  const selectNode = useWBSStore(s => s.selectNode)
  const updateNode = useWBSStore(s => s.updateNode)

  const cpmResult = useMemo(() => {
    const cpmNodes = flatNodes.map(n => ({
      id: n.id,
      duration: n.duration || 1,
      dependencies: parseDependencies(n.dependencies),
    }))
    return calculateCriticalPath(cpmNodes)
  }, [flatNodes])

  const computedNodes = useMemo(() => {
    const ns: Node<WBSNetworkNodeData>[] = flatNodes.map(n => ({
      id: String(n.id),
      type: 'wbsNode' as const,
      position: { x: 0, y: 0 },
      data: { node: n, isCritical: cpmResult.get(n.id)?.isCritical },
    }))
    const es: Edge[] = flatNodes.flatMap(n => {
      const deps = parseDependencies(n.dependencies)
      return deps.map(depId => ({
        id: `${depId}->${n.id}`,
        source: String(depId),
        target: String(n.id),
        type: 'smoothstep',
        animated: cpmResult.get(n.id)?.isCritical ?? false,
        style: { stroke: 'hsl(var(--border))', strokeWidth: 1.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'hsl(var(--border))',
        },
      }))
    })
    return topologicalLayout(ns, es)
  }, [flatNodes, cpmResult])

  const computedEdges = useMemo(() => {
    return flatNodes.flatMap(n => {
      const deps = parseDependencies(n.dependencies)
      return deps.map(depId => ({
        id: `${depId}->${n.id}`,
        source: String(depId),
        target: String(n.id),
        type: 'smoothstep',
        animated: cpmResult.get(n.id)?.isCritical ?? false,
        style: { stroke: 'hsl(var(--border))', strokeWidth: 1.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'hsl(var(--border))',
        },
      }))
    })
  }, [flatNodes, cpmResult])

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WBSNetworkNodeData>>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  useEffect(() => {
    if (computedNodes.length > 0) {
      setNodes(computedNodes)
      setEdges(computedEdges)
    }
  }, [computedNodes, computedEdges, setNodes, setEdges])

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      selectNode(Number(node.id))
    },
    [selectNode],
  )

  const onConnect = useCallback((connection: Connection) => {
    const sourceId = Number(connection.source)
    const targetId = Number(connection.target)
    if (!sourceId || !targetId || sourceId === targetId) return

    const target = flatNodes.find(n => n.id === targetId)
    const existing = parseDependencies(target?.dependencies ?? null)
    if (existing.includes(sourceId)) return

    const newDeps = [...existing, sourceId].join(',')
    updateNode(targetId, { dependencies: newDeps })
    setEdges(eds => addEdge({
      ...connection,
      id: `${sourceId}->${targetId}`,
      type: 'smoothstep',
      style: { stroke: 'hsl(var(--border))', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--border))' },
    }, eds))
  }, [flatNodes, updateNode])

  if (flatNodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        暂无 WBS 节点
      </div>
    )
  }

  return (
    <div className="flex-1" style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={2}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={n =>
            n.data?.isCritical
              ? 'hsl(var(--chart-1))'
              : 'hsl(var(--muted-foreground))'
          }
          className="!border !border-border"
        />
      </ReactFlow>
    </div>
  )
}
