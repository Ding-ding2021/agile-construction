import type { CSSProperties, ImgHTMLAttributes } from 'react'
import { type IconName, getIconPath } from './index'

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number

type IconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'size'> & {
  /** 图标名称 */
  name: IconName
  /** 图标尺寸 */
  size?: IconSize
  /** 自定义样式 */
  style?: CSSProperties
  /** 自定义类名 */
  className?: string
}

// 尺寸映射
const sizeMap: Record<Exclude<IconSize, number>, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
}

/**
 * Icon 组件
 * 统一的图标渲染组件，支持语义化名称和多种尺寸
 *
 * @example
 * <Icon name="search" />
 * <Icon name="notification" size="lg" />
 * <Icon name="add" size={18} className="custom-icon" />
 */
const Icon = ({ name, size = 'md', style, className = '', alt = '', ...rest }: IconProps) => {
  const iconPath = getIconPath(name)
  const dimension = typeof size === 'number' ? size : sizeMap[size]

  const iconStyle: CSSProperties = {
    width: dimension,
    height: dimension,
    flexShrink: 0,
    ...style,
  }

  return (
    <img
      src={iconPath}
      alt={alt}
      className={`cb-icon cb-icon-${name} ${className}`}
      style={iconStyle}
      {...rest}
    />
  )
}

export default Icon
