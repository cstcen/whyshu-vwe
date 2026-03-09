import { useSelectionStore, usePageStore } from '@/store'
import { getComponentMeta } from '@/engine'
import type { PropSchema } from '@/types'

function PropControl({
  name,
  schema,
  value,
  onChange,
}: {
  name: string
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
    case 'event':
      return (
        <button className="w-full px-2 py-1 text-xs border border-dashed border-editor-border rounded text-gray-400 hover:border-editor-accent hover:text-editor-accent transition-colors">
          + 添加事件
        </button>
      )
    default:
      return <span className="text-xs text-gray-500">暂不支持</span>
  }
}

export default function InspectorPanel() {
  const { selectedId } = useSelectionStore()
  const { findNode, updateNodeProps, updateNodeStyles, page } = usePageStore()

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
      {/* 组件类型 */}
      <div className="px-3 py-2 border-b border-editor-border">
        <span className="text-xs text-gray-400">组件: </span>
        <span className="text-xs font-medium text-editor-accent">{meta.label}</span>
        <span className="text-xs text-gray-600 ml-1">#{node.id.slice(0, 6)}</span>
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
        <div className="px-3 py-2">
          <p className="text-xs font-medium text-gray-300 mb-2">
            样式{' '}
            <span className="text-gray-500 font-normal">
              ({currentBp === 'desktop' ? '桌面' : currentBp === 'tablet' ? '平板' : '移动'})
            </span>
          </p>
          <div className="space-y-2">
            {([
              ['width', '宽度'],
              ['height', '高度'],
              ['padding', '内边距'],
              ['margin', '外边距'],
              ['fontSize', '字号'],
              ['color', '文字颜色'],
              ['backgroundColor', '背景色'],
              ['borderRadius', '圆角'],
            ] as [keyof typeof bpStyles, string][]).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-16 flex-shrink-0">{label}</span>
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
      </div>
    </div>
  )
}
