import type { CSSProperties } from 'react'

// ──────────────────────────────
// 响应式样式
// ──────────────────────────────
export interface ResponsiveStyle {
  base?: CSSProperties
  mobile?: Partial<CSSProperties>
  tablet?: Partial<CSSProperties>
  desktop?: Partial<CSSProperties>
}

// ──────────────────────────────
// 事件绑定
// ──────────────────────────────
export type EventTrigger = 'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onSubmit'
export type EventAction = 'navigate' | 'openModal' | 'closeModal' | 'callAPI' | 'setState' | 'custom'

export interface EventBinding {
  id: string
  trigger: EventTrigger
  action: EventAction
  payload: Record<string, unknown>
}

// ──────────────────────────────
// 组件节点（树形结构）
// ──────────────────────────────
export interface ComponentNode {
  id: string
  type: string
  props: Record<string, unknown>
  styles: ResponsiveStyle
  events: EventBinding[]
  children?: ComponentNode[]
  // 节点在画布中的锁定/隐藏状态
  locked?: boolean
  hidden?: boolean
}

// ──────────────────────────────
// 页面元信息
// ──────────────────────────────
export interface PageMeta {
  title: string
  description?: string
  keywords?: string[]
  favicon?: string
}

// ──────────────────────────────
// 断点配置
// ──────────────────────────────
export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

export const BREAKPOINTS: Record<Breakpoint, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
}

// ──────────────────────────────
// 页面 DSL（核心数据结构）
// ──────────────────────────────
export interface PageSchema {
  id: string
  version: string
  meta: PageMeta
  activeBreakpoint: Breakpoint
  root: ComponentNode
  // 页面级 CSS 变量（主题）
  cssVars?: Record<string, string>
}

// ──────────────────────────────
// 组件元数据（用于组件面板和属性面板）
// ──────────────────────────────
export type PropControlType =
  | 'input'
  | 'textarea'
  | 'number'
  | 'switch'
  | 'select'
  | 'color'
  | 'slider'
  | 'image'
  | 'event'
  | 'spacing'

export interface PropSchema {
  type: 'string' | 'number' | 'boolean' | 'enum' | 'color' | 'event' | 'image'
  label: string
  control: PropControlType
  options?: Array<{ label: string; value: string | number | boolean }>
  defaultValue?: unknown
  description?: string
}

export interface ComponentMeta {
  type: string
  label: string
  icon: string
  category: 'basic' | 'layout' | 'form' | 'media' | 'advanced'
  defaultProps: Record<string, unknown>
  defaultStyles: ResponsiveStyle
  propsSchema: Record<string, PropSchema>
  // 是否允许有子节点
  isContainer?: boolean
  // 允许放入的子组件类型，undefined 表示不限制
  accepts?: string[]
}
