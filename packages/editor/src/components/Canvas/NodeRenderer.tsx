import type { CSSProperties, ElementType } from 'react'
import { useState, useEffect } from 'react'
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

// 表单输入框统一样式
const INPUT_STYLE: CSSProperties = {
  width: '100%',
  padding: '7px 12px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '14px',
  color: 'var(--text, #374151)',
  background: 'var(--bg, #fff)',
  outline: 'none',
}

function runAction(actionSpec: unknown) {
  const raw = String(actionSpec ?? '').trim()
  if (!raw) return
  const [action, ...payloadParts] = raw.split(':')
  const payload = payloadParts.join(':').trim()

  switch (action) {
    case 'alert':
      window.alert(payload || '按钮点击事件触发')
      break
    case 'link':
      if (payload) window.open(payload, '_blank', 'noopener,noreferrer')
      break
    case 'navigate':
      if (payload) window.location.href = payload
      break
    case 'console':
      console.log(payload || '[VWE] Button clicked')
      break
    default:
      break
  }
}

export default function NodeRenderer({ node }: Props) {
  const bp = usePageStore((s) => s.page.activeBreakpoint)
  const style = resolveStyles(node, bp)

  switch (node.type) {
    // ─── 根节点 ───────────────────────────────────────────────────────────────
    case 'Root':
      return (
        <div style={style}>
          <ContainerChildren node={node} />
        </div>
      )

    // ─── 基础组件 ─────────────────────────────────────────────────────────────
    case 'Heading': {
      const Tag = (node.props.level as ElementType) ?? 'h2'
      return <Tag style={style}>{String(node.props.content ?? '标题')}</Tag>
    }

    case 'Text': {
      const Tag = (node.props.tag as ElementType) ?? 'p'
      return <Tag style={style}>{String(node.props.content ?? '')}</Tag>
    }

    case 'Badge':
      return <span style={style}>{String(node.props.text ?? '标签')}</span>

    case 'Link':
      return (
        <a
          href={String(node.props.href ?? '#')}
          target={String(node.props.target ?? '_self')}
          style={{ color: 'var(--primary, #7c6af5)', ...style }}
          onClick={(e) => e.preventDefault()}
        >
          {String(node.props.text ?? '链接')}
        </a>
      )

    case 'Spacer':
      return <div style={style} />

    case 'Button': {
      const variantStyles: Record<string, CSSProperties> = {
        primary: { background: 'var(--primary, #7c6af5)', color: '#fff', border: 'none' },
        secondary: { background: '#e5e7eb', color: 'var(--text, #374151)', border: 'none' },
        danger: { background: '#ef4444', color: '#fff', border: 'none' },
        ghost: { background: 'transparent', border: '1px solid currentColor' },
      }
      const variant = String(node.props.variant ?? 'primary')
      return (
        <button
          style={{ ...style, ...variantStyles[variant] }}
          disabled={!!node.props.disabled}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            runAction(node.props.onClick)
          }}
        >
          {String(node.props.text ?? '按钮')}
        </button>
      )
    }

    case 'Divider':
      return <hr style={style} />

    // ─── 布局组件 ─────────────────────────────────────────────────────────────
    case 'Container': {
      const direction = node.props.direction === 'horizontal' ? 'row' : 'column'
      return (
        <div style={{ ...style, flexDirection: direction }}>
          <ContainerChildren node={node} />
        </div>
      )
    }

    case 'Section':
      return (
        <section style={style}>
          <ContainerChildren node={node} />
        </section>
      )

    case 'Card':
      return (
        <div style={style}>
          <ContainerChildren node={node} />
        </div>
      )

    case 'Columns': {
      const cols = String(node.props.columns ?? '3')
      return (
        <div style={{ ...style, gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          <ContainerChildren node={node} />
        </div>
      )
    }

    case 'AbsoluteBox':
      return (
        <div style={style}>
          <ContainerChildren node={node} />
        </div>
      )

    // ─── 表单组件 ─────────────────────────────────────────────────────────────
    case 'InputField': {
      const fieldLabel = String(node.props.label ?? '')
      return (
        <div style={style}>
          {fieldLabel && (
            <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text, #374151)', display: 'block', marginBottom: '4px' }}>
              {fieldLabel}
            </label>
          )}
          <input
            type={String(node.props.inputType ?? 'text')}
            placeholder={String(node.props.placeholder ?? '')}
            style={INPUT_STYLE}
            readOnly
          />
        </div>
      )
    }

    case 'TextareaField': {
      const fieldLabel = String(node.props.label ?? '')
      return (
        <div style={style}>
          {fieldLabel && (
            <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text, #374151)', display: 'block', marginBottom: '4px' }}>
              {fieldLabel}
            </label>
          )}
          <textarea
            placeholder={String(node.props.placeholder ?? '')}
            rows={Number(node.props.rows ?? 4)}
            style={{ ...INPUT_STYLE, resize: 'vertical' }}
            readOnly
          />
        </div>
      )
    }

    case 'Checkbox':
      return (
        <label style={style}>
          <input
            type="checkbox"
            defaultChecked={!!node.props.checked}
            style={{ width: '16px', height: '16px', accentColor: 'var(--primary, #7c6af5)' }}
            readOnly
          />
          <span>{String(node.props.label ?? '选项')}</span>
        </label>
      )

    case 'SelectField': {
      const opts = String(node.props.options ?? '').split(',').map((s) => s.trim()).filter(Boolean)
      const fieldLabel = String(node.props.label ?? '')
      return (
        <div style={style}>
          {fieldLabel && (
            <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text, #374151)', display: 'block', marginBottom: '4px' }}>
              {fieldLabel}
            </label>
          )}
          <select style={INPUT_STYLE}>
            {!!node.props.placeholder && <option value="">{String(node.props.placeholder ?? '')}</option>}
            {opts.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      )
    }

    // ─── 媒体组件 ─────────────────────────────────────────────────────────────
    case 'Image':
      return (
        <img
          src={String(node.props.src ?? '')}
          alt={String(node.props.alt ?? '')}
          style={{ ...style, objectFit: (node.props.objectFit as CSSProperties['objectFit']) }}
        />
      )

    case 'Video': {
      const src = String(node.props.src ?? '')
      return src ? (
        <video
          src={src}
          poster={String(node.props.poster ?? '')}
          style={style}
          controls
        />
      ) : (
        <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '14px', gap: '8px' }}>
          🎬 <span>视频占位（填写视频地址后显示）</span>
        </div>
      )
    }

    // ─── 导航布局组件 ─────────────────────────────────────────────────────────
    case 'Header':
      return (
        <header style={style}>
          <ContainerChildren node={node} />
        </header>
      )

    case 'Nav': {
      const orientation = node.props.orientation ?? 'horizontal'
      const navStyle = {
        ...style,
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
      }
      return (
        <nav style={navStyle as CSSProperties}>
          <ContainerChildren node={node} />
        </nav>
      )
    }

    case 'MenuItem':
      return (
        <a
          href={String(node.props.href ?? '#')}
          onClick={(e) => {
            e.preventDefault()
            runAction(node.props.onClick)
          }}
          style={style}
        >
          {String(node.props.text ?? '菜单项')}
        </a>
      )

    case 'Dropdown': {
      const label = String(node.props.label ?? '菜单')
      const trigger = String(node.props.trigger ?? 'click')
      const [isOpen, setIsOpen] = useState(false)

      return (
        <div style={{ ...style, position: 'relative' }}>
          <button
            onClick={() => trigger === 'click' && setIsOpen(!isOpen)}
            onMouseEnter={() => trigger === 'hover' && setIsOpen(true)}
            onMouseLeave={() => trigger === 'hover' && setIsOpen(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: 'var(--text)',
            }}
          >
            {label}
            <span style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {isOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                zIndex: 1000,
                minWidth: '160px',
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                marginTop: '4px',
              }}
              onMouseLeave={() => trigger === 'hover' && setIsOpen(false)}
            >
              <ContainerChildren node={node} />
            </div>
          )}
        </div>
      )
    }

    case 'Carousel': {
      const autoPlay = node.props.autoPlay !== false
      const interval = Number(node.props.interval ?? 3000)
      const showDots = node.props.showDots !== false
      const showArrows = node.props.showArrows !== false
      const duration = Number(node.props.duration ?? 500)
      const [currentIndex, setCurrentIndex] = useState(0)
      const children = node.children ?? []

      useEffect(() => {
        if (!autoPlay || children.length <= 1) return
        const timer = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % children.length)
        }, interval)
        return () => clearInterval(timer)
      }, [autoPlay, interval, children.length])

      const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % children.length)
      }
      const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + children.length) % children.length)
      }

      return (
        <div style={style}>
          {/* 轮播容器 */}
          <div
            style={{
              display: 'flex',
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {/* 幻灯片 */}
            {children.map((child, idx) => (
              <div
                key={child.id}
                style={{
                  ...resolveStyles(child, bp),
                  position: 'absolute',
                  left: `${(idx - currentIndex) * 100}%`,
                  transition: `left ${duration}ms ease-in-out`,
                  width: '100%',
                  height: '100%',
                }}
              >
                <NodeRenderer node={child} />
              </div>
            ))}
          </div>

          {/* 箭头按钮 */}
          {showArrows && children.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 100,
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)')}
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 100,
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)')}
              >
                ›
              </button>
            </>
          )}

          {/* 点号指示器 */}
          {showDots && children.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                display: 'flex',
                gap: '8px',
              }}
            >
              {children.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: idx === currentIndex ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: idx === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )
    }

    case 'CarouselItem':
      return (
        <div style={{ ...style, width: '100%', height: '100%' }}>
          <ContainerChildren node={node} />
        </div>
      )

    case 'FloatingButton': {
      const position = String(node.props.position ?? 'bottom-right')
      const icon = String(node.props.icon ?? '●')
      const text = String(node.props.text ?? '按钮')
      const size = String(node.props.size ?? 'lg')
      const sizeMap = { sm: '40px', md: '48px', lg: '56px' }
      const dimension = sizeMap[size as keyof typeof sizeMap] ?? '56px'

      const positionStyles: Record<string, { bottom?: string; top?: string; right?: string; left?: string }> = {
        'bottom-right': { bottom: '24px', right: '24px' },
        'bottom-left': { bottom: '24px', left: '24px' },
        'top-right': { top: '24px', right: '24px' },
        'top-left': { top: '24px', left: '24px' },
      }

      return (
        <button
          style={{
            ...style,
            width: dimension,
            height: dimension,
            ...positionStyles[position],
          }}
          onClick={(e) => {
            e.preventDefault()
            runAction(node.props.onClick)
          }}
          title={text}
        >
          {icon}
        </button>
      )
    }

    case 'Footer':
      return (
        <footer style={style}>
          <ContainerChildren node={node} />
        </footer>
      )

    case 'Hero':
      return (
        <section style={style}>
          <ContainerChildren node={node} />
        </section>
      )

    case 'Grid': {
      const columns = node.props.columns ?? '3'
      const gap = String(node.props.gap ?? '16px')
      const gridStyle = {
        ...style,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }
      return (
        <div style={gridStyle}>
          <ContainerChildren node={node} />
        </div>
      )
    }

    case 'Flex': {
      const direction = node.props.direction ?? 'row'
      const justify = node.props.justify ?? 'flex-start'
      const align = node.props.align ?? 'flex-start'
      const gap = String(node.props.gap ?? '8px')
      const flexStyle = {
        ...style,
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        gap,
      }
      return (
        <div style={flexStyle as CSSProperties}>
          <ContainerChildren node={node} />
        </div>
      )
    }

    case 'Alert': {
      const variant = String(node.props.variant ?? 'info')
      const title = String(node.props.title ?? '提示')
      const colors = {
        info: { bg: 'color-mix(in srgb, var(--primary, #7c6af5) 14%, white)', border: 'var(--primary, #7c6af5)', text: 'var(--primary, #7c6af5)', icon: 'ℹ' },
        success: { bg: '#dcfce7', border: '#22c55e', text: '#14532d', icon: '✓' },
        warning: { bg: '#fef3c7', border: '#f59e0b', text: '#78350f', icon: '⚠' },
        error: { bg: '#fee2e2', border: '#ef4444', text: '#7f1d1d', icon: '✕' },
      }
      const color = colors[variant as keyof typeof colors] ?? colors.info
      const alertStyle = {
        ...style,
        backgroundColor: color.bg,
        borderColor: color.border,
        color: color.text,
      }
      return (
        <div style={alertStyle}>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{color.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{title}</div>
            <ContainerChildren node={node} />
          </div>
        </div>
      )
    }

    case 'Avatar': {
      const src = String(node.props.src ?? '')
      const alt = String(node.props.alt ?? 'Avatar')
      const fallback = String(node.props.fallback ?? 'U')
      const size = String(node.props.size ?? 'md')
      const sizes = { sm: '32px', md: '40px', lg: '56px', xl: '80px' }
      const dimension = sizes[size as keyof typeof sizes] ?? sizes.md
      const avatarStyle = {
        ...style,
        width: dimension,
        height: dimension,
      }
      return src ? (
        <img src={src} alt={alt} style={avatarStyle} />
      ) : (
        <div
          style={{
            ...avatarStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#9ca3af',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: size === 'sm' ? '14px' : size === 'lg' ? '24px' : size === 'xl' ? '32px' : '16px',
          }}
        >
          {fallback}
        </div>
      )
    }

    case 'Tabs': {
      const tabsStr = String(node.props.tabs ?? 'Tab 1,Tab 2,Tab 3')
      const activeIndex = Number(node.props.activeIndex ?? 0)
      const tabList = tabsStr.split(',').map(t => t.trim())
      return (
        <div style={style}>
          <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', gap: '4px' }}>
            {tabList.map((tab, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  borderBottom: idx === activeIndex ? '2px solid var(--primary, #7c6af5)' : 'none',
                  color: idx === activeIndex ? 'var(--primary, #7c6af5)' : '#6b7280',
                  fontWeight: idx === activeIndex ? 'bold' : 'normal',
                  marginBottom: '-2px',
                }}
              >
                {tab}
              </div>
            ))}
          </div>
          <div style={{ padding: '16px 0' }}>
            <ContainerChildren node={node} />
          </div>
        </div>
      )
    }

    // ─── 未知组件 ─────────────────────────────────────────────────────────────
    default:
      return (
        <div style={{ ...style, border: '1px dashed #ef4444', padding: '8px', color: '#ef4444', fontSize: 12 }}>
          未知组件: {node.type}
        </div>
      )
  }
}
