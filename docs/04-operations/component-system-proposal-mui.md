# 列表、按钮、输入框组件化方案 —— 基于 MUI + 设计规范

## 一、现状诊断

### 1.1 环境现状

**MUI 已安装但未使用：**

```json
"@mui/material": "^9.0.0",
"@mui/icons-material": "^9.0.0",
"@emotion/react": "^11.14.0",
"@emotion/styled": "^11.14.1"
```

全代码库扫描结果：

- **MUI 组件实际使用**：仅 `TaskDetailPage.tsx` 中使用了 `InputLabel`（1 处）
- **Emotion styled**：未使用

### 1.2 按钮现状（304+ 处）

| 类型         | 实现方式        | 示例类名             | 分布                    |
| ------------ | --------------- | -------------------- | ----------------------- |
| 视图切换按钮 | 原生 `<button>` | `.pm-view-btn`       | CustomerManagementPage  |
| 筛选按钮     | 原生 `<button>` | `.pm-filter-btn`     | 多个页面                |
| 行内操作按钮 | 原生 `<button>` | `.cm-row-action`     | CustomerManagementPage  |
| 分页按钮     | 原生 `<button>` | `.pm-page-btn`       | 多个页面                |
| 主操作按钮   | 原生 `<button>` | `.pm-add-user-btn`   | 各页面                  |
| 次要按钮     | 原生 `<button>` | `.pm-btn-secondary`  | CreateProjectModeModal  |
| 图标按钮     | 原生 `<button>` | `.pm-icon-btn`       | PersonnelUserDetailPage |
| 幽灵按钮     | 原生 `<button>` | `.pud-outline-btn`   | PersonnelUserDetailPage |
| 强调按钮     | 原生 `<button>` | `.tm-btn-accent`     | TaskManagementPage      |
| 卡片操作按钮 | 原生 `<button>` | `.member-action-btn` | ProjectMembersCard      |

**问题：** 每个页面自己造轮子，同一语义按钮（如"次要按钮"）在不同页面有不同的类名和样式定义。

### 1.3 输入框现状（52+ 处）

| 类型         | 实现方式                   | 示例类名                | 分布                          |
| ------------ | -------------------------- | ----------------------- | ----------------------------- |
| 搜索框       | 原生 `<input>` + wrap      | `.pm-search-input-wrap` | 几乎所有页面                  |
| 表单文本输入 | 原生 `<input>`             | 无类名/行内样式         | CreateProjectModeModal        |
| 日期选择     | 原生 `<input type="date">` | 无类名                  | CreateProjectModeModal        |
| 文件上传     | 原生 `<input type="file">` | `hidden`                | TaskDetailPage                |
| 表格内编辑   | 原生 `<input>`             | 无类名                  | UserTable、ProjectMembersView |

**问题：** 搜索框的 `.pm-search-input-wrap` 在各页面重复定义，但前缀不同（`.cm-search-sm`、`.fm-search-input`、`.tm-search-input-wrap`）。

### 1.4 列表/表格现状（52+ 处）

| 模块        | 表格类名           | 特点                |
| ----------- | ------------------ | ------------------- |
| Project     | `.pm-table`        | 标准表格            |
| Task        | `.tm-table`        | 标准表格 + 树形表格 |
| Customer    | `.cm-table`        | 标准表格            |
| Order       | `.om-table`        | 标准表格 + 日志表格 |
| Personnel   | `.pm-table`        | 用户表格            |
| Resource    | `.rp-table`        | 资源表格（两套）    |
| Procurement | `.pcm-table`       | 供应商表格          |
| Facility    | `.fm-table`        | 设施表格            |
| Standard    | `.sm-table`        | 标准表格            |
| Digital     | `.de-list-table-*` | `div` 模拟表格      |

**问题：** 每个模块一套表格 CSS，结构几乎相同（thead/tr/th + tbody/tr/td + 操作列），但各自维护。

### 1.5 与设计规范的差距

设计规范 `docs/00-governance/design-specification.md` 已经定义了标准的按钮和输入框样式：

```css
/* 规范中的主按钮 */
.btn-primary {
  height: 32px;
  padding: 0 12px;
  border-radius: 14px;
  background: var(--pm-primary);
  color: var(--pm-text-white);
  font-size: 12px;
  font-weight: 500;
  box-shadow: var(--pm-shadow-primary);
}

/* 规范中的输入框 */
.input {
  height: 36px;
  padding: 0 12px;
  border-radius: 14px;
  border: 1px solid var(--pm-border);
  background: var(--pm-input-bg);
  font-size: 14px;
  color: var(--pm-text-white);
}
```

**但规范中的样式没有形成组件，各页面仍然各自实现。**

---

## 二、方案总览

### 2.1 核心思路

**"MUI Theme 定制 + 业务组件封装"双层架构**

```
┌─────────────────────────────────────────┐
│  业务层：PmButton / PmInput / PmTable    │  ← 项目专用，封装交互逻辑
│  （src/components/shared/ui/）            │
├─────────────────────────────────────────┤
│  MUI 层：Button / TextField / DataGrid   │  ← 基础交互、无障碍、动画
│  （@mui/material）                       │
├─────────────────────────────────────────┤
│  Theme 层：pmTheme（暗色玻璃态定制）      │  ← 视觉规范映射
│  （src/theme/pmTheme.ts）                │
└─────────────────────────────────────────┘
```

### 2.2 为什么选 MUI（而非纯自研）

| 能力         | MUI 提供                               | 当前自研状态             |
| ------------ | -------------------------------------- | ------------------------ |
| 暗色主题     | ✅ 内置 `darkMode`                     | ❌ 手动维护 `--pm-*`     |
| 无障碍       | ✅ ARIA 自动处理                       | ⚠️ 部分有 `aria-label`   |
| 焦点管理     | ✅ 自动焦点环                          | ❌ 部分有 `:focus` 样式  |
| 键盘导航     | ✅ 内置                                | ❌ 未系统处理            |
| 动画/过渡    | ✅ 内置                                | ❌ 手动写 CSS            |
| 响应式       | ✅ Grid/Breakpoint                     | ❌ 部分有媒体查询        |
| 表单验证     | ✅ TextField 集成                      | ❌ 无统一方案            |
| 表格高级功能 | ✅ DataGrid（排序/筛选/分页/列宽调整） | ❌ 手动实现分页          |
| 设计令牌     | ✅ Theme 系统                          | ⚠️ 有 CSS 变量但未组件化 |

**结论：** MUI 已经安装，不用白不用。重点不是"要不要用 MUI"，而是"怎么用 MUI 匹配我们的设计规范"。

---

## 三、Theme 定制方案

### 3.1 创建 `src/theme/pmTheme.ts`

```typescript
import { createTheme } from '@mui/material/styles'

// 将设计规范映射到 MUI Theme
export const pmTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#051338',
      paper: 'rgba(255, 255, 255, 0.04)', // --pm-card
    },
    primary: {
      main: '#154DD9',
      light: '#1a5ae8',
      dark: '#1248c5',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.70)',
      disabled: 'rgba(255, 255, 255, 0.40)',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    // 功能色映射
    info: { main: '#2B7FFF', light: '#51A2FF' },
    success: { main: '#00BC7D', light: '#00D492' },
    warning: { main: '#FE9A00', light: '#FFB900' },
    error: { main: '#FB2C36' },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    // 规范映射
    fontSize: 12, // 基准
    h1: { fontSize: 24, fontWeight: 700, lineHeight: '32px' },
    h2: { fontSize: 18, fontWeight: 600, lineHeight: '24px' },
    h3: { fontSize: 16, fontWeight: 600, lineHeight: '24px' },
    body1: { fontSize: 14, fontWeight: 400, lineHeight: '20px' },
    body2: { fontSize: 12, fontWeight: 400, lineHeight: '16px' },
    button: { fontSize: 12, fontWeight: 500, textTransform: 'none' }, // 规范：12px, 500, 不大写
  },
  shape: {
    borderRadius: 14, // --pm-radius-lg，默认圆角
  },
  spacing: (factor: number) => `${factor * 4}px`, // 4px 基准
  components: {
    // ===== Button 定制 =====
    MuiButton: {
      styleOverrides: {
        root: {
          height: 32,
          padding: '0 12px',
          borderRadius: 14,
          fontSize: 12,
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:focus-visible': {
            outline: '2px solid rgba(21, 77, 217, 0.5)',
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          boxShadow:
            '0px 4px 6px -4px rgba(28, 57, 142, 0.5), 0px 10px 15px -3px rgba(28, 57, 142, 0.5)',
          '&:hover': {
            boxShadow:
              '0px 6px 10px -4px rgba(28, 57, 142, 0.6), 0px 12px 20px -5px rgba(28, 57, 142, 0.6)',
          },
        },
        outlined: {
          borderColor: 'rgba(81, 162, 255, 0.4)',
          backgroundColor: 'rgba(43, 127, 255, 0.12)',
          color: '#9dccff',
          '&:hover': {
            borderColor: 'rgba(81, 162, 255, 0.6)',
            backgroundColor: 'rgba(43, 127, 255, 0.18)',
          },
        },
        sizeSmall: {
          height: 28,
          padding: '0 10px',
          borderRadius: 10,
          fontSize: 12,
        },
      },
    },
    // ===== TextField / Input 定制 =====
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: 36,
          borderRadius: 14,
          backgroundColor: 'rgba(255, 255, 255, 0.05)', // --pm-input-bg
          fontSize: 14,
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.08)', // --pm-border
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#154DD9',
            borderWidth: 1,
          },
        },
        input: {
          padding: '0 12px',
          color: '#ffffff',
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.30)',
            opacity: 1,
          },
        },
      },
    },
    // ===== Table 定制 =====
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: 12,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px 16px',
          color: 'rgba(255, 255, 255, 0.70)',
        },
        head: {
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.50)',
          backgroundColor: 'transparent',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
          },
        },
      },
    },
    // ===== Pagination 定制 =====
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontSize: 12,
          minWidth: 28,
          height: 28,
          color: 'rgba(255, 255, 255, 0.70)',
          '&.Mui-selected': {
            backgroundColor: 'rgba(43, 127, 255, 0.20)',
            color: '#ffffff',
            border: '1px solid rgba(43, 127, 255, 0.40)',
          },
        },
      },
    },
  },
})
```

### 3.2 ThemeProvider 接入

```typescript
// src/main.tsx
import { ThemeProvider } from '@mui/material/styles';
import { pmTheme } from './theme/pmTheme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={pmTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

---

## 四、业务组件封装

### 4.1 PmButton（按钮）

```typescript
// src/components/shared/ui/PmButton.tsx
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import type { ButtonProps } from '@mui/material/Button';

type PmButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';

interface PmButtonProps extends Omit<ButtonProps, 'variant' | 'color' | 'size'> {
  pmVariant?: PmButtonVariant;
  pmSize?: 'sm' | 'md';
  loading?: boolean;
}

const StyledButton = styled(Button)<{ pmVariant?: PmButtonVariant; pmSize?: 'sm' | 'md' }>(
  ({ theme, pmVariant = 'primary', pmSize = 'md' }) => {
    const base = {
      borderRadius: pmSize === 'sm' ? 10 : 14,
      height: pmSize === 'sm' ? 28 : 32,
      padding: pmSize === 'sm' ? '0 10px' : '0 12px',
      fontSize: 12,
      fontWeight: 500,
      textTransform: 'none' as const,
      gap: '6px',
    };

    const variants: Record<PmButtonVariant, object> = {
      primary: {
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #2b6be8 100%)`,
        color: '#fff',
        border: '1px solid rgba(81, 162, 255, 0.3)',
        boxShadow: '0 2px 8px rgba(21, 77, 217, 0.35)',
        '&:hover': {
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, #3a7af0 100%)`,
          boxShadow: '0 4px 16px rgba(21, 77, 217, 0.5)',
          transform: 'translateY(-1px)',
        },
      },
      secondary: {
        background: 'rgba(43, 127, 255, 0.12)',
        color: '#9dccff',
        border: '1px solid rgba(81, 162, 255, 0.4)',
        '&:hover': {
          background: 'rgba(43, 127, 255, 0.18)',
          borderColor: 'rgba(81, 162, 255, 0.6)',
        },
      },
      ghost: {
        background: 'transparent',
        color: 'rgba(255, 255, 255, 0.70)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.12)',
        },
      },
      danger: {
        background: 'rgba(251, 44, 54, 0.14)',
        color: '#ff6b6b',
        border: '1px solid rgba(251, 44, 54, 0.35)',
        '&:hover': {
          background: 'rgba(251, 44, 54, 0.22)',
        },
      },
      icon: {
        minWidth: 'unset',
        width: 34,
        height: 34,
        padding: 0,
        borderRadius: 10,
        background: 'transparent',
        color: 'rgba(255, 255, 255, 0.60)',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.06)',
          color: 'rgba(255, 255, 255, 0.85)',
        },
      },
    };

    return { ...base, ...variants[pmVariant] };
  }
);

export function PmButton({ pmVariant = 'primary', pmSize = 'md', loading, children, disabled, ...props }: PmButtonProps) {
  return (
    <StyledButton
      pmVariant={pmVariant}
      pmSize={pmSize}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="pm-spinner" style={{ width: 14, height: 14 }} />
          {children}
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
}
```

**使用方式：**

```tsx
{
  /* 替换原生的 pm-add-user-btn */
}
;<PmButton pmVariant="primary" startIcon={<AddIcon />}>
  新增客户
</PmButton>

{
  /* 替换 pm-filter-btn */
}
;<PmButton pmVariant="ghost" pmSize="sm">
  筛选
</PmButton>

{
  /* 替换 cm-row-action */
}
;<PmButton pmVariant="secondary" pmSize="sm">
  查看
</PmButton>

{
  /* 替换 pm-icon-btn */
}
;<PmButton pmVariant="icon" aria-label="通知">
  <BellIcon />
</PmButton>
```

### 4.2 PmInput（输入框）

```typescript
// src/components/shared/ui/PmInput.tsx
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import type { TextFieldProps } from '@mui/material/TextField';

interface PmInputProps extends Omit<TextFieldProps, 'variant' | 'size'> {
  pmSize?: 'sm' | 'md';
  pmVariant?: 'default' | 'search';
}

const StyledTextField = styled(TextField)<{ pmSize?: 'sm' | 'md'; pmVariant?: 'default' | 'search' }>(
  ({ theme, pmSize = 'md', pmVariant = 'default' }) => ({
    '& .MuiOutlinedInput-root': {
      height: pmSize === 'sm' ? 32 : 36,
      borderRadius: pmVariant === 'search' ? 999 : 14,
      backgroundColor: pmVariant === 'search' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.05)',
      fontSize: 12,
      '& fieldset': {
        borderColor: pmVariant === 'search' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.08)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.12)',
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
    '& .MuiInputBase-input': {
      padding: pmSize === 'sm' ? '0 12px' : '0 14px',
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.30)',
        opacity: 1,
      },
    },
  })
);

export function PmInput({ pmSize = 'md', pmVariant = 'default', ...props }: PmInputProps) {
  return (
    <StyledTextField
      pmSize={pmSize}
      pmVariant={pmVariant}
      variant="outlined"
      fullWidth
      {...props}
    />
  );
}

// 搜索框快捷组件
export function PmSearchInput(props: Omit<PmInputProps, 'pmVariant'>) {
  return (
    <PmInput
      pmVariant="search"
      placeholder="搜索..."
      InputProps={{
        startAdornment: (
          <SearchIcon style={{ color: 'rgba(255,255,255,0.3)', marginRight: 8, fontSize: 16 }} />
        ),
      }}
      {...props}
    />
  );
}
```

**使用方式：**

```tsx
{
  /* 替换 pm-search-input-wrap */
}
;<PmSearchInput value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />

{
  /* 表单输入 */
}
;<PmInput
  label="项目名称"
  placeholder="请输入项目名称"
  value={formData.projectName}
  onChange={e => setField('projectName', e.target.value)}
/>
```

### 4.3 PmTable（表格）

```typescript
// src/components/shared/ui/PmTable.tsx
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Pagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, index: number) => ReactNode;
}

interface PmTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyText?: string;
  loading?: boolean;
  // 分页
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

const StyledTableContainer = styled(TableContainer)({
  background: 'transparent',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 14,
  overflow: 'hidden',
});

const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.03) !important',
  },
  transition: 'background-color 0.15s ease',
});

export function PmTable<T>({
  columns, data, rowKey, emptyText = '暂无数据',
  loading, page = 1, pageSize = 10, total = 0, onPageChange,
}: PmTableProps<T>) {
  const showPagination = total > pageSize;

  return (
    <>
      <StyledTableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  style={{ width: col.width, textAlign: col.align || 'left' }}
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" style={{ padding: 48, color: 'rgba(255,255,255,0.3)' }}>
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <StyledTableRow key={rowKey(row)}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      style={{ textAlign: col.align || 'left' }}
                    >
                      {col.render ? col.render(row, index) : (row as Record<string, unknown>)[col.key] as ReactNode}
                    </TableCell>
                  ))}
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {showPagination && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <Pagination
            page={page}
            count={Math.ceil(total / pageSize)}
            onChange={(_, p) => onPageChange?.(p)}
            shape="rounded"
            size="small"
          />
        </div>
      )}
    </>
  );
}
```

**使用方式：**

```tsx
<PmTable
  columns={[
    {
      key: 'name',
      header: '客户名称',
      render: row => <NameCell name={row.name} avatar={row.avatar} />,
    },
    { key: 'store', header: '关联门店' },
    { key: 'status', header: '状态', render: row => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: '操作',
      width: 120,
      render: row => (
        <PmButton pmVariant="secondary" pmSize="sm">
          查看
        </PmButton>
      ),
    },
  ]}
  data={customers}
  rowKey={row => row.id}
  page={page}
  pageSize={10}
  total={total}
  onPageChange={setPage}
/>
```

---

## 五、渐进迁移策略

### 5.1 原则：不一次性全改

| 策略                 | 说明                                                                    |
| -------------------- | ----------------------------------------------------------------------- |
| **新建页面用新组件** | 后续新增的模块（如工队管理）直接使用 `PmButton` / `PmInput` / `PmTable` |
| **旧页面按需替换**   | 修改某页面时，顺手把该页面的按钮/输入框/表格替换掉                      |
| **优先替换高频组件** | 搜索框（52+ 处）> 主按钮 > 表格 > 其他                                  |
| **CSS 保留兜底**     | 旧类名不删除，新组件和旧 CSS 共存，直到全部迁移完成                     |

### 5.2 迁移优先级

```
第一阶段（高价值 + 低风险）:
  ├── 统一搜索框 → PmSearchInput（所有页面都有，模式完全一致）
  ├── 分页组件 → MUI Pagination（替换各页面手写的分页按钮）
  └── 模态框按钮 → PmButton（CreateProjectModeModal 等）

第二阶段（中等价值）:
  ├── 表格 → PmTable（先从一个模块试点，如 CustomerManagementPage）
  ├── 表单输入框 → PmInput（CreateProjectModeModal 表单）
  └── 行内操作按钮 → PmButton pmVariant="secondary"（各表格操作列）

第三阶段（ polish ）:
  ├── 视图切换按钮 → PmButton pmVariant="ghost"
  ├── 筛选按钮 → PmButton pmVariant="ghost" pmSize="sm"
  └── 图标按钮 → PmButton pmVariant="icon"
```

### 5.3 试点页面建议

建议选 `CustomerManagementPage` 或 `ProcurementManagementPage` 做试点：

- 页面相对简单（列表 + 搜索 + 筛选 + 分页）
- 按钮类型齐全（主按钮、次要按钮、行内操作、分页）
- 改完可以验证一整套组件的可用性

---

## 六、实施步骤

### Step 1：创建 Theme（0.5 天）

1. 新建 `src/theme/pmTheme.ts`
2. 在 `main.tsx` 中接入 `ThemeProvider`
3. 验证：找一个简单的按钮换成 MUI `<Button variant="contained">`，看样式是否自动匹配设计规范

### Step 2：创建基础 UI 组件（1 天）

1. `src/components/shared/ui/PmButton.tsx`
2. `src/components/shared/ui/PmInput.tsx`（含 `PmSearchInput`）
3. `src/components/shared/ui/PmTable.tsx`
4. 在 `src/components/shared/index.ts` 中统一导出
5. 补充 `src/components/shared/ui/index.ts`

### Step 3：试点页面替换（0.5 天）

1. 选一个页面（建议 `ProcurementManagementPage`）
2. 把搜索框 → `PmSearchInput`
3. 把按钮 → `PmButton`
4. 把表格 → `PmTable`
5. 把分页 → MUI `Pagination`
6. 验证视觉一致性

### Step 4：批量替换搜索框（0.5 天）

1. 全局搜索 `.pm-search-input-wrap`、`.tm-search-input-wrap` 等
2. 统一替换为 `PmSearchInput`
3. 删除各页面中冗余的搜索框 CSS

### Step 5：文档和约束（0.5 天）

1. 更新 `docs/00-governance/design-specification.md`，增加"组件使用规范"章节
2. 在 `CODEBUDDY.md` 中增加提示："新增页面优先使用 `PmButton` / `PmInput` / `PmTable`"
3. 可选：配置 ESLint 规则，检测原生 `<button>` / `<input>` 使用并提示

**总计：约 3 天**

---

## 七、风险与应对

| 风险                    | 影响 | 应对                                                                 |
| ----------------------- | ---- | -------------------------------------------------------------------- |
| MUI 样式与现有 CSS 冲突 | 中   | Theme 中关闭默认样式（`disableRipple`），用 `styled` 完全覆盖        |
| 表格样式与 MUI 差异大   | 中   | `PmTable` 用 `styled(Table)` 完全自定义，不依赖 MUI 默认表格样式     |
| 包体积增加              | 低   | MUI 已安装，无新增依赖；Tree Shaking 会自动剔除未使用组件            |
| 团队学习成本            | 低   | 封装后 API 比 MUI 更简单，只有 `pmVariant` / `pmSize` 两个自定义属性 |
| 旧页面样式被破坏        | 低   | ThemeProvider 只影响 MUI 组件，不影响原生 HTML + CSS 类名            |

---

## 八、产出文件

| 文件                                    | 说明                   |
| --------------------------------------- | ---------------------- |
| `src/theme/pmTheme.ts`                  | MUI Theme 定制         |
| `src/components/shared/ui/PmButton.tsx` | 按钮组件               |
| `src/components/shared/ui/PmInput.tsx`  | 输入框组件（含搜索框） |
| `src/components/shared/ui/PmTable.tsx`  | 表格组件               |
| `src/components/shared/ui/index.ts`     | UI 组件统一导出        |

需要我现在开始执行 Step 1（创建 Theme）吗？
