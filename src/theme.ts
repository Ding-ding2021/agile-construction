import { createTheme, type ThemeOptions } from '@mui/material/styles'

// 设计规范颜色系统
const designTokens = {
  // 主色调
  primary: {
    main: '#154DD9',
    light: '#1a5ae8',
    dark: '#1248c5',
    contrastText: '#ffffff',
  },
  // 背景色
  background: {
    default: '#051338',
    paper: 'rgba(255, 255, 255, 0.04)',
    sidebar: 'rgba(10, 35, 99, 0.90)',
    header: 'rgba(5, 19, 56, 0.80)',
    element: 'rgba(255, 255, 255, 0.03)',
    elementHover: 'rgba(255, 255, 255, 0.06)',
    input: 'rgba(255, 255, 255, 0.05)',
  },
  // 文字颜色
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.70)',
    disabled: 'rgba(255, 255, 255, 0.40)',
    hint: 'rgba(255, 255, 255, 0.50)',
  },
  // 功能色
  info: {
    main: '#2B7FFF',
    light: '#51A2FF',
    contrastText: '#ffffff',
  },
  success: {
    main: '#00BC7D',
    light: '#00D492',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#FE9A00',
    light: '#FFB900',
    contrastText: '#ffffff',
  },
  error: {
    main: '#FF4D4F',
    light: '#FF7875',
    contrastText: '#ffffff',
  },
  // 边框
  border: {
    main: 'rgba(255, 255, 255, 0.08)',
    light: 'rgba(255, 255, 255, 0.05)',
  },
  // 特殊色
  purple: {
    main: '#8E51FF',
    light: '#A684FF',
  },
}

// 玻璃态效果 mixin
const glassEffect = {
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
}

// 创建主题配置
export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: designTokens.primary,
    background: designTokens.background,
    text: designTokens.text,
    info: designTokens.info,
    success: designTokens.success,
    warning: designTokens.warning,
    error: designTokens.error,
    divider: designTokens.border.main,
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h5: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: '24px',
    },
    h6: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '24px',
    },
    subtitle1: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20px',
    },
    subtitle2: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '16px',
    },
    body1: {
      fontSize: '14px',
      lineHeight: '20px',
    },
    body2: {
      fontSize: '12px',
      lineHeight: '16px',
    },
    caption: {
      fontSize: '10px',
      lineHeight: '15px',
    },
    button: {
      fontSize: '12px',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 14,
  },
  spacing: 4,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          ...glassEffect,
        },
        elevation1: {
          boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          ...glassEffect,
          borderRadius: '16px',
          boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '14px',
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow:
            '0px 4px 6px -4px rgba(28, 57, 142, 0.5), 0px 10px 15px -3px rgba(28, 57, 142, 0.5)',
          '&:hover': {
            boxShadow:
              '0px 6px 8px -4px rgba(28, 57, 142, 0.6), 0px 12px 18px -3px rgba(28, 57, 142, 0.6)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.2)',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.4)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
          fontWeight: 500,
        },
        filled: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '10px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#154DD9',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: 'rgba(255, 255, 255, 0.08)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        },
        indicator: {
          backgroundColor: '#154DD9',
          height: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.60)',
          '&.Mui-selected': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          color: 'rgba(255, 255, 255, 0.90)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          ...glassEffect,
          borderRadius: '16px',
          boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.3), 0px 10px 10px -5px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '16px',
          fontWeight: 600,
          padding: '20px 24px 12px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '12px 24px 20px',
          color: 'rgba(255, 255, 255, 0.70)',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '12px 24px 20px',
          gap: '8px',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          ...glassEffect,
          borderRadius: '12px',
          boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '2px 6px',
          padding: '8px 12px',
          fontSize: '13px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(21, 77, 217, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(21, 77, 217, 0.25)',
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(5, 19, 56, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          fontSize: '12px',
          padding: '8px 12px',
          backdropFilter: 'blur(10px)',
        },
        arrow: {
          color: 'rgba(5, 19, 56, 0.95)',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontSize: '10px',
          fontWeight: 600,
          minWidth: '18px',
          height: '18px',
          borderRadius: '999px',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 44,
          height: 24,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
              transform: 'translateX(20px)',
            },
          },
          '& .MuiSwitch-thumb': {
            width: 20,
            height: 20,
          },
          '& .MuiSwitch-track': {
            borderRadius: 12,
            opacity: 0.3,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.3)',
          '&.Mui-checked': {
            color: '#154DD9',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.3)',
          '&.Mui-checked': {
            color: '#154DD9',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 6,
          borderRadius: 3,
        },
        rail: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          opacity: 1,
        },
        track: {
          border: 'none',
        },
        thumb: {
          width: 18,
          height: 18,
          backgroundColor: '#fff',
          boxShadow: '0 0 0 4px rgba(21, 77, 217, 0.2)',
          '&:hover': {
            boxShadow: '0 0 0 6px rgba(21, 77, 217, 0.3)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          ...glassEffect,
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          fontWeight: 600,
          backgroundColor: 'rgba(21, 77, 217, 0.2)',
          color: '#2B7FFF',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          height: 6,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#154DD9',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '8px',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            ...glassEffect,
            borderRadius: '12px',
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          ...glassEffect,
          borderRadius: '12px',
          boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '2px 6px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(21, 77, 217, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(21, 77, 217, 0.25)',
            },
          },
        },
      },
    },
  },
}

// 创建主题
const theme = createTheme(themeOptions)

export default theme
