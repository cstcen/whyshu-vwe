import type { CSSProperties } from 'react'

export interface ResponsiveStyle {
  base?: CSSProperties
  mobile?: Partial<CSSProperties>
  tablet?: Partial<CSSProperties>
  desktop?: Partial<CSSProperties>
}

export interface EventBinding {
  id: string
  trigger: string
  action: string
  payload: Record<string, unknown>
}

export interface ComponentNode {
  id: string
  type: string
  props: Record<string, unknown>
  styles: ResponsiveStyle
  events: EventBinding[]
  children?: ComponentNode[]
  locked?: boolean
  hidden?: boolean
}

export interface PageSchema {
  id: string
  version: string
  meta: { title: string; description?: string }
  activeBreakpoint: 'mobile' | 'tablet' | 'desktop'
  root: ComponentNode
  cssVars?: Record<string, string>
}
