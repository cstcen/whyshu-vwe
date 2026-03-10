import { useEffect, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { registerBuiltinComponents, getComponentMeta } from '@/engine'
import { usePageStore, useSelectionStore, useHistoryStore, withHistory } from '@/store'
import type { ComponentNode } from '@/types'
import { nanoid } from '@/utils/nanoid'
import ComponentLibPanel from './ComponentLib/ComponentLibPanel'
import Canvas from './Canvas/Canvas'
import InspectorPanel from './Inspector/InspectorPanel'
import Toolbar from './Toolbar/Toolbar'

// 初始化内置组件
registerBuiltinComponents()

export default function EditorLayout() {
  const { addNode, moveNode } = usePageStore()
  const { select } = useSelectionStore()
  const { undo, redo } = useHistoryStore()
  const [activeType, setActiveType] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  // 全局快捷键
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.includes('Mac')
      const ctrl = isMac ? e.metaKey : e.ctrlKey
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  function handleDragStart(event: DragStartEvent) {
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

    if (over.id.toString().startsWith('dropzone-')) {
      const targetParentId = overData?.parentId as string
      const targetIndex = overData?.index as number

      if (activeData?.source === 'library') {
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
        withHistory(`添加 ${meta.label}`, addNode)(newNode, targetParentId, targetIndex)
        select(newNode.id)
      } else if (activeData?.source === 'canvas') {
        withHistory('移动节点', moveNode)(activeData.nodeId as string, targetParentId, targetIndex)
      }
    }
  }

  return (
    <div className="flex flex-col w-full h-full bg-editor-bg text-white">
      {/* 顶部工具栏 */}
      <Toolbar />

      {/* DndContext 包裹整个三栏，使左右面板和画布共享同一拖拽上下文 */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* 主体三栏布局 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 左侧组件面板 */}
          <aside className="w-56 flex-shrink-0 border-r border-editor-border bg-editor-panel overflow-y-auto">
            <ComponentLibPanel />
          </aside>

          {/* 中间画布 */}
          <main className="flex-1 overflow-auto bg-gray-100">
            <Canvas />
          </main>

          {/* 右侧属性面板 */}
          <aside className="w-64 flex-shrink-0 border-l border-editor-border bg-editor-panel overflow-y-auto">
            <InspectorPanel />
          </aside>
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
  )
}
