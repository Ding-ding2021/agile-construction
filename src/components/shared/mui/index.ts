/**
 * MUI 组件统一导出
 *
 * 本模块封装常用 MUI 组件，统一从共享库导出。
 * 各页面应优先从此处导入 MUI 组件，而非直接从 @mui/material 导入，
 * 以便未来进行系统级定制或替换。
 *
 * @example
 * ```tsx
 * import { PmButton, PmInput, PmTable } from '@/components/shared/mui';
 * import { Button, Dialog, TextField, Chip } from '@/components/shared/mui';
 * ```
 */

// Preset wrapper components
export { PmButton } from './PmButton'
export { PmInput } from './PmInput'
export { PmTable } from './PmTable'
export { PmCard } from './PmCard'
export { PmCardHeader } from './PmCardHeader'
export { PmSelect } from './PmSelect'
export { PmDatePicker } from './PmDatePicker'
export { PmPersonnelSelect } from './PmPersonnelSelect'
export type { PmButtonProps } from './PmButton'
export type { PmInputProps } from './PmInput'
export type { PmTableProps, PmTableColumn } from './PmTable'
export type { PmCardProps } from './PmCard'
export type { PmCardHeaderProps } from './PmCardHeader'
export type { PmSelectProps } from './PmSelect'
export type { PmDatePickerProps } from './PmDatePicker'
export type { PmPersonnelSelectProps, PersonnelOption } from './PmPersonnelSelect'

// Layout
export {
  Box,
  Container,
  Grid,
  Stack,
  Paper,
  Card,
  CardContent,
  CardHeader,
  CardActions,
} from '@mui/material'

// Navigation
export {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Breadcrumbs,
  Drawer,
  Menu,
  MenuItem,
  MenuList,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
} from '@mui/material'

// Inputs
export {
  Button,
  IconButton,
  TextField,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  InputAdornment,
  Switch,
  Slider,
  Autocomplete,
} from '@mui/material'

// Data display
export {
  Typography,
  Chip,
  Badge,
  Avatar,
  AvatarGroup,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  LinearProgress,
  CircularProgress,
  Skeleton,
} from '@mui/material'

// Feedback
export {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  AlertTitle,
  Backdrop,
  Modal,
  Popover,
  Popper,
  Slide,
  Fade,
  Grow,
  Zoom,
  Collapse,
} from '@mui/material'

// Utils
export { styled, useTheme, css, keyframes } from '@mui/material/styles'

// Types
export type {
  ButtonProps,
  DialogProps,
  TextFieldProps,
  ChipProps,
  SelectProps,
  MenuProps,
  TooltipProps,
  BadgeProps,
  SwitchProps,
  CheckboxProps,
  RadioProps,
  SliderProps,
  TableCellProps,
  TabsProps,
  TabProps,
  SnackbarProps,
  AlertProps,
  PaperProps,
  CardProps,
  AvatarProps,
  LinearProgressProps,
  CircularProgressProps,
  SkeletonProps,
  AutocompleteProps,
} from '@mui/material'
