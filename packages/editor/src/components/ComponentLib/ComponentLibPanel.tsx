import { useState } from 'react'
import { getMetasByCategory, getAllMetas } from '@/engine'
import type { ComponentMeta } from '@/types'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { nanoid } from '@/utils/nanoid'

const CATEGORIES = [
  { key: 'basic', label: '基础' },
  { key: 'layout', label: '布局' },
  { key: 'media', label: '媒体' },
  { key: 'form', label: '表单' },
] as const

function DraggableItem({ meta }: { meta: ComponentMeta }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `lib-${meta.type}`,
    data: {
      // 标识来源：组件库，区别于画布内拖拽
      source: 'library',
      type: meta.type,
      defaultProps: meta.defaultProps,
      defaultStyles: meta.defaultStyles,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center gap-2 px-2 py-2 rounded cursor-grab hover:bg-editor-hover active:cursor-grabbing select-none text-sm text-gray-300"
      title={meta.label}
    >
      <span className="text-gray-400 text-xs w-4 text-center">⊞</span>
      <span>{meta.label}</span>
    </div>
  )
}

export default function ComponentLibPanel() {
  const [activeCategory, setActiveCategory] = useState<string>('basic')
  const [searchQuery, setSearchQuery] = useState('')

  const items = searchQuery
    ? getAllMetas().filter((m) => m.label.includes(searchQuery) || m.type.toLowerCase().includes(searchQuery.toLowerCase()))
    : getMetasByCategory(activeCategory as ComponentMeta['category'])

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-editor-border">
        <input
          type="text"
          placeholder="搜索组件..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-1 text-xs rounded bg-editor-bg border border-editor-border text-gray-300 placeholder-gray-500 focus:outline-none focus:border-editor-accent"
        />
      </div>

      {!searchQuery && (
        <div className="flex border-b border-editor-border">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex-1 py-2 text-xs transition-colors ${
                activeCategory === cat.key
                  ? 'text-editor-accent border-b-2 border-editor-accent'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {items.length === 0 ? (
          <p className="text-xs text-gray-500 text-center mt-4">无匹配组件</p>
        ) : (
          items.map((meta) => <DraggableItem key={meta.type} meta={meta} />)
        )}
      </div>
    </div>
  )
}
