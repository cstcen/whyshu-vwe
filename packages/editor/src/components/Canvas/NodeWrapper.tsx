import { useDroppable, useDndContext } from '@dnd-kit/core'
import type { ComponentNode } from '@/types'
import { useSelectionStore } from '@/store'
import NodeRenderer from './NodeRenderer'

interface DropZoneProps {
  parentId: string
  index: number
}

/** 容器内的投放区（插入占位符） */
function DropZone({ parentId, index }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `dropzone-${parentId}-${index}`,
    data: { parentId, index },
  })

  return (
    <div
      ref={setNodeRef}
      className={`transition-all duration-150 ${
        isOver ? 'h-8 drop-placeholder my-1' : 'h-1'
      }`}
    />
  )
}

interface NodeWrapperProps {
  node: ComponentNode
  parentId: string
  indexInParent: number
}

/** 单个节点包装器：负责选中高亮和拖拽手柄 */
function NodeWrapper({ node, parentId, indexInParent }: NodeWrapperProps) {
  const { selectedId, hoveredId, select, hover } = useSelectionStore()
  const isSelected = selectedId === node.id
  const isHovered = hoveredId === node.id

  return (
    <div
      data-node-id={node.id}
      onClick={(e) => { e.stopPropagation(); select(node.id) }}
      onMouseEnter={(e) => { e.stopPropagation(); hover(node.id) }}
      onMouseLeave={(e) => { e.stopPropagation(); hover(null) }}
      className={`relative ${isSelected ? 'node-selected' : ''} ${
        isHovered && !isSelected ? 'outline outline-1 outline-blue-400/50' : ''
      }`}
    >
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
  const isDraggingOver = !!active

  const children = node.children ?? []

  return (
    <div className="contents">
      {isDraggingOver && <DropZone parentId={node.id} index={0} />}
      {children.map((child, i) => (
        <div key={child.id}>
          <NodeWrapper node={child} parentId={node.id} indexInParent={i} />
          {isDraggingOver && <DropZone parentId={node.id} index={i + 1} />}
        </div>
      ))}
      {children.length === 0 && !isDraggingOver && (
        <div className="flex items-center justify-center h-16 text-xs text-gray-400 border-2 border-dashed border-gray-600 rounded">
          拖拽组件到此处
        </div>
      )}
    </div>
  )
}

export default NodeWrapper
