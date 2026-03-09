import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { useState } from 'react'
import { usePageStore, useSelectionStore } from '@/store'
import { getComponentMeta } from '@/engine'
import type { ComponentNode, Breakpoint } from '@/types'
import { nanoid } from '@/utils/nanoid'
import NodeRenderer from './NodeRenderer'
import { BREAKPOINTS } from '@/types'

const BREAKPOINT_OPTIONS: Array<{ key: Breakpoint; label: string; width: number }> = [
  { key: 'mobile', label: '📱 移动', width: BREAKPOINTS.mobile },
  { key: 'tablet', label: '💻 平板', width: BREAKPOINTS.tablet },
  { key: 'desktop', label: '🖥️ 桌面', width: BREAKPOINTS.desktop },
]

export default function Canvas() {
  const { page, addNode, moveNode, setBreakpoint } = usePageStore()
  const { select } = useSelectionStore()
  const [activeType, setActiveType] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  function handleDragStart(event: DragEndEvent) {
    const data = event.active.data.current
    if (data?.source === 'library') {
      setActiveType(data.type as string)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveType(null)
    const { active, over } = event
    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    // 投放到 DropZone（格式：dropzone-{parentId}-{index}）
    if (over.id.toString().startsWith('dropzone-')) {
      const targetParentId = overData?.parentId as string
      const targetIndex = overData?.index as number

      if (activeData?.source === 'library') {
        // 从组件库拖入：新增节点
        const meta = getComponentMeta(activeData.type as string)
        if (!meta) return
        const newNode: ComponentNode = {
          id: nanoid(),
          type: activeData.type as string,
          props: { ...meta.defaultProps },
          styles: { ...meta.defaultStyles },
          events: [],
          children: meta.isContainer ? [] : undefined,
        }
        addNode(newNode, targetParentId, targetIndex)
        select(newNode.id)
      } else if (activeData?.source === 'canvas') {
        // 画布内移动
        moveNode(activeData.nodeId as string, targetParentId, targetIndex)
      }
    }
  }

  const bp = page.activeBreakpoint
  const canvasWidth = BREAKPOINTS[bp]

  return (
    <div className="flex flex-col h-full">
      {/* 断点切换栏 */}
      <div className="flex items-center justify-center gap-1 py-2 border-b border-gray-200 bg-white sticky top-0 z-10">
        {BREAKPOINT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setBreakpoint(opt.key)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              bp === opt.key
                ? 'bg-editor-accent text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label} ({opt.width}px)
          </button>
        ))}
      </div>

      {/* 画布主体 */}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div
            style={{ width: canvasWidth, minHeight: '600px', transition: 'width 0.3s ease' }}
            className="bg-white shadow-xl relative"
            onClick={() => select(null)}
          >
            <NodeRenderer node={page.root} />
          </div>

          {/* 拖拽时的浮动预览 */}
          <DragOverlay>
            {activeType && (
              <div className="px-3 py-2 bg-editor-accent text-white text-xs rounded shadow-lg opacity-80">
                {activeType}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
