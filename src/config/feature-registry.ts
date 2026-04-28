// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = import('react').ComponentType<any>

export type FeatureConfig = {
  page: string
  path: string
  component?: AnyComponent
  label?: string
  category?: 'simple' | 'param' | 'callback' | 'data'
}

export type FeatureRegistry = FeatureConfig[]
