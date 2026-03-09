import type { CSSProperties } from 'react'
import type { ComponentNode, Breakpoint } from '@/types'
import { usePageStore } from '@/store'
import { ContainerChildren } from './NodeWrapper'

interface Props {
  node: ComponentNode
}

/** 根据当前断点合并响应式样式 */
function resolveStyles(node: ComponentNode, bp: Breakpoint): CSSProperties {
  const { base = {}, mobile = {}, tablet = {}, desktop = {} } = node.styles
  if (bp === 'mobile') return { ...base, ...mobile }
  if (bp === 'tablet') return { ...base, ...tablet }
  return { ...base, ...desktop }
}

export default function NodeRenderer({ node }: Props) {
  const bp = usePageStore((s) => s.page.activeBreakpoint)
  const style = resolveStyles(node, bp)

  switch (node.type) {
    case 'Root':
      return (
        <div style={style}>
          <ContainerChildren node={node} />
        </div>
      )

    case 'Container': {
      const direction = node.props.direction === 'horizontal' ? 'row' : 'column'
      return (
        <div style={{ ...style, flexDirection: direction }}>
          <ContainerChildren node={node} />
        </div>
      )
    }

    case 'Text': {
      const Tag = (node.props.tag as keyof JSX.IntrinsicElements) ?? 'p'
      return <Tag style={style}>{String(node.props.content ?? '')}</Tag>
    }

    case 'Button': {
      const variantStyles: Record<string, CSSProperties> = {
        primary: { background: 'var(--primary, #7c6af5)', color: '#fff', border: 'none' },
        secondary: { background: '#e5e7eb', color: '#374151', border: 'none' },
        danger: { background: '#ef4444', color: '#fff', border: 'none' },
        ghost: { background: 'transparent', border: '1px solid currentColor' },
      }
      const variant = String(node.props.variant ?? 'primary')
      return (
        <button
          style={{ ...style, ...variantStyles[variant] }}
          disabled={!!node.props.disabled}
        >
          {String(node.props.text ?? '按钮')}
        </button>
      )
    }

    case 'Image':
      return (
        <img
          src={String(node.props.src ?? '')}
          alt={String(node.props.alt ?? '')}
          style={{ ...style, objectFit: (node.props.objectFit as CSSProperties['objectFit']) }}
        />
      )

    case 'Divider':
      return <hr style={style} />

    default:
      return (
        <div style={{ ...style, border: '1px dashed red', padding: '8px', color: 'red', fontSize: 12 }}>
          未知组件: {node.type}
        </div>
      )
  }
}
