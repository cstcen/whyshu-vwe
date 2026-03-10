import { useRef, Fragment } from 'react'
import { useDroppable, useDndContext, useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { ComponentNode } from '@/types'
import { useSelectionStore, usePageStore } from '@/store'
import NodeRenderer from './NodeRenderer'
import { ResizeHandles } from './ResizeHandles'

interface DropZoneProps {
  parentId: string
  index: number
  placeholder?: boolean
  gridMode?: boolean
}

function DropZone({ parentId, index, placeholder, gridMode }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `dropzone-${parentId}-${index}`,
    data: { parentId, index },
  })

  if (placeholder) {
    return (
      <div
        ref={setNodeRef}
        className={`flex items-center justify-center min-h-[120px] m-2 text-xs rounded border-2 border-dashed transition-all duration-150 ${
          isOver
            ? 'border-editor-accent bg-editor-accent/10 text-editor-accent scale-[1.01]'
            : 'border-gray-300 text-gray-400'
        }`}
      >
        {isOver ? '✦ 松开鼠标放置' : '拖拽组件到此处'}
      </div>
    )
  }

  if (gridMode) {
    return (
      <div
        ref={setNodeRef}
        className={`transition-all duration-150 ${
          isOver
            ? 'h-6 bg-editor-accent/20 border-2 border-dashed border-editor-accent rounded my-1'
            : 'h-3 opacity-0 my-1'
        }`}
        style={{ margin: 0, padding: 0 }}
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      className={`transition-all duration-150 ${
        isOver
          ? 'h-8 bg-editor-accent/20 border-2 border-dashed border-editor-accent rounded my-1'
          : 'h-2'
      }`}
    />
  )
}

interface NodeWrapperProps {
  node: ComponentNode
  parentId: string
  indexInParent: number
}

/** 单个节点包装器：选中高亮 + 画布内拖拽移动 */
function NodeWrapper({ node, parentId, indexInParent }: NodeWrapperProps) {
  const { selectedId, hoveredId, select, hover } = useSelectionStore()
  const { updateNodeStyles } = usePageStore()
  const isSelected = selectedId === node.id
  const isHovered = hoveredId === node.id

  // 是否为绝对定位节点（使用自由拖拽而非 dnd-kit）
  const isAbsolute = node.styles.base?.position === 'absolute'

  // dnd-kit 拖拽（普通流式布局节点）
  const { attributes, listeners, setNodeRef: setDndRef, transform, isDragging } = useDraggable({
    id: `canvas-${node.id}`,
    data: { source: 'canvas', nodeId: node.id, parentId, indexInParent },
    disabled: isAbsolute,
  })

  // 自由拖拽状态（absolute 定位节点）
  const freeDrag = useRef<{
    startX: number; startY: number
    startTop: number; startLeft: number
  } | null>(null)

  function onFreeDragPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    select(node.id)
    const startTop = parseFloat(String(node.styles.base?.top ?? '0')) || 0
    const startLeft = parseFloat(String(node.styles.base?.left ?? '0')) || 0
    freeDrag.current = { startX: e.clientX, startY: e.clientY, startTop, startLeft }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onFreeDragPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!freeDrag.current) return
    e.preventDefault()
    const dx = e.clientX - freeDrag.current.startX
    const dy = e.clientY - freeDrag.current.startY
    updateNodeStyles(node.id, {
      ...node.styles,
      base: {
        ...node.styles.base,
        top: `${freeDrag.current.startTop + dy}px`,
        left: `${freeDrag.current.startLeft + dx}px`,
      },
    })
  }

  function onFreeDragPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!freeDrag.current) return
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    freeDrag.current = null
  }

  if (isAbsolute) {
    return (
      <div
        data-node-id={node.id}
        style={node.styles.base as React.CSSProperties}
        onClick={(e) => { e.stopPropagation(); select(node.id) }}
        onMouseEnter={(e) => { e.stopPropagation(); hover(node.id) }}
        onMouseLeave={(e) => { e.stopPropagation(); hover(null) }}
        className={`${isSelected ? 'node-selected' : ''} ${isHovered && !isSelected ? 'outline outline-1 outline-blue-400/50' : ''}`}
      >
        {/* 自由拖拽手柄 */}
        {(isSelected || isHovered) && (
          <div
            onPointerDown={onFreeDragPointerDown}
            onPointerMove={onFreeDragPointerMove}
            onPointerUp={onFreeDragPointerUp}
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-[100] px-1.5 py-0.5 bg-orange-500 text-white text-[10px] rounded cursor-move select-none shadow whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            ✥ 自由移动
          </div>
        )}
        {/* 调整大小手柄 */}
        {isSelected && <ResizeHandles node={node} />}
        <NodeRenderer node={node} />
      </div>
    )
  }

  return (
    <div
      ref={setDndRef}
      data-node-id={node.id}
      style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.4 : 1 }}
      onClick={(e) => { e.stopPropagation(); select(node.id) }}
      onMouseEnter={(e) => { e.stopPropagation(); hover(node.id) }}
      onMouseLeave={(e) => { e.stopPropagation(); hover(null) }}
      className={`relative ${isSelected ? 'node-selected' : ''} ${
        isHovered && !isSelected ? 'outline outline-1 outline-blue-400/50' : ''
      }`}
    >
      {/* 拖拽手柄：仅在选中或 hover 时显示 */}
      {(isSelected || isHovered) && (
        <div
          {...listeners}
          {...attributes}
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-1.5 py-0.5 bg-editor-accent text-white text-[10px] rounded cursor-grab active:cursor-grabbing select-none shadow whitespace-nowrap"
          onClick={(e) => e.stopPropagation()}
        >
          ⠿ 拖移
        </div>
      )}
      {/* 调整大小手柄 */}
      {isSelected && <ResizeHandles node={node} />}
      <NodeRenderer node={node} />
    </div>
  )
}

interface ContainerChildrenProps {
  node: ComponentNode
}

/** 容器节点的子内容渲染（带 DropZone） */
export function ContainerChildren({ node }: ContainerChildrenProps) {
  const { active } = useDndContext()
  const isDragging = !!active
  const children = node.children ?? []

  const isGridLayout = ['Columns', 'Grid'].includes(node.type)

  if (children.length === 0) {
    return <DropZone parentId={node.id} index={0} placeholder />
  }

  if (isGridLayout) {
    return (
      <>
        {isDragging && (
          <div style={{ gridColumn: '1 / -1' }}>
            <DropZone parentId={node.id} index={0} gridMode />
          </div>
        )}
        {children.map((child, i) => (
          <Fragment key={child.id}>
            <NodeWrapper node={child} parentId={node.id} indexInParent={i} />
            {isDragging && (
              <div style={{ gridColumn: '1 / -1' }}>
                <DropZone parentId={node.id} index={i + 1} gridMode />
              </div>
            )}
          </Fragment>
        ))}
      </>
    )
  }

  return (
    <>
      {isDragging && <DropZone parentId={node.id} index={0} />}
      {children.map((child, i) => (
        <Fragment key={child.id}>
          <NodeWrapper node={child} parentId={node.id} indexInParent={i} />
          {isDragging && <DropZone parentId={node.id} index={i + 1} />}
        </Fragment>
      ))}
    </>
  )
}

export default NodeWrapper
