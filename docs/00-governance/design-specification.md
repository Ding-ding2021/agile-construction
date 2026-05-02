---
id: DOC-00-GOVERNANCE-DESIGN-SPECIFICATION
title: 项目设计规范（执行规范）
owner: docs-maintainer
status: active
last_updated: 2026-05-02
source_of_truth: true
related_code:
  - src/theme.ts
  - src/index.css
related_docs: []
---

# 项目设计规范（执行规范）

**文档角色**: Source of Truth（唯一执行规范）  
**状态**: Active  
**版本**: v2.0.0  
**更新日期**: 2026-05-02  
**维护团队**: AI Agent  
**设计来源**: Pixso — 数字营建品牌设计规范  
**Pixso 文件**: `https://pixso.cn/app/design/k6PjXB45etklbw9HF7Qt_Q?item-id=241:478`

---

## 一、品牌识别（Brand Identity）

### 1.1 品牌标志

#### 完整标识组合

```
┌──────────────────────────────────────────┐
│  [图标] 数字营建                          │
│          Digital Construction             │
└──────────────────────────────────────────┘
```

品牌标识包含三个要素：

1. **图形标识** — 矢量几何图形组合（圆、方、线构成的抽象建筑符号）
2. **中文字标识** — 「数字营建」（使用优设标题黑）
3. **英文字标识** — 「Digital Construction」（使用阿里巴巴普惠体 2.0 35 Thin）

#### 标识使用规范

- 标识组合推荐横向排列：图标居左，中文在上、英文在下
- 中文与英文之间间距 4px
- 标识最小使用尺寸：图标不小于 32×32px
- 标识周围应保留最小为标识高度 1/4 的安全空间

---

### 1.2 品牌色板

#### 核心品牌色

| 色板类别                   | 色值      | 名称   | 用途                                   |
| -------------------------- | --------- | ------ | -------------------------------------- |
| **品牌色** (Primary)       | `#154DD9` | 品牌蓝 | 主按钮、导航选中态、重点强调、品牌主色 |
| **辅助色** (Brand/Default) | `#F5DAAC` | 暖金色 | 品牌辅助色、高亮装饰、特殊徽章         |

#### 类比色（Analogous）

| 色值      | 名称   | 用途                 |
| --------- | ------ | -------------------- |
| `#5C16D9` | 品牌紫 | 特殊标记、创意模块   |
| `#0A2363` | 深蓝   | 侧边栏背景、深色区域 |
| `#394E84` | 钢蓝   | 次要信息、辅助模块   |
| `#168BD9` | 亮蓝   | 信息链接、次要按钮   |

#### 互补色（Complementary）

| 色值      | 名称     | 用途             |
| --------- | -------- | ---------------- |
| `#D9165E` | 品牌玫红 | 强调色、错误警示 |
| `#16D924` | 品牌绿   | 成功状态、进行中 |

#### 暗色主题映射

项目使用暗色主题（背景 `#051338`），品牌色在暗色背景下的应用映射：

| CSS 变量             | 色值      | 映射品牌色   | 用途           |
| -------------------- | --------- | ------------ | -------------- |
| `--pm-primary`       | `#154DD9` | 品牌蓝       | 主按钮、选中态 |
| `--pm-primary-light` | `#1a5ae8` | 品牌蓝亮色   | 悬停态         |
| `--pm-primary-dark`  | `#1248c5` | 品牌蓝暗色   | 按下态         |
| `--pm-brand-gold`    | `#F5DAAC` | 暖金色       | 品牌高亮       |
| `--pm-purple`        | `#5C16D9` | 品牌紫       | 特殊标记       |
| `--pm-purple-light`  | `#7A3EE6` | 品牌紫亮色   | 悬停态         |
| `--pm-blue`          | `#168BD9` | 亮蓝         | 信息、链接     |
| `--pm-blue-light`    | `#45A9E8` | 亮蓝亮色     | 信息悬停态     |
| `--pm-green`         | `#16D924` | 品牌绿       | 成功、进行中   |
| `--pm-green-light`   | `#3EE84A` | 品牌绿亮色   | 成功悬停态     |
| `--pm-orange`        | `#FE9A00` | —            | 警告、待处理   |
| `--pm-orange-gold`   | `#FFB900` | —            | 重要警告       |
| `--pm-red`           | `#D9165E` | 品牌玫红     | 错误、删除     |
| `--pm-red-light`     | `#E84D7A` | 品牌玫红亮色 | 错误悬停态     |
| `--pm-deep-blue`     | `#0A2363` | 深蓝         | 侧边栏背景     |
| `--pm-steel-blue`    | `#394E84` | 钢蓝         | 次要信息       |

---

### 1.3 品牌字体

| 语言         | 字体                                         | 字重            | 用途                 |
| ------------ | -------------------------------------------- | --------------- | -------------------- |
| **中文品牌** | **优设标题黑** (YouSheBiaoTiHei)             | Regular (400)   | 品牌标题、Logo 中文  |
| **英文品牌** | **阿里巴巴普惠体 2.0** (Alibaba PuHuiTi 2.0) | 35 Thin         | 品牌副标题、英文标识 |
| **系统 UI**  | **Inter**                                    | 400/500/600/700 | 界面正文、按钮、导航 |

> ⚠ 优设标题黑 和 阿里巴巴普惠体 2.0 需下载自托管或从 CDN 加载。  
> 应用界面正文仍使用 Inter 字体，品牌字体仅用于 Logo、品牌标题等展示场景。

#### @font-face 引用规范

```css
/* 优设标题黑 — 品牌中文 */
@font-face {
  font-family: 'YouSheBiaoTiHei';
  src: url('/fonts/YouSheBiaoTiHei.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* 阿里巴巴普惠体 2.0 — 35 Thin — 品牌英文 */
@font-face {
  font-family: 'Alibaba PuHuiTi 2.0';
  src: url('/fonts/AlibabaPuHuiTi-2.0-35-Thin.otf') format('opentype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
```

---

## 二、设计系统基础

### 2.1 色彩系统

#### 背景色

| 变量名               | 色值                        | 用途       |
| -------------------- | --------------------------- | ---------- |
| `--pm-bg`            | `#051338`                   | 页面主背景 |
| `--pm-sidebar-bg`    | `rgba(10, 35, 99, 0.90)`    | 侧边栏背景 |
| `--pm-header-bg`     | `rgba(5, 19, 56, 0.80)`     | 顶部栏背景 |
| `--pm-card`          | `rgba(255, 255, 255, 0.04)` | 卡片背景   |
| `--pm-element`       | `rgba(255, 255, 255, 0.03)` | 元素背景   |
| `--pm-element-hover` | `rgba(255, 255, 255, 0.06)` | 元素悬停态 |
| `--pm-input-bg`      | `rgba(255, 255, 255, 0.05)` | 输入框背景 |

#### 文字颜色

| 变量名            | 色值                        | 用途                     |
| ----------------- | --------------------------- | ------------------------ |
| `--pm-text-white` | `#ffffff`                   | 主文字（标题、重要信息） |
| `--pm-text-92`    | `rgba(255, 255, 255, 0.92)` | 强调文字                 |
| `--pm-text-70`    | `rgba(255, 255, 255, 0.70)` | 次要文字                 |
| `--pm-text-60`    | `rgba(255, 255, 255, 0.60)` | 辅助文字                 |
| `--pm-text-50`    | `rgba(255, 255, 255, 0.50)` | 提示文字                 |
| `--pm-text-40`    | `rgba(255, 255, 255, 0.40)` | 禁用文字                 |
| `--pm-text-30`    | `rgba(255, 255, 255, 0.30)` | 占位符文字               |
| `--pm-text-25`    | `rgba(255, 255, 255, 0.25)` | 淡化文字                 |

#### 功能色（语义色）

| 变量名              | 色值      | 映射品牌色 | 用途           |
| ------------------- | --------- | ---------- | -------------- |
| `--pm-blue`         | `#168BD9` | 品牌亮蓝   | 信息、链接     |
| `--pm-blue-light`   | `#45A9E8` | —          | 信息悬停态     |
| `--pm-green`        | `#16D924` | 品牌绿     | 成功、进行中   |
| `--pm-green-light`  | `#3EE84A` | —          | 成功悬停态     |
| `--pm-purple`       | `#5C16D9` | 品牌紫     | 特殊标记       |
| `--pm-purple-light` | `#7A3EE6` | —          | 特殊标记悬停态 |
| `--pm-orange`       | `#FE9A00` | —          | 警告、待处理   |
| `--pm-orange-gold`  | `#FFB900` | —          | 重要警告       |
| `--pm-red`          | `#D9165E` | 品牌玫红   | 错误、删除     |
| `--pm-red-light`    | `#E84D7A` | —          | 错误悬停态     |

#### 边框色

| 变量名              | 色值                        | 用途     |
| ------------------- | --------------------------- | -------- |
| `--pm-border`       | `rgba(255, 255, 255, 0.08)` | 标准边框 |
| `--pm-border-light` | `rgba(255, 255, 255, 0.05)` | 浅色边框 |

---

### 2.2 字体系统

#### UI 字体家族

```css
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;
```

#### 品牌字体家族

```css
/* 品牌中文标题 */
font-family: 'YouSheBiaoTiHei', 'Inter', sans-serif;

/* 品牌英文副标题 */
font-family: 'Alibaba PuHuiTi 2.0', 'Inter', sans-serif;
```

#### 字体大小规范

| 变量名            | 大小   | 行高   | 用途               |
| ----------------- | ------ | ------ | ------------------ |
| `--pm-font-xs`    | `10px` | `15px` | 标签、辅助文字     |
| `--pm-font-sm`    | `12px` | `16px` | 正文、按钮文字     |
| `--pm-font-md`    | `14px` | `20px` | 标题、导航文字     |
| `--pm-font-lg`    | `16px` | `24px` | 大标题             |
| `--pm-font-xl`    | `18px` | `24px` | 页面标题           |
| `--pm-font-2xl`   | `24px` | `32px` | 主标题             |
| `--pm-font-brand` | `64px` | `83px` | 品牌大标题（Logo） |

#### 字重规范

- **Thin (300)**: 品牌英文副标题（阿里巴巴普惠体 2.0 35 Thin）
- **Regular (400)**: 正文内容
- **Medium (500)**: 导航、按钮、强调文字
- **Semibold (600)**: 标题、重要信息
- **Bold (700)**: 数据统计、关键数字

---

### 2.3 间距系统

#### 内间距

| 变量名            | 值     | 用途                 |
| ----------------- | ------ | -------------------- |
| `--pm-spacing-xs` | `8px`  | 紧凑间距             |
| `--pm-spacing-sm` | `12px` | 小间距               |
| `--pm-spacing-md` | `16px` | 中等间距             |
| `--pm-spacing-lg` | `21px` | 大间距（卡片内间距） |
| `--pm-spacing-xl` | `24px` | 超大间距             |

#### 外边距

| 变量名           | 值     | 用途       |
| ---------------- | ------ | ---------- |
| `--pm-margin-xs` | `8px`  | 紧凑外边距 |
| `--pm-margin-sm` | `12px` | 小外边距   |
| `--pm-margin-md` | `16px` | 中等外边距 |
| `--pm-margin-lg` | `24px` | 大外边距   |
| `--pm-margin-xl` | `32px` | 超大外边距 |

#### 间隙

| 变量名        | 值     | 用途     |
| ------------- | ------ | -------- |
| `--pm-gap-xs` | `4px`  | 紧凑间隙 |
| `--pm-gap-sm` | `8px`  | 小间隙   |
| `--pm-gap-md` | `12px` | 中等间隙 |
| `--pm-gap-lg` | `16px` | 大间隙   |
| `--pm-gap-xl` | `24px` | 超大间隙 |

---

### 2.4 圆角系统

| 变量名             | 值      | 用途                     |
| ------------------ | ------- | ------------------------ |
| `--pm-radius-sm`   | `8px`   | 小圆角（按钮、输入框）   |
| `--pm-radius-md`   | `10px`  | 中等圆角（子元素、标签） |
| `--pm-radius-lg`   | `14px`  | 大圆角（导航项、按钮）   |
| `--pm-radius-xl`   | `16px`  | 超大圆角（卡片、弹窗）   |
| `--pm-radius-full` | `999px` | 全圆角（徽章、标签）     |

---

### 2.5 阴影系统

| 变量名                | 值                                                                                   | 用途             |
| --------------------- | ------------------------------------------------------------------------------------ | ---------------- |
| `--pm-shadow-sm`      | `0px 1px 2px -1px rgba(0, 0, 0, 0.1)`                                                | 小阴影           |
| `--pm-shadow-md`      | `0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)`         | 中等阴影（卡片） |
| `--pm-shadow-lg`      | `0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)`       | 大阴影（弹窗）   |
| `--pm-shadow-primary` | `0px 4px 6px -4px rgba(28, 57, 142, 0.5), 0px 10px 15px -3px rgba(28, 57, 142, 0.5)` | 主色阴影（按钮） |

---

## 三、布局规范

### 3.1 页面布局

#### 项目详情页布局

```
┌─────────────────────────────────────────────────────────────┐
│  Header (64px)                                               │
├──────┬──────────────────────────────────────────────────────┤
│      │  Breadcrumb (16px 高度)                                │
│      ├──────────────────────────────────────────────────────┤
│      │  Tabs (43px)                                           │
│  S   ├─────────────────────────────────┬────────────────────┤
│  i   │                                 │                    │
│  d   │  主内容区域                       │  侧边栏             │
│  e   │  (minmax(0, 1202px))            │  (minmax(320px,   │
│  b   │                                 │   589px))         │
│  a   │  - 项目概要卡片                   │                    │
│  r   │  - 阶段与里程碑卡片               │  - 项目概要卡片    │
│      │  - 任务树卡片(可选)               │  - 项目团队卡片    │
│      │  - 风险列表卡片(可选)             │  - 最近动态卡片    │
│      │                                 │                    │
└──────┴─────────────────────────────────┴────────────────────┘
```

#### 布局规则

- **主内容区域**: 优先级高的业务信息
- **侧边栏**: 辅助信息、概览、动态
- **卡片间距**: `24px` (`var(--pm-spacing-xl)`)
- **卡片内间距**: `21px` (`var(--pm-spacing-lg)`)

---

### 3.2 组件规范

#### 标准卡片结构

```html
<div class="card">
  <div class="card-header">
    <svg>...</svg>
    <!-- 20x20 图标 -->
    <h2>卡片标题</h2>
    <!-- 14px, font-weight: 600 -->
  </div>
  <div class="card-content">
    <!-- 卡片内容 -->
  </div>
</div>
```

#### 卡片样式规范

```css
.card {
  background: var(--pm-card);
  border: 1px solid var(--pm-border);
  border-radius: var(--pm-radius-xl); /* 16px */
  padding: var(--pm-spacing-lg); /* 21px */
  box-shadow: var(--pm-shadow-md);
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--pm-gap-md); /* 12px */
  margin-bottom: var(--pm-spacing-md); /* 16px */
}

.card-header h2 {
  font-size: var(--pm-font-md); /* 14px */
  font-weight: 600;
  color: var(--pm-text-white);
}
```

---

### 3.3 按钮规范

#### 主按钮

```css
.btn-primary {
  height: 32px;
  padding: 0 var(--pm-spacing-sm); /* 12px */
  border-radius: var(--pm-radius-lg); /* 14px */
  background: var(--pm-primary);
  color: var(--pm-text-white);
  font-size: var(--pm-font-sm); /* 12px */
  font-weight: 500;
  box-shadow: var(--pm-shadow-primary);
}
```

#### 次按钮

```css
.btn-secondary {
  height: 28px;
  padding: 0 10px;
  border-radius: var(--pm-radius-md); /* 10px */
  border: 1px solid rgba(22, 139, 217, 0.4);
  background: rgba(22, 139, 217, 0.12);
  color: #9dccff;
  font-size: var(--pm-font-sm); /* 12px */
}
```

---

### 3.4 输入框规范

```css
.input {
  height: 36px;
  padding: 0 var(--pm-spacing-sm); /* 12px */
  border-radius: var(--pm-radius-lg); /* 14px */
  border: 1px solid var(--pm-border);
  background: var(--pm-input-bg);
  font-size: var(--pm-font-md); /* 14px */
  color: var(--pm-text-white);
}

.input:focus {
  border-color: var(--pm-primary);
  outline: 1px solid rgba(21, 77, 217, 0.5);
}
```

---

## 四、响应式设计规范

### 4.1 断点系统

| 断点名称      | 最小宽度 | 用途     |
| ------------- | -------- | -------- |
| Mobile        | `768px`  | 移动设备 |
| Tablet        | `1024px` | 平板设备 |
| Desktop       | `1360px` | 桌面设备 |
| Large Desktop | `1920px` | 大屏设备 |

### 4.2 响应式规则

#### 1360px 断点

```css
@media (max-width: 1360px) {
  /* 项目详情页：单列布局 */
  .project-detail-grid {
    grid-template-columns: 1fr;
  }

  /* 侧边栏：缩小宽度 */
  .sidebar {
    width: 72px;
  }
}
```

#### 1024px 断点

```css
@media (max-width: 1024px) {
  /* 导航栏：隐藏文字 */
  .nav-item span {
    display: none;
  }

  /* 项目信息：两列布局 */
  .project-info-details {
    grid-template-columns: 1fr 1fr;
  }
}
```

#### 768px 断点

```css
@media (max-width: 768px) {
  /* 顶部栏：换行布局 */
  .topbar {
    flex-wrap: wrap;
    gap: var(--pm-gap-md);
  }

  /* 项目信息：单列布局 */
  .project-info-details {
    grid-template-columns: 1fr;
  }
}
```

---

## 五、组件开发 SOP

### 5.1 开发流程

```
1. 查看 Pixso 设计稿
   ↓
2. 标注关键尺寸和样式
   ↓
3. 创建组件文件
   ↓
4. 实现基础结构
   ↓
5. 添加样式（使用设计系统变量）
   ↓
6. 实现交互逻辑
   ↓
7. 响应式适配
   ↓
8. 视觉回归测试
   ↓
9. 代码审查
```

### 5.2 命名规范

#### 组件命名

- **页面组件**: `*Page.tsx` (如 `ProjectDetailPage.tsx`)
- **卡片组件**: `*Card.tsx` (如 `ProjectInfoCard.tsx`)
- **视图组件**: `*View.tsx` (如 `ProjectGanttView.tsx`)
- **基础组件**: 直接命名 (如 `Button.tsx`)

#### CSS 类名

- **BEM 命名**: `.block__element--modifier`
- **语义化**: 使用描述性名称 (如 `.project-info-card`)
- **状态类**: `.active`, `.disabled`, `.loading`

---

## 六、设计工具

### 6.1 Pixso 设计稿查看

```bash
# Pixso MCP 连接（需 Pixso 桌面应用运行中）
# MCP 端点: http://127.0.0.1:3667/mcp

# 设计转代码
design_to_code(itemId, clientFrameworks: "react")

# 获取节点 DSL
get_node_dsl(itemId)

# 获取设计截图
get_image(itemId)
```

### 6.2 设计稿标注工具

- **Pixso**: 设计转代码工作流（MCP）
- **Pixso**: 设计转代码工作流（MCP — 推荐，实时设计数据）
- **Figma**: 导出 JSON 标注（备选）
- **Zeplin**: 自动生成标注
- **蓝湖**: 在线标注工具

---

## 七、常见问题解决

### 7.1 布局错乱

**症状**: 组件宽度不符合预期

**解决方案**:

1. 检查父容器的 `display` 属性
2. 检查 `flex` 或 `grid` 布局配置
3. 检查 `max-width` 和 `min-width` 设置
4. 使用浏览器开发者工具检查实际渲染尺寸

### 7.2 样式不一致

**症状**: 同类组件样式不统一

**解决方案**:

1. 提取公共样式到设计系统
2. 使用 CSS 变量定义颜色、间距
3. 创建可复用的样式类
4. 避免内联样式

### 7.3 响应式问题

**症状**: 某些屏幕尺寸下显示异常

**解决方案**:

1. 使用媒体查询适配不同屏幕
2. 使用 `minmax()` 定义弹性尺寸
3. 使用 `clamp()` 定义范围值
4. 在多个断点测试布局

---

## 八、版本历史

| 版本   | 日期       | 更新内容                                                                                                                                              | 作者     |
| ------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| v2.0.0 | 2026-05-02 | 对齐 Pixso 品牌设计规范：新增品牌色板（8 色）、中文字体（优设标题黑/阿里巴巴普惠体 2.0）、品牌标识规范；更新功能色映射品牌色；新增 Pixso MCP 工具说明 | AI Agent |
| v1.1.0 | 2026-04-16 | 补充组件开发 SOP、响应式断点、常见问题                                                                                                                | AI Agent |
| v1.0.0 | 2026-04-14 | 初始版本                                                                                                                                              | AI Agent |

---

**文档维护**: AI Agent  
**最后更新**: 2026-05-02
