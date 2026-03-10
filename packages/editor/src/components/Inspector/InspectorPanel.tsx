import { useEffect } from 'react'
import { useSelectionStore, usePageStore, withHistory } from '@/store'
import { getComponentMeta } from '@/engine'
import type { PropSchema } from '@/types'

function PropControl({
  schema,
  value,
  onChange,
}: {
  name?: string
  schema: PropSchema
  value: unknown
  onChange: (val: unknown) => void
}) {
  switch (schema.control) {
    case 'input':
      return (
        <input
          type="text"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent"
        />
      )
    case 'textarea':
      return (
        <textarea
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-2 py-1 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent resize-none"
        />
      )
    case 'switch':
      return (
        <button
          onClick={() => onChange(!value)}
          className={`w-9 h-5 rounded-full transition-colors relative ${value ? 'bg-editor-accent' : 'bg-gray-600'}`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`}
          />
        </button>
      )
    case 'select':
      return (
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none"
        >
          {schema.options?.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    case 'color':
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={String(value ?? '#000000')}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-6 rounded cursor-pointer border-0 bg-transparent"
          />
          <span className="text-xs text-gray-400">{String(value ?? '')}</span>
        </div>
      )
    case 'number':
      return (
        <input
          type="number"
          value={Number(value ?? 0)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-2 py-1 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent"
        />
      )
    case 'image':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-2 py-1 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => onChange(String(reader.result ?? ''))
              reader.readAsDataURL(file)
            }}
            className="w-full text-xs text-gray-400 file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:bg-editor-panel file:text-gray-300"
          />
        </div>
      )
    case 'event':
      const raw = String(value ?? '')
      const [action, ...payloadParts] = raw.split(':')
      const payload = payloadParts.join(':')
      const normalizedAction = action || 'alert'
      return (
        <div className="space-y-2">
          <select
            value={normalizedAction}
            onChange={(e) => onChange(`${e.target.value}:${payload}`)}
            className="w-full px-2 py-1 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none"
          >
            <option value="alert">弹窗提示</option>
            <option value="link">打开链接（新窗口）</option>
            <option value="navigate">页面跳转（当前窗口）</option>
            <option value="console">控制台输出</option>
          </select>
          <input
            type="text"
            value={payload}
            onChange={(e) => onChange(`${normalizedAction}:${e.target.value}`)}
            placeholder="填写内容，例如 https://example.com"
            className="w-full px-2 py-1 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent"
          />
          <p className="text-[10px] text-gray-500">格式: action:payload</p>
        </div>
      )
    default:
      return <span className="text-xs text-gray-500">暂不支持</span>
  }
}

export default function InspectorPanel() {
  const { selectedId, select } = useSelectionStore()
  const { findNode, updateNodeProps, updateNodeStyles, removeNode, page } = usePageStore()

  // 键盘删除快捷键 (Delete / Backspace)
  useEffect(() => {
    if (!selectedId) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        handleDelete()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId])

  function handleDelete() {
    if (!selectedId || selectedId === 'root') return
    withHistory('删除组件', removeNode)(selectedId)
    select(null)
  }

  if (!selectedId) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-gray-500">
        点击画布中的组件以编辑属性
      </div>
    )
  }

  const node = findNode(selectedId)
  if (!node) return null

  const meta = getComponentMeta(node.type)
  if (!meta) return null

  const currentBp = page.activeBreakpoint
  const bpStyles = node.styles[currentBp] ?? {}

  return (
    <div className="flex flex-col h-full text-sm">
      {/* 组件类型 + 删除按钮 */}
      <div className="px-3 py-2 border-b border-editor-border flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400">组件: </span>
          <span className="text-xs font-medium text-editor-accent">{meta.label}</span>
          <span className="text-xs text-gray-600 ml-1">#{node.id.slice(0, 6)}</span>
        </div>
        {node.id !== 'root' && (
          <button
            onClick={handleDelete}
            title="删除组件 (Delete)" 
            className="px-2 py-1 text-[10px] rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors border border-red-500/30 hover:border-red-500/50"
          >
            🗑 删除
          </button>
        )}
      </div>

      {/* 属性编辑 */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 border-b border-editor-border">
          <p className="text-xs font-medium text-gray-300 mb-2">属性</p>
          <div className="space-y-3">
            {Object.entries(meta.propsSchema).map(([key, schema]) => (
              <div key={key}>
                <label className="block text-xs text-gray-400 mb-1">{schema.label}</label>
                <PropControl
                  name={key}
                  schema={schema}
                  value={node.props[key]}
                  onChange={(val) => updateNodeProps(node.id, { [key]: val })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 当前断点样式快捷编辑 */}
        <div className="px-3 py-2 border-b border-editor-border">
          <p className="text-xs font-medium text-gray-300 mb-2">
            尺寸 &amp; 间距
            <span className="text-gray-500 font-normal ml-1">
              ({currentBp === 'desktop' ? '桌面' : currentBp === 'tablet' ? '平板' : '移动'})
            </span>
          </p>
          <div className="space-y-2">
            {([
              ['width', '宽度'],
              ['height', '高度'],
              ['padding', '内边距'],
              ['margin', '外边距'],
              ['display', '显示模式'],
              ['gap', '间隔'],
            ] as [keyof typeof bpStyles, string][]).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-14 flex-shrink-0">{label}</span>
                <input
                  type="text"
                  value={String(bpStyles[key] ?? node.styles.base?.[key] ?? '')}
                  onChange={(e) =>
                    updateNodeStyles(node.id, {
                      ...node.styles,
                      [currentBp === 'desktop' ? 'base' : currentBp]: {
                        ...(currentBp === 'desktop' ? node.styles.base : node.styles[currentBp]),
                        [key]: e.target.value,
                      },
                    })
                  }
                  placeholder="auto"
                  className="flex-1 min-w-0 px-2 py-0.5 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Flex 布局属性 */}
        <div className="px-3 py-2 border-b border-editor-border">
          <p className="text-xs font-medium text-gray-300 mb-2">Flex 布局</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-14 flex-shrink-0">增长比</span>
              <input
                type="number"
                min="0"
                value={String(bpStyles.flexGrow ?? node.styles.base?.flexGrow ?? '')}
                onChange={(e) =>
                  updateNodeStyles(node.id, {
                    ...node.styles,
                    [currentBp === 'desktop' ? 'base' : currentBp]: {
                      ...(currentBp === 'desktop' ? node.styles.base : node.styles[currentBp]),
                      flexGrow: e.target.value ? Number(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="0"
                className="flex-1 min-w-0 px-2 py-0.5 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-14 flex-shrink-0">收缩比</span>
              <input
                type="number"
                min="0"
                value={String(bpStyles.flexShrink ?? node.styles.base?.flexShrink ?? '')}
                onChange={(e) =>
                  updateNodeStyles(node.id, {
                    ...node.styles,
                    [currentBp === 'desktop' ? 'base' : currentBp]: {
                      ...(currentBp === 'desktop' ? node.styles.base : node.styles[currentBp]),
                      flexShrink: e.target.value ? Number(e.target.value) : undefined,
                    },
                  })
                }
                placeholder="1"
                className="flex-1 min-w-0 px-2 py-0.5 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-14 flex-shrink-0">基础值</span>
              <input
                type="text"
                value={String(bpStyles.flexBasis ?? node.styles.base?.flexBasis ?? '')}
                onChange={(e) =>
                  updateNodeStyles(node.id, {
                    ...node.styles,
                    [currentBp === 'desktop' ? 'base' : currentBp]: {
                      ...(currentBp === 'desktop' ? node.styles.base : node.styles[currentBp]),
                      flexBasis: e.target.value || undefined,
                    },
                  })
                }
                placeholder="auto"
                className="flex-1 min-w-0 px-2 py-0.5 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent"
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              💡 设置父容器为 <code>flex</code>，子元素的"增长比"即为宽度占比<br/>
              例如：增长比 1 / 1 / 2 = 25% / 25% / 50% 的宽度分布
            </p>
          </div>
        </div>

        {/* 文字样式 */}
        <div className="px-3 py-2 border-b border-editor-border">
          <p className="text-xs font-medium text-gray-300 mb-2">文字</p>
          <div className="space-y-2">
            {([
              ['fontSize', '字号'],
              ['fontWeight', '字重'],
              ['color', '颜色'],
              ['lineHeight', '行高'],
              ['textAlign', '对齐'],
            ] as [keyof typeof bpStyles, string][]).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-14 flex-shrink-0">{label}</span>
                <input
                  type="text"
                  value={String(bpStyles[key] ?? node.styles.base?.[key] ?? '')}
                  onChange={(e) =>
                    updateNodeStyles(node.id, {
                      ...node.styles,
                      [currentBp === 'desktop' ? 'base' : currentBp]: {
                        ...(currentBp === 'desktop' ? node.styles.base : node.styles[currentBp]),
                        [key]: e.target.value,
                      },
                    })
                  }
                  placeholder="—"
                  className="flex-1 min-w-0 px-2 py-0.5 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 外观样式 */}
        <div className="px-3 py-2 border-b border-editor-border">
          <p className="text-xs font-medium text-gray-300 mb-2">外观</p>
          <div className="space-y-2">
            {([
              ['backgroundColor', '背景色'],
              ['borderRadius', '圆角'],
              ['border', '边框'],
              ['boxShadow', '阴影'],
              ['opacity', '透明度'],
            ] as [keyof typeof bpStyles, string][]).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-14 flex-shrink-0">{label}</span>
                <input
                  type="text"
                  value={String(bpStyles[key] ?? node.styles.base?.[key] ?? '')}
                  onChange={(e) =>
                    updateNodeStyles(node.id, {
                      ...node.styles,
                      [currentBp === 'desktop' ? 'base' : currentBp]: {
                        ...(currentBp === 'desktop' ? node.styles.base : node.styles[currentBp]),
                        [key]: e.target.value,
                      },
                    })
                  }
                  placeholder="—"
                  className="flex-1 min-w-0 px-2 py-0.5 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 定位（重叠支持） */}
        <div className="px-3 py-2">
          <p className="text-xs font-medium text-gray-300 mb-1">定位</p>
          <p className="text-[10px] text-gray-500 mb-2">设为 <code className="text-editor-accent">absolute</code> 后可在"自由层"容器内自由重叠</p>
          <div className="space-y-2">
            {([
              ['position', '定位方式'],
              ['top', '上 (top)'],
              ['left', '左 (left)'],
              ['right', '右 (right)'],
              ['bottom', '下 (bottom)'],
              ['zIndex', '层级 (z)'],
            ] as [keyof typeof bpStyles, string][]).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-14 flex-shrink-0">{label}</span>
                <input
                  type="text"
                  value={String(bpStyles[key] ?? node.styles.base?.[key] ?? '')}
                  onChange={(e) =>
                    updateNodeStyles(node.id, {
                      ...node.styles,
                      [currentBp === 'desktop' ? 'base' : currentBp]: {
                        ...(currentBp === 'desktop' ? node.styles.base : node.styles[currentBp]),
                        [key]: e.target.value,
                      },
                    })
                  }
                  placeholder="—"
                  className="flex-1 min-w-0 px-2 py-0.5 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
