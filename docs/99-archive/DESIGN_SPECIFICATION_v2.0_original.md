---
id: ARC-001
number: ARC-001
domain: archive
category: archived
title: 设计规范 V2.0 原始版
status: archived
last_updated: 2026-05-05
archived_at: 2026-05-12
archived_reason: 历史归档
---

# 🎨 连锁门店建设管理系统 - 完整设计规范

> **设计理念**: Liquid Glass（液态玻璃） + Material Design 3  
> **分辨率**: 1920×1080 自适应缩放  
> **主题**: 深色模式优先，支持浅色模式切换  
> **版本**: v2.0.0  
> **最后更新**: 2026-03-13

---

## 📋 目录

### 第一部分：设计系统基础

1. [设计原则](#1-设计原则)
2. [色彩系统](#2-色彩系统)
3. [排版系统](#3-排版系统)
4. [间距系统](#4-间距系统)
5. [圆角与阴影](#5-圆角与阴影)
6. [玻璃态效果](#6-玻璃态效果)

### 第二部分：组件规范

7. [按钮组件](#7-按钮组件)
8. [卡片组件](#8-卡片组件)
9. [表单组件](#9-表单组件)
10. [标签与徽章](#10-标签与徽章)
11. [进度条](#11-进度条)
12. [增强组件库](#12-增强组件库)

### 第三部分：页面规范

13. [布局结构](#13-布局结构)
14. [一级页面规范](#14-一级页面规范)
15. [统计卡片模块](#15-统计卡片模块)
16. [工具栏设计](#16-工具栏设计)
17. [视图模式](#17-视图模式)
18. [数据筛选与分页](#18-数据筛选与分页)

### 第四部分：交互与动画

19. [交互模式](#19-交互模式)
20. [动画与过渡](#20-动画与过渡)
21. [响应式设计](#21-响应式设计)

### 第五部分：实施指南

22. [组件使用规范](#22-组件使用规范)
23. [代码示例](#23-代码示例)
24. [检查清单](#24-检查清单)
25. [页面符合性追踪](#25-页面符合性追踪)

---

# 第一部分：设计系统基础

## 1. 设计原则

### 核心理念

1. **现代科技感** - 使用玻璃态磨砂效果和半透明层次
2. **信息层级清晰** - 利用卡片、阴影和边框区分内容区域
3. **高效交互** - 减少点击次数，提升操作效率
4. **视觉统一** - 保持组件、颜色、间距的一致性
5. **响应式设计** - 适配不同屏幕尺寸（优先桌面端）

### 设计准则

#### ✅ 正确做法

- 使用统一的品牌蓝色 `#154DD9`
- 圆角使用 `rounded-xl` (12px) 或 `rounded-2xl` (16px)
- 玻璃态效果: `bg-white/[0.04]` + `border-white/8`
- 过渡动画统一 `transition-all duration-200`
- 悬停状态明确的视觉反馈

#### ❌ 错误做法

- 不要使用非品牌色的蓝色
- 避免过小的圆角 (如 4px)
- 不要使用纯色背景
- 避免过长的动画时间 (>300ms)
- 不要缺少悬停状态

---

## 2. 色彩系统

### 2.1 品牌色 (Brand Colors)

#### 品牌蓝 (Primary Blue)

```css
/* 主品牌色 */
--brand-primary: #154dd9; /* RGB(21, 77, 217) */
--brand-primary-hover: #1a5ae8; /* 悬停态 */
--brand-primary-active: #1248c5; /* 激活态 */

/* 品牌蓝梯度 */
--brand-blue-50: #e8eeff;
--brand-blue-100: #c5d5ff;
--brand-blue-200: #9bb8ff;
--brand-blue-300: #6b9aff;
--brand-blue-400: #4689ea;
--brand-blue-500: #154dd9; /* 主色 ★ */
--brand-blue-600: #1248c5;
--brand-blue-700: #0f3fa8;
--brand-blue-800: #0c358a;
--brand-blue-900: #0a2363; /* 深蓝背景 ★ */
```

#### 背景色

```css
/* 深色主题背景 */
--bg-primary: #030b1a; /* 主背景 - 深蓝黑 ★ */
--bg-secondary: #0a2363; /* 侧边栏背景 ★ */
--bg-tertiary: #0f2d5c; /* 二级背景 */

/* 玻璃态背景 */
--glass-bg-light: rgba(255, 255, 255, 0.04); /* white/4% ★ */
--glass-bg-medium: rgba(255, 255, 255, 0.06); /* white/6% */
--glass-bg-heavy: rgba(255, 255, 255, 0.08); /* white/8% */
--glass-bg-hover: rgba(255, 255, 255, 0.1); /* white/10% */
```

### 2.2 语义色彩 (Semantic Colors)

#### 状态色

```css
/* 成功 - 绿色 (Emerald) */
--success-500: #10b981;
--success-400: #34d399;
--success-bg: rgba(16, 185, 129, 0.15);
--success-border: rgba(16, 185, 129, 0.25);

/* 警告 - 琥珀色 (Amber) */
--warning-500: #f59e0b;
--warning-400: #fbbf24;
--warning-bg: rgba(245, 158, 11, 0.15);
--warning-border: rgba(245, 158, 11, 0.25);

/* 错误 - 红色 (Red) */
--error-500: #ef4444;
--error-400: #f87171;
--error-bg: rgba(239, 68, 68, 0.15);
--error-border: rgba(239, 68, 68, 0.25);

/* 信息 - 蓝色 (Blue) */
--info-500: #3b82f6;
--info-400: #60a5fa;
--info-bg: rgba(59, 130, 246, 0.15);
--info-border: rgba(59, 130, 246, 0.25);
```

#### 项目/任务状态色

```tsx
// 前期准备
{ bg: "bg-amber-500/10", dot: "bg-amber-400", bar: "bg-amber-500" }

// 进行中
{ bg: "bg-blue-500/10", dot: "bg-blue-400", bar: "bg-blue-500" }

// 暂停/阻塞
{ bg: "bg-red-500/10", dot: "bg-red-400", bar: "bg-red-500" }

// 已完成
{ bg: "bg-emerald-500/10", dot: "bg-emerald-400", bar: "bg-emerald-500" }

// 待开始
{ bg: "bg-white/8", dot: "bg-white/40", text: "text-white/50" }

// 已取消
{ bg: "bg-white/5", dot: "bg-white/20", text: "text-white/30" }
```

#### 优先级色彩

```css
/* P0 - 最高优先级 (红色) */
--priority-p0: rgba(239, 68, 68, 0.15);

/* P1 - 高优先级 (橙色) */
--priority-p1: rgba(245, 158, 11, 0.15);

/* P2 - 中优先级 (蓝色) */
--priority-p2: rgba(59, 130, 246, 0.15);

/* P3 - 低优先级 (灰色) */
--priority-p3: rgba(255, 255, 255, 0.08);
```

### 2.3 文字与边框颜色

#### 文字颜色

```css
--text-primary: rgba(255, 255, 255, 1); /* 主要文字 ★ */
--text-secondary: rgba(255, 255, 255, 0.8); /* 次要文字 */
--text-tertiary: rgba(255, 255, 255, 0.6); /* 辅助文字 */
--text-quaternary: rgba(255, 255, 255, 0.4); /* 禁用文字 */
--text-disabled: rgba(255, 255, 255, 0.25); /* 占位符 */
```

#### 边框颜色

```css
--border-primary: rgba(255, 255, 255, 0.08); /* 主边框 ★ */
--border-secondary: rgba(255, 255, 255, 0.1); /* 次边框 */
--border-hover: rgba(255, 255, 255, 0.15); /* 悬停边框 */
--border-active: rgba(255, 255, 255, 0.2); /* 激活边框 */
```

### 2.4 渐变背景

#### 统计卡片渐变

```tsx
const colorMap = {
  blue: 'from-blue-500/20 to-blue-500/5',
  emerald: 'from-emerald-500/20 to-emerald-500/5',
  violet: 'from-violet-500/20 to-violet-500/5',
  amber: 'from-amber-500/20 to-amber-500/5',
}

// 使用示例
;<div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5" />
```

#### 背景装饰光晕

```tsx
{/* 页面背景装饰 */}
<div className="absolute top-0 left-[10%] w-[600px] h-[600px]
     bg-[#154DD9]/15 rounded-full blur-[150px]" />
<div className="absolute bottom-0 right-[5%] w-[500px] h-[500px]
     bg-[#4689EA]/8 rounded-full blur-[120px]" />
```

---

## 3. 排版系统

### 3.1 字体家族

```css
/* 系统默认字体栈 */
--font-family-base:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

/* 中文优化字体 */
--font-family-zh: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;

/* 等宽字体（代码、数字） */
--font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
```

### 3.2 字号系统

```css
--text-2xs: 10px; /* 极小文字（标签、提示） */
--text-xs: 12px; /* 小文字（次要信息） ★ */
--text-sm: 14px; /* 常规小号（按钮文字） ★ */
--text-base: 16px; /* 正文（默认） */
--text-lg: 18px; /* 小标题 */
--text-xl: 20px; /* 标题 */
--text-2xl: 24px; /* 大标题 ★ */
--text-3xl: 30px; /* 特大标题 */
--text-4xl: 36px; /* 超大标题 */
--text-5xl: 48px; /* 巨大标题（首页） */
```

### 3.3 字重与行高

```css
/* 字重 */
--font-normal: 400; /* 正文 */
--font-medium: 500; /* 标题、按钮 ★ */
--font-semibold: 600; /* 强调标题 ★ */
--font-bold: 700; /* 重要标题 */

/* 行高 */
--leading-none: 1; /* 紧凑 - 标题 */
--leading-tight: 1.25; /* 较紧 - 副标题 */
--leading-normal: 1.5; /* 正常 - 正文 ★ */
--leading-relaxed: 1.75; /* 宽松 - 长文本 */
```

### 3.4 排版应用示例

```tsx
// 页面标题
<h1 className="text-2xl font-bold text-white">项目管理</h1>
<p className="text-sm text-white/50">Project Management</p>

// 卡片标题
<h3 className="text-base font-semibold text-white">上海南京路旗舰店</h3>

// 数据统计
<p className="text-3xl font-bold text-white">128</p>
<p className="text-xs text-white/50">门店总数</p>

// 正文内容
<p className="text-sm text-white/70">这是一段描述性文字...</p>

// 代码/数字
<code className="font-mono text-xs text-white/60">PRJ-2024-001</code>
```

---

## 4. 间距系统

### 4.1 间距比例

```css
/* 基础单位：4px */
--spacing-0: 0;
--spacing-0.5: 2px;
--spacing-1: 4px;
--spacing-1.5: 6px;
--spacing-2: 8px; /* ★ */
--spacing-3: 12px; /* ★ */
--spacing-4: 16px; /* ★ */
--spacing-5: 20px;
--spacing-6: 24px; /* ★ */
--spacing-8: 32px;
--spacing-10: 40px;
--spacing-12: 48px;
--spacing-16: 64px;
--spacing-20: 80px;
--spacing-24: 96px;
```

### 4.2 间距应用规范

#### 组件内边距 (Padding)

```tsx
/* 按钮 */
className = 'px-3 py-1.5' // 小号 (12px 6px)
className = 'px-4 py-2' // 中号 (16px 8px) ★
className = 'px-6 py-3' // 大号 (24px 12px)

/* 卡片 */
className = 'p-4' // 小卡片 (16px)
className = 'p-5' // 中卡片 (20px)
className = 'p-6' // 大卡片 (24px) ★

/* 输入框 */
className = 'px-3 py-2' // 标准输入框 (12px 8px)
```

#### 组件间距 (Gap/Space)

```tsx
/* 列表项 */
className = 'space-y-2' // 8px ★
className = 'space-y-3' // 12px ★

/* 表单字段 */
className = 'space-y-4' // 16px ★

/* 卡片网格 */
className = 'gap-4' // 16px ★
className = 'gap-6' // 24px

/* 页面区块 */
className = 'space-y-6' // 24px ★
className = 'mb-8' // 32px
```

---

## 5. 圆角与阴影

### 5.1 圆角系统

```css
--radius-none: 0;
--radius-sm: 6px; /* 小组件（标签） */
--radius-md: 8px; /* 输入框 */
--radius-lg: 10px; /* 按钮（默认） */
--radius-xl: 12px; /* 卡片 ★ */
--radius-2xl: 16px; /* 大卡片 ★ */
--radius-3xl: 24px; /* 特殊卡片 */
--radius-full: 9999px; /* 全圆角 ★ */
```

#### 圆角应用

```tsx
className = 'rounded-xl' // 按钮、输入框 (12px) ★
className = 'rounded-2xl' // 卡片、弹窗 (16px) ★
className = 'rounded-full' // 标签、徽章、头像 ★
className = 'rounded-lg' // 小按钮 (10px)
```

### 5.2 阴影系统

```css
/* 阴影层级 */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

/* 发光效果 */
--shadow-glow-blue: 0 0 20px rgba(21, 77, 217, 0.3);
--shadow-glow-green: 0 0 20px rgba(16, 185, 129, 0.3);
```

#### 阴影应用

```tsx
// 主按钮
className = 'shadow-lg shadow-blue-900/30'

// 活跃卡片
className = 'shadow-lg shadow-blue-900/50'

// 弹窗
className = 'shadow-xl'

// 悬停状态
className = 'hover:shadow-lg transition-all'
```

---

## 6. 玻璃态效果

### 6.1 Liquid Glass 核心样式

```tsx
/* 轻度玻璃态 - 卡片背景 ★ */
className = 'bg-white/[0.04] border border-white/8 backdrop-blur-sm'

/* 中度玻璃态 - 悬停态 */
className = 'bg-white/[0.06] border border-white/10 backdrop-blur-md'

/* 重度玻璃态 - 弹窗、模态框 */
className = 'bg-white/[0.08] border border-white/12 backdrop-blur-lg'

/* 超重度玻璃态 - 侧边栏 */
className = 'bg-[#0A2363]/90 backdrop-blur-xl border-r border-white/10'
```

### 6.2 玻璃态卡片标准

```tsx
{
  /* 基础玻璃态卡片 */
}
;<div
  className="rounded-2xl bg-white/[0.04] border border-white/8 p-6
                hover:bg-white/[0.06] hover:border-white/12
                transition-all duration-200"
>
  {/* 内容 */}
</div>

{
  /* 可点击玻璃态卡片 */
}
;<div
  className="rounded-2xl bg-white/[0.04] border border-white/8 p-5
                cursor-pointer
                hover:bg-white/[0.07] hover:border-white/15 hover:shadow-lg
                transition-all duration-200"
>
  {/* 内容 */}
</div>
```

---

# 第二部分：组件规范

## 7. 按钮组件

### 7.1 按钮变体

#### 主要按钮 (Primary)

```tsx
<Button
  className="bg-[#154DD9] hover:bg-[#1a5ae8] text-white 
                   rounded-xl h-10 px-6 gap-2 font-medium
                   shadow-lg shadow-blue-900/30
                   transition-all duration-200"
>
  <Plus size={16} />
  新建项目
</Button>
```

#### 次要按钮 (Secondary)

```tsx
<Button
  className="bg-white/5 hover:bg-white/10 
                   text-white/70 hover:text-white
                   border border-white/10
                   rounded-xl h-10 px-6 font-medium
                   transition-all duration-200"
>
  取消
</Button>
```

#### 危险按钮 (Destructive)

```tsx
<Button
  className="bg-red-500/15 hover:bg-red-500/25
                   text-red-400 hover:text-red-300
                   border border-red-500/25 hover:border-red-500/35
                   rounded-xl h-10 px-6 font-medium
                   transition-all duration-200"
>
  删除
</Button>
```

#### 幽灵按钮 (Ghost)

```tsx
<Button
  className="text-white/60 hover:bg-white/5 hover:text-white
                   rounded-xl h-8 px-3 text-sm
                   transition-all duration-200"
>
  查看更多
</Button>
```

#### 图标按钮 (Icon)

```tsx
<Button
  className="w-8 h-8 p-0 bg-white/5 hover:bg-white/10
                   text-white/70 hover:text-white
                   rounded-xl transition-all"
>
  <MoreHorizontal size={16} />
</Button>
```

### 7.2 按钮尺寸

```tsx
/* 极小号 */
className = 'h-7 px-2.5 text-xs' // 28px

/* 小号 */
className = 'h-8 px-3 text-xs' // 32px ★

/* 中号（默认） */
className = 'h-10 px-6 text-sm' // 40px ★

/* 大号 */
className = 'h-12 px-8 text-base' // 48px

/* 图标按钮 */
className = 'h-8 w-8 p-0' // 32x32
className = 'h-10 w-10 p-0' // 40x40
```

---

## 8. 卡片组件

### 8.1 基础卡片

```tsx
<div
  className="rounded-2xl bg-white/[0.04] border border-white/8 
                p-6 hover:bg-white/[0.06] hover:border-white/12
                transition-all duration-200"
>
  {/* 卡片内容 */}
</div>
```

### 8.2 统计卡片

```tsx
<div
  className="relative overflow-hidden rounded-2xl border p-5
                bg-gradient-to-br from-blue-500/20 to-blue-500/5
                border-white/8 hover:border-white/15
                cursor-pointer transition-all duration-200"
>
  {/* 头部：图标 + 趋势 */}
  <div className="flex items-start justify-between mb-3">
    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
      <Briefcase size={18} />
    </div>
    <div
      className="flex items-center gap-0.5 text-[11px] px-2 py-0.5 
                    rounded-full bg-emerald-500/15 text-emerald-400"
    >
      <ArrowUpRight size={10} />
      +12
    </div>
  </div>

  {/* 标签 */}
  <p className="text-xs text-white/50 mb-1">门店总数</p>

  {/* 数值 */}
  <p className="text-2xl font-bold text-white">128</p>

  {/* 选中状态边框 */}
  {isActive && (
    <div
      className="absolute inset-0 border-2 border-[#154DD9] 
                    rounded-2xl pointer-events-none"
    />
  )}
</div>
```

### 8.3 项目卡片

```tsx
<div
  className="rounded-2xl bg-white/[0.04] border border-white/8 
                p-4 hover:border-white/15 hover:shadow-lg
                transition-all duration-200 cursor-pointer"
>
  {/* 头部 */}
  <div className="flex items-start justify-between mb-3">
    <h3 className="text-base font-semibold text-white">上海南京路旗舰店</h3>
    <Button variant="ghost" size="icon">
      <MoreHorizontal size={16} />
    </Button>
  </div>

  {/* 项目编号 */}
  <p className="text-[10px] text-white/30 font-mono mb-3">PRJ-2024-001</p>

  {/* 进度条 */}
  <div className="mb-3">
    <div className="flex justify-between text-xs text-white/50 mb-1">
      <span>进度</span>
      <span>65%</span>
    </div>
    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
      <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }} />
    </div>
  </div>

  {/* 元信息 */}
  <div className="flex items-center gap-3 text-xs text-white/40">
    <span className="flex items-center gap-1">
      <User size={12} />
      张伟
    </span>
    <span className="flex items-center gap-1">
      <Calendar size={12} />
      2024-12-30
    </span>
  </div>
</div>
```

### 8.4 看板卡片

```tsx
<div
  className="group rounded-xl bg-white/[0.04] border border-white/8 
                hover:bg-white/[0.07] hover:border-white/12 
                transition-all duration-200 cursor-pointer p-4"
>
  <h4
    className="font-medium text-white text-sm mb-2 
                 group-hover:text-blue-300 transition-colors"
  >
    项目名称
  </h4>

  <p className="text-[10px] text-white/30 font-mono mb-3">PRJ-2024-001</p>

  {/* 进度 */}
  <div className="mb-3">
    <div className="flex justify-between text-[10px] mb-1.5">
      <span className="text-white/40">进度</span>
      <span className="text-white/60">45%</span>
    </div>
    <div className="h-1.5 w-full bg-white/8 rounded-full overflow-hidden">
      <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
    </div>
  </div>

  {/* 元数据 */}
  <div className="flex items-center justify-between text-[10px] text-white/40">
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1">
        <Target size={10} /> 3/8
      </span>
      <span className="flex items-center gap-1">
        <Users size={10} /> 5
      </span>
    </div>
    {hasIssues && (
      <span className="flex items-center gap-1 text-red-400">
        <AlertTriangle size={10} /> 2
      </span>
    )}
  </div>
</div>
```

---

## 9. 表单组件

### 9.1 文本输入框

```tsx
<Input
  placeholder="请输入项目名称"
  className="bg-white/5 border-white/8 text-white 
             placeholder:text-white/20
             focus-visible:ring-1 focus-visible:ring-white/20
             focus-visible:border-white/20
             rounded-xl h-10 px-3 text-sm"
/>
```

### 9.2 搜索框

```tsx
<div className="relative">
  <Search
    className="absolute left-3 top-1/2 -translate-y-1/2 
                     text-white/30"
    size={14}
  />
  <Input
    placeholder="搜索项目..."
    className="bg-white/5 border-white/8 pl-9 pr-3 
               text-xs text-white placeholder:text-white/30
               focus-visible:ring-1 focus-visible:ring-white/20
               focus-visible:border-white/20
               rounded-xl h-8 w-48"
  />
</div>
```

### 9.3 文本域

```tsx
<Textarea
  placeholder="请输入描述..."
  className="bg-white/5 border-white/8 text-white 
             placeholder:text-white/20 min-h-[120px]
             focus-visible:ring-1 focus-visible:ring-white/20
             focus-visible:border-white/20
             rounded-xl p-3 text-sm resize-none"
/>
```

### 9.4 选择器

```tsx
<Select>
  <SelectTrigger
    className="bg-white/5 border-white/8 text-white
                           rounded-xl h-10 px-3 text-sm"
  >
    <SelectValue placeholder="请选择状态" />
  </SelectTrigger>
  <SelectContent
    className="bg-[#0A2363]/95 backdrop-blur-xl 
                           border-white/10 rounded-xl"
  >
    <SelectItem value="active">进行中</SelectItem>
    <SelectItem value="completed">已完成</SelectItem>
  </SelectContent>
</Select>
```

---

## 10. 标签与徽章

### 10.1 状态标签

```tsx
/* 进行中 */
<Badge className="bg-blue-500/15 text-blue-400 text-xs px-2 py-0.5
                  border border-blue-500/25 rounded-full">
  进行中
</Badge>

/* 已完成 */
<Badge className="bg-emerald-500/15 text-emerald-400 text-xs px-2 py-0.5
                  border border-emerald-500/25 rounded-full">
  已完成
</Badge>

/* 阻塞/暂停 */
<Badge className="bg-red-500/15 text-red-400 text-xs px-2 py-0.5
                  border border-red-500/25 rounded-full">
  阻塞
</Badge>

/* 待开始 */
<Badge className="bg-white/8 text-white/50 text-xs px-2 py-0.5
                  border border-white/15 rounded-full">
  待开始
</Badge>
```

### 10.2 优先级标签

```tsx
<Badge className="bg-red-500/15 text-red-400 text-[9px] px-1.5 py-0.5
                  border border-red-500/25 rounded">
  P0
</Badge>

<Badge className="bg-amber-500/15 text-amber-400 text-[9px] px-1.5 py-0.5
                  border border-amber-500/25 rounded">
  P1
</Badge>
```

### 10.3 数量徽章

```tsx
<Badge
  className="bg-blue-500/20 text-blue-400 text-[9px] px-1.5 py-0.5 
                  rounded-full"
>
  12
</Badge>
```

### 10.4 趋势徽章

```tsx
/* 上升趋势 */
<div className="flex items-center gap-0.5 text-[11px] px-2 py-0.5
                rounded-full bg-emerald-500/15 text-emerald-400">
  <ArrowUpRight size={10} />
  +12%
</div>

/* 下降趋势 */
<div className="flex items-center gap-0.5 text-[11px] px-2 py-0.5
                rounded-full bg-red-500/15 text-red-400">
  <ArrowDownRight size={10} />
  -5%
</div>
```

---

## 11. 进度条

### 11.1 基础进度条

```tsx
<div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: '65%' }} />
</div>
```

### 11.2 带标签进度条

```tsx
<div className="space-y-1">
  <div className="flex justify-between text-xs text-white/50">
    <span>完成进度</span>
    <span>65%</span>
  </div>
  <div className="h-2 bg-white/8 rounded-full overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 
                    rounded-full transition-all"
      style={{ width: '65%' }}
    />
  </div>
</div>
```

### 11.3 多状态进度条

```tsx
<div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
  <div
    className={cn(
      'h-full rounded-full transition-all',
      progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
    )}
    style={{ width: `${progress}%` }}
  />
</div>
```

---

## 12. 增强组件库

### 12.1 Button Enhanced

位置：`/src/app/components/ui/button-enhanced.tsx`

#### 使用方法

```tsx
import { Button } from "../components/ui/button-enhanced";

// 主要按钮
<Button variant="primary" size="md">
  <Plus size={16} />
  新建项目
</Button>

// 次要按钮
<Button variant="secondary">取消</Button>

// 危险按钮
<Button variant="destructive">删除</Button>

// 成功按钮
<Button variant="success">保存</Button>

// 幽灵按钮
<Button variant="ghost">查看更多</Button>

// 图标按钮
<Button variant="ghost" size="icon">
  <Settings size={16} />
</Button>
```

#### 变体说明

| 变体          | 用途     | 颜色           |
| ------------- | -------- | -------------- |
| `primary`     | 主要操作 | 品牌蓝 #154DD9 |
| `secondary`   | 次要操作 | 玻璃态白色     |
| `destructive` | 危险操作 | 红色           |
| `success`     | 成功操作 | 绿色           |
| `ghost`       | 轻量操作 | 透明           |
| `outline`     | 轮廓按钮 | 边框           |
| `link`        | 链接样式 | 无背景         |

#### 尺寸说明

| 尺寸   | 高度  | 用途       |
| ------ | ----- | ---------- |
| `xs`   | 28px  | 极小按钮   |
| `sm`   | 32px  | 小按��     |
| `md`   | 40px  | 默认按钮 ★ |
| `lg`   | 48px  | 大按钮     |
| `icon` | 40x40 | 图标按钮   |

### 12.2 Badge Enhanced

位置：`/src/app/components/ui/badge-enhanced.tsx`

```tsx
import { Badge } from "../components/ui/badge-enhanced";

// 状态徽章
<Badge variant="success">已完成</Badge>
<Badge variant="info">进行中</Badge>
<Badge variant="warning">待审核</Badge>
<Badge variant="error">已阻塞</Badge>

// 优先级徽章
<Badge variant="error" size="sm">P0</Badge>
<Badge variant="warning" size="sm">P1</Badge>
```

### 12.3 Card Enhanced

位置：`/src/app/components/ui/card-enhanced.tsx`

```tsx
import { Card } from '../components/ui/card-enhanced'
;<Card variant="glass" hoverable clickable>
  <h3 className="text-base font-semibold text-white mb-2">项目名称</h3>
  <p className="text-sm text-white/60">项目描述...</p>
</Card>
```

### 12.4 Progress Enhanced

位置：`/src/app/components/ui/progress-enhanced.tsx`

```tsx
import { Progress } from '../components/ui/progress-enhanced'
;<Progress value={65} variant="gradient" showLabel className="h-2" />
```

---

# 第三部分：页面规范

## 13. 布局结构

### 13.1 标准页面结构

```tsx
<DashboardLayout
  title="页面标题"
  subtitle="Page Subtitle"
  headerRight={
    <Button variant="primary">
      <Plus size={16} />
      新建操作
    </Button>
  }
>
  <div className="space-y-6">
    {/* 1. 统计卡片区 */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 统计卡片 */}
    </div>

    {/* 2. 工具栏 */}
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* 视图切换、搜索、筛选等 */}
    </div>

    {/* 3. 主内容区 */}
    <div>
      {/* 数据展示（网格/列表/看板等） */}
    </div>

    {/* 4. 分页器 */}
    <div className="mt-4 bg-white/[0.02] border border-white/5 rounded-xl px-2">
      <PaginationFooter {...} />
    </div>
  </div>
</DashboardLayout>
```

### 13.2 网格系统

```tsx
/* 统计卡片网格 */
className = 'grid grid-cols-2 lg:grid-cols-4 gap-4'

/* 数据卡片网格 */
className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'

/* 双列布局 */
className = 'grid grid-cols-1 lg:grid-cols-2 gap-6'
```

### 13.3 容器与间距

```tsx
/* 页面内容区域 */
className = 'space-y-6' // 主要区块间距 ★

/* 卡片内容 */
className = 'space-y-4' // 内容间距

/* 列表项 */
className = 'space-y-2' // 列表间距
className = 'space-y-3' // 看板卡片间距
```

---

## 14. 一级页面规范

### 14.1 适用范围

一级页面指数据密集型管理页面，如：

- ✅ 项目管理 (`/projects`)
- ✅ 供应商管理 (`/suppliers`)
- ✅ 任务管理 (`/tasks`)
- ✅ 订单管理 (`/orders`)
- ✅ 标准管理 (`/standards`)
- ✅ 安全管理 (`/safety`)
- ✅ 合同管理 (`/contracts`)
- ✅ 成本管理 (`/costs`)
- ✅ 人员管理 (`/personnel`)

### 14.2 核心要素

#### ✅ 必须包含

1. **统计卡片行** - 2-4个可点击筛选的统计卡片
2. **工具栏** - 视图切换、搜索、分组、筛选、排序、设置
3. **多视图支持** - 至少3种（网格/列表/看板）
4. **分页功能** - 除地图/日历/看板视图外
5. **响应式设计** - 移动端2列，桌面端4列

#### 🎯 推荐包含

- 排序功能（7种排序选项）
- 设置面板（显示选项、导出功能）
- 地图视图（地理位置相关）
- 日历视图（时间相关）
- 看板视图（状态流转）

### 14.3 标准实现参考

**完全符合规范的页面：**

- **ProjectsPage** - 包含5种视图（网格/列表/看板/地图/日历）+ 排序/设置功能 ⭐
- **SuppliersPage** - 包含4种视图（网格/列表/看板/地图）+ 分组功能
- **TasksPage** - 包含3种视图（网格/列表/日历）+ 日历功能

---

## 15. 统计卡片模块

### 15.1 卡片数量与布局

```tsx
{
  /* 标准：4个统计卡片 */
}
;<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map(stat => (
    <StatCard key={stat.label} {...stat} />
  ))}
</div>
```

### 15.2 卡片数据结构

```tsx
const stats = [
  {
    label: '全部项目',
    value: '128',
    change: '+12',
    trend: 'up',
    icon: Briefcase,
    color: 'blue',
    filterKey: 'all',
  },
  {
    label: '进行中',
    value: '85',
    change: '+5',
    trend: 'up',
    icon: TrendingUp,
    color: 'emerald',
    filterKey: '进行中',
  },
  {
    label: '已完成',
    value: '32',
    change: '+7',
    trend: 'up',
    icon: CheckCircle2,
    color: 'violet',
    filterKey: '已完成',
  },
  {
    label: '风险预警',
    value: '11',
    change: '-2',
    trend: 'down',
    icon: AlertTriangle,
    color: 'amber',
    filterKey: 'risk',
  },
]
```

### 15.3 统计卡片完整实现

```tsx
{
  stats.map(stat => {
    const isActive = statusFilter === stat.filterKey

    return (
      <div
        key={stat.label}
        onClick={() => setStatusFilter(stat.filterKey)}
        className={cn(
          'relative overflow-hidden rounded-2xl border p-5',
          'bg-gradient-to-br cursor-pointer transition-all duration-200',
          colorMap[stat.color],
          isActive
            ? 'border-white/20 shadow-lg scale-[1.02]'
            : 'border-white/8 hover:border-white/15 hover:scale-[1.01]'
        )}
      >
        {/* 图标 + 趋势 */}
        <div className="flex items-start justify-between mb-3">
          <div className={cn('p-2 rounded-xl', iconBgMap[stat.color])}>
            <stat.icon size={18} />
          </div>
          <div
            className={cn(
              'flex items-center gap-0.5 text-[11px] px-2 py-0.5 rounded-full',
              stat.trend === 'up'
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-red-500/15 text-red-400'
            )}
          >
            {stat.trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {stat.change}
          </div>
        </div>

        {/* 标签 */}
        <p className={cn('text-xs mb-1', isActive ? 'text-white/70' : 'text-white/50')}>
          {stat.label}
        </p>

        {/* 数值 */}
        <p className="text-2xl font-bold text-white">{stat.value}</p>

        {/* 选中指示器 */}
        {isActive && (
          <div
            className="absolute inset-0 border-2 border-[#154DD9] 
                        rounded-2xl pointer-events-none"
          />
        )}
      </div>
    )
  })
}
```

### 15.4 颜色映射

```tsx
const colorMap: Record<string, string> = {
  blue: 'from-blue-500/20 to-blue-500/5',
  emerald: 'from-emerald-500/20 to-emerald-500/5',
  violet: 'from-violet-500/20 to-violet-500/5',
  amber: 'from-amber-500/20 to-amber-500/5',
}

const iconBgMap: Record<string, string> = {
  blue: 'bg-blue-500/20 text-blue-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  violet: 'bg-violet-500/20 text-violet-400',
  amber: 'bg-amber-500/20 text-amber-400',
}
```

---

## 16. 工具栏设计

### 16.1 工具栏布局

```tsx
<div className="flex flex-wrap items-center justify-between gap-4">
  {/* 左侧：视图切换 */}
  <div className="flex items-center gap-2">
    <ViewModeSwitcher />
  </div>

  {/* 右侧：搜索、分组、筛选、排序、设置 */}
  <div className="flex items-center gap-2">
    <SearchBox />
    <GroupMenu />
    <FilterButton />
    <SortMenu />
    <SettingsMenu />
  </div>
</div>
```

### 16.2 视图切换器

```tsx
<div className="flex bg-white/5 rounded-xl p-0.5 border border-white/8">
  <button
    onClick={() => setViewMode('grid')}
    className={cn(
      'px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs',
      viewMode === 'grid' ? 'bg-[#154DD9] text-white' : 'text-white/40 hover:text-white'
    )}
  >
    <LayoutGrid size={14} />
    网格
  </button>

  <button
    onClick={() => setViewMode('list')}
    className={cn(
      'px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs',
      viewMode === 'list' ? 'bg-[#154DD9] text-white' : 'text-white/40 hover:text-white'
    )}
  >
    <List size={14} />
    列表
  </button>

  <button
    onClick={() => setViewMode('kanban')}
    className={cn(
      'px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs',
      viewMode === 'kanban' ? 'bg-[#154DD9] text-white' : 'text-white/40 hover:text-white'
    )}
  >
    <Kanban size={14} />
    看板
  </button>

  {/* 其他视图... */}
</div>
```

### 16.3 搜索框

```tsx
<div className="relative">
  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
  <input
    type="text"
    placeholder="搜索项目..."
    value={searchQuery}
    onChange={e => setSearchQuery(e.target.value)}
    className="h-8 pl-9 pr-3 bg-white/5 border border-white/8 
               rounded-xl text-xs text-white placeholder:text-white/30 
               focus:outline-none focus:border-white/20 
               transition-colors w-48"
  />
</div>
```

### 16.4 分组下拉菜单

```tsx
<div className="relative">
  <button
    onClick={() => setShowGroupMenu(!showGroupMenu)}
    className="h-8 px-3 py-1.5 bg-white/5 border border-white/8 
               rounded-xl text-xs text-white/50 hover:bg-white/8 
               hover:text-white transition-all flex items-center gap-1.5"
  >
    <Layers size={14} />
    分组
    <ChevronDown size={12} className={cn('transition-transform', showGroupMenu && 'rotate-180')} />
  </button>

  {showGroupMenu && (
    <div
      className="absolute top-full right-0 mt-1 w-40 
                    bg-[#0a2363]/95 backdrop-blur-xl 
                    border border-white/10 rounded-xl shadow-xl 
                    overflow-hidden z-50"
    >
      <button
        className="w-full px-3 py-2 text-left text-xs 
                        text-white/60 hover:bg-white/5 hover:text-white 
                        transition-colors"
      >
        无分组
      </button>
      <button
        className="w-full px-3 py-2 text-left text-xs 
                        text-white/60 hover:bg-white/5 hover:text-white 
                        transition-colors"
      >
        按状态分组
      </button>
      <button
        className="w-full px-3 py-2 text-left text-xs 
                        text-white/60 hover:bg-white/5 hover:text-white 
                        transition-colors"
      >
        按负责人分组
      </button>
    </div>
  )}
</div>
```

### 16.5 排序下拉菜单

```tsx
<div className="relative">
  <button
    onClick={() => setShowSortMenu(!showSortMenu)}
    className="h-8 px-3 py-1.5 bg-white/5 border border-white/8 
               rounded-xl text-xs text-white/50 hover:bg-white/8 
               hover:text-white transition-all flex items-center gap-1.5"
  >
    <ArrowUpDown size={14} />
    排序
    <ChevronDown size={12} className={cn('transition-transform', showSortMenu && 'rotate-180')} />
  </button>

  {showSortMenu && (
    <div
      className="absolute top-full right-0 mt-1 w-44 
                    bg-[#0a2363]/95 backdrop-blur-xl 
                    border border-white/10 rounded-xl shadow-xl 
                    overflow-hidden z-50"
    >
      {sortOptions.map(option => (
        <button
          key={option.value}
          onClick={() => setSortBy(option.value)}
          className={cn(
            'w-full px-3 py-2 text-left text-xs transition-colors',
            sortBy === option.value
              ? 'bg-white/10 text-white'
              : 'text-white/60 hover:bg-white/5 hover:text-white'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )}
</div>
```

**标准排序选项：**

```tsx
const sortOptions = [
  { label: '默认排序', value: 'default' },
  { label: '名称 A-Z', value: 'name-asc' },
  { label: '名称 Z-A', value: 'name-desc' },
  { label: '最新创建', value: 'created-desc' },
  { label: '最早创建', value: 'created-asc' },
  { label: '最近更新', value: 'updated-desc' },
  { label: '进度升序', value: 'progress-asc' },
]
```

### 16.6 设置按钮

```tsx
<div className="relative">
  <button
    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
    className="h-8 w-8 bg-white/5 border border-white/8 
               rounded-xl text-white/50 hover:bg-white/8 
               hover:text-white transition-all 
               flex items-center justify-center"
  >
    <Settings size={14} />
  </button>

  {showSettingsMenu && (
    <div
      className="absolute top-full right-0 mt-1 w-48 
                    bg-[#0a2363]/95 backdrop-blur-xl 
                    border border-white/10 rounded-xl shadow-xl 
                    overflow-hidden z-50"
    >
      {/* 显示设置 */}
      <div className="px-3 py-2 border-b border-white/10">
        <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">显示设置</p>
      </div>

      <button
        className="w-full px-3 py-2 text-left text-xs 
                        text-white/60 hover:bg-white/5 hover:text-white 
                        transition-colors flex items-center justify-between"
      >
        <span>显示编号</span>
        <div
          className={cn(
            'w-8 h-4 rounded-full relative transition-colors',
            showCode ? 'bg-[#154DD9]' : 'bg-white/20'
          )}
        >
          <div
            className={cn(
              'w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform',
              showCode ? 'right-0.5' : 'left-0.5'
            )}
          />
        </div>
      </button>

      {/* 分隔线 */}
      <div className="border-t border-white/10 mt-1" />

      {/* 操作 */}
      <button
        className="w-full px-3 py-2.5 text-left text-xs 
                        text-white/60 hover:bg-white/5 hover:text-white 
                        transition-colors"
      >
        导出列表
      </button>
      <button
        className="w-full px-3 py-2.5 text-left text-xs 
                        text-white/60 hover:bg-white/5 hover:text-white 
                        transition-colors"
      >
        打印视图
      </button>
    </div>
  )}
</div>
```

---

## 17. 视图模式

### 17.1 视图类型

#### 必需视图（至少3种）

1. **网格视图 (Grid)** - 卡片式展示，适合概览
2. **列表视图 (List)** - 表格式展示，信息密度中等
3. **看板视图 (Kanban)** - 按状态分列，适合流程管理

#### 可选视图

4. **地图视图 (Map)** - 地理位置相关数据
5. **日历视图 (Calendar)** - 时间相关数据

### 17.2 视图状态管理

```tsx
const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban' | 'map' | 'calendar'>('grid')
```

### 17.3 网格视图

```tsx
{
  viewMode === 'grid' && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {paginatedProjects.map(project => (
        <div
          key={project.id}
          onClick={() => navigate(`/projects/${project.id}`)}
          className="rounded-2xl bg-white/[0.04] border border-white/8 
                   p-4 hover:border-white/15 hover:shadow-lg
                   transition-all duration-200 cursor-pointer"
        >
          {/* 项目卡片内容 */}
        </div>
      ))}
    </div>
  )
}
```

### 17.4 列表视图

```tsx
{
  viewMode === 'list' && (
    <div className="rounded-2xl bg-white/[0.04] border border-white/8 overflow-hidden">
      {/* 表头 */}
      <div
        className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/8 
                    text-[11px] text-white/40 font-medium"
      >
        <div className="col-span-4">项目名称</div>
        <div className="col-span-1 text-center">状态</div>
        <div className="col-span-2 text-center">进度</div>
        <div className="col-span-1 text-center">里程碑</div>
        <div className="col-span-1 text-center">任务</div>
        <div className="col-span-1 text-center">风险</div>
        <div className="col-span-1 text-center">负责人</div>
        <div className="col-span-1 text-center">操作</div>
      </div>

      {/* 数据行 */}
      {paginatedProjects.map(project => (
        <div
          key={project.id}
          onClick={() => navigate(`/projects/${project.id}`)}
          className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/5 
                   hover:bg-white/[0.04] transition-colors cursor-pointer 
                   items-center group"
        >
          {/* 列内容 */}
        </div>
      ))}
    </div>
  )
}
```

### 17.5 看板视图

```tsx
{
  viewMode === 'kanban' && (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {['前期准备', '进行中', '暂停', '已完成'].map(status => {
          const statusColors = {
            前期准备: { bg: 'bg-amber-500/10', dot: 'bg-amber-400', bar: 'bg-amber-500' },
            进行中: { bg: 'bg-blue-500/10', dot: 'bg-blue-400', bar: 'bg-blue-500' },
            暂停: { bg: 'bg-red-500/10', dot: 'bg-red-400', bar: 'bg-red-500' },
            已完成: { bg: 'bg-emerald-500/10', dot: 'bg-emerald-400', bar: 'bg-emerald-500' },
          }
          const colors = statusColors[status]
          const statusProjects = filteredProjects.filter(p => p.status === status)

          return (
            <div key={status} className="w-80 flex-shrink-0">
              <div className="rounded-2xl bg-white/[0.04] border border-white/8 overflow-hidden">
                {/* 列头 */}
                <div className={`px-4 py-3 ${colors.bg} border-b border-white/8`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                      <h3 className="text-sm font-semibold text-white">{status}</h3>
                    </div>
                    <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-lg">
                      {statusProjects.length}
                    </span>
                  </div>
                </div>

                {/* 卡片列表 */}
                <div className="p-3 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                  {statusProjects.map(project => (
                    <div key={project.id} className="...">
                      {/* 看板卡片内容 */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

### 17.6 地图视图

```tsx
{
  viewMode === 'map' && (
    <div className="rounded-2xl bg-white/[0.04] border border-white/8 overflow-hidden p-6">
      <div className="relative w-full h-[calc(100vh-320px)] min-h-[500px] rounded-xl overflow-hidden">
        {/* Leaflet Map Container */}
        <div ref={mapRef} className="w-full h-full z-0" />

        {/* Map Title Overlay */}
        <div
          className="absolute top-6 left-6 bg-black/40 backdrop-blur-md 
                      border border-white/10 rounded-xl px-4 py-2 z-[1000]"
        >
          <p className="text-xs text-white/40">项目地理分布</p>
          <p className="text-lg font-semibold text-white">全国门店建设布局</p>
        </div>
      </div>
    </div>
  )
}
```

### 17.7 日历视图

```tsx
{
  viewMode === 'calendar' && (
    <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-6">
      <ProjectCalendar projects={filteredProjects} />
    </div>
  )
}
```

### 17.8 分页显示条件

```tsx
{
  /* 地图、看板、日历视图不显示分页器 */
}
{
  viewMode !== 'map' && viewMode !== 'kanban' && viewMode !== 'calendar' && (
    <div className="mt-4 bg-white/[0.02] border border-white/5 rounded-xl px-2">
      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[10, 20, 30, 50]}
      />
    </div>
  )
}
```

---

## 18. 数据筛选与分页

### 18.1 筛选逻辑

```tsx
// 状态筛选
const filteredProjects =
  statusFilter === 'all'
    ? projects
    : statusFilter === 'risk'
      ? projects.filter(p => p.issues.open > 0)
      : projects.filter(p => p.status === statusFilter)

// 搜索筛选
const searchedProjects = searchQuery
  ? filteredProjects.filter(
      p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : filteredProjects

// 分组筛选
const groupedProjects = useMemo(() => {
  if (groupBy === 'none') {
    return { 全部: searchedProjects }
  } else if (groupBy === 'status') {
    return searchedProjects.reduce(
      (acc, project) => {
        const key = project.status
        if (!acc[key]) acc[key] = []
        acc[key].push(project)
        return acc
      },
      {} as Record<string, typeof searchedProjects>
    )
  }
  // 其他分组逻辑...
}, [searchedProjects, groupBy])
```

### 18.2 分页状态

```tsx
const [currentPage, setCurrentPage] = useState(1)
const [pageSize, setPageSize] = useState(10)

// 分页计算
const totalItems = filteredProjects.length
const totalPages = Math.ceil(totalItems / pageSize)
const startIndex = (currentPage - 1) * pageSize
const endIndex = startIndex + pageSize
const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

// 自动重置页码
useEffect(() => {
  setCurrentPage(1)
}, [statusFilter, searchQuery, pageSize, groupBy])
```

### 18.3 分页器组件

```tsx
<PaginationFooter
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  onPageChange={setCurrentPage}
  pageSize={pageSize}
  onPageSizeChange={setPageSize}
  pageSizeOptions={[10, 20, 30, 50]}
/>
```

---

# 第四部分：交互与动画

## 19. 交互模式

### 19.1 卡片点击导航

```tsx
<div onClick={() => navigate(`/projects/${project.id}`)} className="... cursor-pointer">
  {/* 卡片内容 */}
</div>
```

### 19.2 统计卡片筛选

```tsx
<div onClick={() => setStatusFilter(stat.filterKey)} className="... cursor-pointer">
  {/* 统计内容 */}
</div>
```

### 19.3 视觉反馈

#### 悬停状态

```tsx
// 卡片悬停
className = 'hover:bg-white/[0.07] hover:border-white/12 hover:shadow-lg'

// 按钮悬停
className = 'hover:bg-[#1a5ae8] hover:scale-105'

// 文字悬停
className = 'hover:text-blue-300'
```

#### 选中状态

```tsx
// 蓝色边框指示
{isActive && (
  <div className="absolute inset-0 border-2 border-[#154DD9]
                  rounded-2xl pointer-events-none" />
)}

// 背景高亮
className={cn(
  "...",
  isActive ? "bg-white/10" : "bg-white/5"
)}
```

#### 禁用状态

```tsx
className={cn(
  "...",
  disabled && "opacity-50 cursor-not-allowed"
)}
```

---

## 20. 动画与过渡

### 20.1 标准过渡

```tsx
// 统一过渡时间：200ms
className = 'transition-all duration-200'

// 快速过渡：150ms
className = 'transition-all duration-150'

// 缓慢过渡：300ms
className = 'transition-all duration-300'

// 仅颜色过渡
className = 'transition-colors duration-200'
```

### 20.2 缩放动画

```tsx
// 悬停缩放
className="hover:scale-[1.01]"      // 卡片
className="hover:scale-105"         // 按钮

// 选中缩放
className={cn(
  "transition-all",
  isActive ? "scale-[1.02]" : "scale-100"
)}
```

### 20.3 旋转动画

```tsx
// 下拉箭头旋转
className={cn(
  "transition-transform",
  isOpen && "rotate-180"
)}
```

### 20.4 加载动画

```tsx
// 旋转加载器
;<div
  className="inline-block h-8 w-8 animate-spin rounded-full 
                border-4 border-solid border-blue-600 
                border-r-transparent"
/>

// 脉冲动画
className = 'animate-pulse'

// 淡入动画
className = 'animate-in fade-in duration-200'
```

---

## 21. 响应式设计

### 21.1 断点系统

```css
sm: 640px    /* 小屏幕（平板竖屏） */
md: 768px    /* 中屏幕（平板横屏） */
lg: 1024px   /* 大屏幕（小笔记本） */
xl: 1280px   /* 超大屏幕（桌面） */
2xl: 1536px  /* 2K 屏幕 */
```

### 21.2 响应式网格

```tsx
// 统计卡片：移动端2列，桌面端4列
className = 'grid grid-cols-2 lg:grid-cols-4 gap-4'

// 数据卡片：渐进式响应
className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'

// 双列布局
className = 'grid grid-cols-1 lg:grid-cols-2 gap-6'
```

### 21.3 响应式显示

```tsx
// 移动端隐藏，桌面端显示
className = 'hidden lg:block'

// 移动端显示，桌面端隐藏
className = 'block lg:hidden'

// 响应式方向
className = 'flex flex-col md:flex-row gap-4'
```

### 21.4 响应式文字

```tsx
// 标题
className = 'text-xl md:text-2xl lg:text-3xl'

// 正文
className = 'text-sm md:text-base'
```

### 21.5 响应式间距

```tsx
// 内边距
className = 'p-4 md:p-6 lg:p-8'

// 外边距
className = 'mb-4 md:mb-6 lg:mb-8'

// 间距
className = 'gap-2 md:gap-4 lg:gap-6'
```

---

# 第五部分：实施指南

## 22. 组件使用规范

### 22.1 正确做法 ✅

```tsx
// ✅ 使用增强按钮
import { Button } from "../components/ui/button-enhanced";
<Button variant="primary" size="md">新建</Button>

// ✅ 使用玻璃态卡片
<div className="rounded-2xl bg-white/[0.04] border border-white/8 p-6">
  内容
</div>

// ✅ 使用品牌色
className="bg-[#154DD9] hover:bg-[#1a5ae8]"

// ✅ 使用标准圆角
className="rounded-xl"  // 12px
className="rounded-2xl" // 16px

// ✅ 使用过渡动画
className="transition-all duration-200"
```

### 22.2 错误做法 ❌

```tsx
// ❌ 手动添加样式
<button className="bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2">
  新建
</button>

// ❌ 使用纯色背景
<div className="bg-gray-800 p-6">
  内容
</div>

// ❌ 使用非品牌色
className="bg-blue-600"  // 应使用 #154DD9

// ❌ 使用过小的圆角
className="rounded"      // 4px，应使用 rounded-xl

// ❌ 缺少过渡动画
className="hover:bg-white/10"  // 应添加 transition-all
```

---

## 23. 代码示例

### 23.1 完整一级页面模板

```tsx
import { useState, useEffect } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { Button } from '../components/ui/button'
import { PaginationFooter } from '../components/PaginationFooter'
import { useNavigate } from 'react-router'
import { cn } from '../../lib/utils'
import {
  Plus,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  LayoutGrid,
  List,
  Kanban,
  Search,
  Layers,
  ArrowUpDown,
  Settings,
  ChevronDown,
  MoreHorizontal,
} from 'lucide-react'

// 统计数据
const stats = [
  {
    label: '全部项目',
    value: '128',
    change: '+12',
    trend: 'up',
    icon: Briefcase,
    color: 'blue',
    filterKey: 'all',
  },
  {
    label: '进行中',
    value: '85',
    change: '+5',
    trend: 'up',
    icon: TrendingUp,
    color: 'emerald',
    filterKey: '进行中',
  },
  {
    label: '已完成',
    value: '32',
    change: '+7',
    trend: 'up',
    icon: CheckCircle2,
    color: 'violet',
    filterKey: '已完成',
  },
  {
    label: '风险预警',
    value: '11',
    change: '-2',
    trend: 'down',
    icon: AlertTriangle,
    color: 'amber',
    filterKey: 'risk',
  },
]

// 颜色映射
const colorMap: Record<string, string> = {
  blue: 'from-blue-500/20 to-blue-500/5',
  emerald: 'from-emerald-500/20 to-emerald-500/5',
  violet: 'from-violet-500/20 to-violet-500/5',
  amber: 'from-amber-500/20 to-amber-500/5',
}

const iconBgMap: Record<string, string> = {
  blue: 'bg-blue-500/20 text-blue-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  violet: 'bg-violet-500/20 text-violet-400',
  amber: 'bg-amber-500/20 text-amber-400',
}

export function ProjectsPage() {
  // 状态管理
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [groupBy, setGroupBy] = useState<string>('none')
  const [showGroupMenu, setShowGroupMenu] = useState(false)

  const navigate = useNavigate()

  // 数据筛选
  const filteredProjects =
    statusFilter === 'all'
      ? mockProjects
      : statusFilter === 'risk'
        ? mockProjects.filter(p => p.issues.open > 0)
        : mockProjects.filter(p => p.status === statusFilter)

  // 搜索筛选
  const searchedProjects = searchQuery
    ? filteredProjects.filter(
        p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredProjects

  // 分页
  const totalItems = searchedProjects.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const paginatedProjects = searchedProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // 自动重置页码
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, searchQuery, pageSize])

  return (
    <DashboardLayout
      title="项目管理"
      subtitle="Project Management"
      headerRight={
        <Button
          className="bg-[#154DD9] hover:bg-[#1a5ae8] text-white 
                           rounded-xl h-8 px-4 gap-2 text-xs"
        >
          <Plus size={14} />
          新建项目
        </Button>
      }
    >
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => {
            const isActive = statusFilter === stat.filterKey
            return (
              <div
                key={stat.label}
                onClick={() => setStatusFilter(stat.filterKey)}
                className={cn(
                  'relative overflow-hidden rounded-2xl border p-5',
                  'bg-gradient-to-br cursor-pointer transition-all duration-200',
                  colorMap[stat.color],
                  isActive
                    ? 'border-white/20 shadow-lg scale-[1.02]'
                    : 'border-white/8 hover:border-white/15 hover:scale-[1.01]'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('p-2 rounded-xl', iconBgMap[stat.color])}>
                    <stat.icon size={18} />
                  </div>
                  <div
                    className={cn(
                      'flex items-center gap-0.5 text-[11px] px-2 py-0.5 rounded-full',
                      stat.trend === 'up'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-red-500/15 text-red-400'
                    )}
                  >
                    {stat.change}
                  </div>
                </div>
                <p className={cn('text-xs mb-1', isActive ? 'text-white/70' : 'text-white/50')}>
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                {isActive && (
                  <div
                    className="absolute inset-0 border-2 border-[#154DD9] 
                                  rounded-2xl pointer-events-none"
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* 工具栏 */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* 左侧：视图切换 */}
          <div className="flex items-center gap-2">
            <div className="flex bg-white/5 rounded-xl p-0.5 border border-white/8">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs',
                  viewMode === 'grid' ? 'bg-[#154DD9] text-white' : 'text-white/40 hover:text-white'
                )}
              >
                <LayoutGrid size={14} />
                网格
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs',
                  viewMode === 'list' ? 'bg-[#154DD9] text-white' : 'text-white/40 hover:text-white'
                )}
              >
                <List size={14} />
                列表
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={cn(
                  'px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs',
                  viewMode === 'kanban'
                    ? 'bg-[#154DD9] text-white'
                    : 'text-white/40 hover:text-white'
                )}
              >
                <Kanban size={14} />
                看板
              </button>
            </div>
          </div>

          {/* 右侧：搜索、分组 */}
          <div className="flex items-center gap-2">
            {/* 搜索框 */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="text"
                placeholder="搜索项目..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-8 pl-9 pr-3 bg-white/5 border border-white/8 
                           rounded-xl text-xs text-white placeholder:text-white/30 
                           focus:outline-none focus:border-white/20 
                           transition-colors w-48"
              />
            </div>

            {/* 分组菜单 */}
            <div className="relative">
              <button
                onClick={() => setShowGroupMenu(!showGroupMenu)}
                className="h-8 px-3 py-1.5 bg-white/5 border border-white/8 
                           rounded-xl text-xs text-white/50 hover:bg-white/8 
                           hover:text-white transition-all flex items-center gap-1.5"
              >
                <Layers size={14} />
                分组
                <ChevronDown
                  size={12}
                  className={cn('transition-transform', showGroupMenu && 'rotate-180')}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div>
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedProjects.map(project => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="rounded-2xl bg-white/[0.04] border border-white/8 
                             p-4 hover:border-white/15 hover:shadow-lg
                             transition-all duration-200 cursor-pointer"
                >
                  {/* 项目卡片内容 */}
                </div>
              ))}
            </div>
          )}
          {/* 其他视图... */}
        </div>

        {/* 分页 */}
        {viewMode !== 'kanban' && (
          <div className="mt-4 bg-white/[0.02] border border-white/5 rounded-xl px-2">
            <PaginationFooter
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 20, 30, 50]}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
```

---

## 24. 检查清单

### 24.1 新组件开发检查

- [ ] 使用统一的颜色变量
- [ ] 遵循圆角规范（`rounded-xl`, `rounded-2xl`）
- [ ] 应用玻璃态效果（`bg-white/[0.04]`, `border-white/8`）
- [ ] 添加过渡动画（`transition-all duration-200`）
- [ ] 实现悬停状态（`hover:`）
- [ ] 支持深色模式
- [ ] 响应式设计（使用断点）
- [ ] 添加 ARIA 标签
- [ ] 测试键盘导航

### 24.2 页面开发检查

- [ ] 使用 `DashboardLayout` 包裹
- [ ] 添加页面标题和副标题（中英文）
- [ ] 实现统计卡片行（2-4个）
- [ ] 统计卡片可点击筛选
- [ ] 统计卡片有选中状态指示
- [ ] 工具栏包含视图切换器
- [ ] 至少支持网格、列表、看板三种视图
- [ ] 实现搜索功能
- [ ] 实现分组功能（可选）
- [ ] 实现排序功能（可选）
- [ ] 实现设置面板（可选）
- [ ] 实现分页功能（除地图/日历/看板视图外）
- [ ] 筛选/搜索/分页变化时重置页码
- [ ] 所有卡片可点击导航到详情页
- [ ] 响应式设计：移动端 2 列，桌面端 4 列
- [ ] 悬停/选中有明确视觉反馈
- [ ] 过渡动画流畅（200ms）
- [ ] 空状态友好提示
- [ ] 加载状态处理
- [ ] 错误状态处理

---

## 25. 页面符合性追踪

### 25.1 符合性总览

| 状态        | 数量 | 百分比 |
| ----------- | ---- | ------ |
| ✅ 完全符合 | 3    | 9.4%   |
| 🔄 部分符合 | 2    | 6.3%   |
| ⏳ 待调整   | 6    | 18.8%  |
| ❌ 不适用   | 21   | 65.6%  |

### 25.2 完全符合规范的页面

#### 1. 项目管理 (ProjectsPage) ⭐

**视图支持（5种）：**

- ✅ 网格视图
- ✅ 列表视图
- ✅ 看板视图
- ✅ 地图视图
- ✅ 日历视图

**功能支持：**

- ✅ 统计卡片筛选（4个卡片）
- ✅ 搜索功能
- ✅ 分组功能（4种分组方式）
- ✅ 筛选功能
- ✅ 排序功能（7种排序选项）
- ✅ 设置面板（显示选项、导出功能）
- ✅ 分页控制

**特色功能：**

- 🗺️ Leaflet 地图集成
- 📅 项目日历时间线
- 📊 看板流程管理
- 🎨 完整的 Liquid Glass 设计

#### 2. 供应商管理 (SuppliersPage)

**视图支持（4种）：**

- ✅ 网格视图
- ✅ 列表视图
- ✅ 看板视图
- ✅ 地图视图

**功能支持：**

- ✅ 统计卡片筛选
- ✅ 搜索功能
- ✅ 分组功能
- ✅ 分页控制

#### 3. 任务管理 (TasksPage)

**视图支持（3种）：**

- ✅ 网格视图
- ✅ 列表视图
- ✅ 日历视图

**功能支持：**

- ✅ 统计卡片筛选
- ✅ 搜索功能
- ✅ 分页控制
- ✅ 任务日历

### 25.3 高优先级待调整页面

1. **订单管理 (OrdersPage)** - 需要增加看板视图
2. **标准管理 (StandardsPage)** - 需要完善工具栏
3. **安全管理 (SafetyPage)** - 需要增加视图模式

### 25.4 实现进度

```
总页面数: 32
- 完全符合: 3 (9.4%)
- 部分符合: 2 (6.3%)
- 待调整: 6 (18.8%)
- 不适用: 21 (65.6%)
```

**目标：** 将12个数据管理页面调整为完全符合规范（37.5%符合率）

---

## 📚 附录

### A. 快速参考

#### 核心颜色

```css
品牌蓝: #154DD9
悬停态: #1a5ae8
深蓝背景: #0A2363
主背景: #030B1A
```

#### 常用样式

```tsx
// 玻璃态卡片
className = 'rounded-2xl bg-white/[0.04] border border-white/8 p-6'

// 主按钮
className = 'bg-[#154DD9] hover:bg-[#1a5ae8] text-white rounded-xl h-10 px-6'

// 状态标签
className =
  'bg-blue-500/15 text-blue-400 border border-blue-500/25 text-xs px-2 py-0.5 rounded-full'
```

### B. 技术栈

- **UI 框架**: React 18.3
- **样式**: Tailwind CSS v4
- **组件库**: Radix UI
- **图标**: Lucide React
- **图表**: Recharts
- **路由**: React Router v7
- **地图**: Leaflet

### C. 相关资源

- [Material Design 3](https://m3.material.io/)
- [Glassmorphism Generator](https://hype4.academy/tools/glassmorphism-generator)
- [Tailwind CSS](https://tailwindcss.com/)
- [Coolors](https://coolors.co/)

---

**版本**: v2.0.0  
**最后更新**: 2026-03-13  
**维护者**: 设计团队

---

**文档说明：**

本文档整合了以下内容：

- ✅ 完整设计系统 (DESIGN_SYSTEM.md)
- ✅ 组件标准 (COMPONENT_STANDARDS.md)
- ✅ 一级页面规范 (PRIMARY_PAGE_SPECIFICATION.md)
- ✅ 页面符合性报告 (PRIMARY_PAGE_COMPLIANCE.md)
- ✅ 设计索引 (DESIGN_INDEX.md)
- ✅ 快速参考 (DESIGN_QUICK_REFERENCE.md)
- ✅ 组件示例 (DESIGN_COMPONENTS_EXAMPLES.md)

**使用建议：**

- 🎨 设计师：重点阅读第一、二部分（设计系统基础、组件规范）
- 💻 前端开发：重点阅读第二、三、五部分（组件规范、页面规范、实施指南）
- 🎯 项目经理：重点阅读第三、五部分（页面规范、实施指南）
- 📚 新成员：按顺序阅读全文，建议配合 `/design-system` 路由查看实际效果
