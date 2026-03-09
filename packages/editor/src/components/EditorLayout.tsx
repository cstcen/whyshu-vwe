import { useEffect } from 'react'
import { registerBuiltinComponents } from '@/engine'
import ComponentLibPanel from './ComponentLib/ComponentLibPanel'
import Canvas from './Canvas/Canvas'
import InspectorPanel from './Inspector/InspectorPanel'
import Toolbar from './Toolbar/Toolbar'

// 初始化内置组件
registerBuiltinComponents()

export default function EditorLayout() {
  // 全局快捷键
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.includes('Mac')
      const ctrl = isMac ? e.metaKey : e.ctrlKey
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        // undo - 在 historyStore 中处理
        import('@/store').then(({ useHistoryStore }) => useHistoryStore.getState().undo())
      }
      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        import('@/store').then(({ useHistoryStore }) => useHistoryStore.getState().redo())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="flex flex-col w-full h-full bg-editor-bg text-white">
      {/* 顶部工具栏 */}
      <Toolbar />

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
    </div>
  )
}
