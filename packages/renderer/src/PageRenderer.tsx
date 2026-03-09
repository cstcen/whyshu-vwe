import type { CSSProperties } from 'react'
import type { ComponentNode, PageSchema } from './types'

type Breakpoint = 'mobile' | 'tablet' | 'desktop'

function resolveStyles(node: ComponentNode, bp: Breakpoint): CSSProperties {
  const { base = {}, mobile = {}, tablet = {}, desktop = {} } = node.styles
  if (bp === 'mobile') return { ...base, ...mobile }
  if (bp === 'tablet') return { ...base, ...tablet }
  return { ...base, ...desktop }
}

interface RenderNodeProps {
  node: ComponentNode
  bp: Breakpoint
}

function RenderNode({ node, bp }: RenderNodeProps): JSX.Element {
  const style = resolveStyles(node, bp)

  switch (node.type) {
    case 'Root':
    case 'Container': {
      const direction =
        node.type === 'Container' && node.props.direction === 'horizontal' ? 'row' : 'column'
      return (
        <div style={{ ...style, flexDirection: direction }}>
          {node.children?.map((child) => (
            <RenderNode key={child.id} node={child} bp={bp} />
          ))}
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
          style={{
            ...style,
            objectFit: node.props.objectFit as CSSProperties['objectFit'],
          }}
        />
      )

    case 'Divider':
      return <hr style={style} />

    default:
      return <div style={style}>{node.children?.map((c) => <RenderNode key={c.id} node={c} bp={bp} />)}</div>
  }
}

interface PageRendererProps {
  schema: PageSchema
  breakpoint?: Breakpoint
}

export function PageRenderer({ schema, breakpoint }: PageRendererProps) {
  const bp = breakpoint ?? schema.activeBreakpoint ?? 'desktop'

  const cssVarStyle = schema.cssVars
    ? (Object.fromEntries(
        Object.entries(schema.cssVars).map(([k, v]) => [k, v]),
      ) as CSSProperties)
    : undefined

  return (
    <div style={cssVarStyle}>
      <RenderNode node={schema.root} bp={bp} />
    </div>
  )
}
