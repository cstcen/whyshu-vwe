import { useHistoryStore, usePageStore } from '@/store'

export default function Toolbar() {
  const { canUndo, canRedo, undo, redo } = useHistoryStore()
  const { page, resetPage } = usePageStore()

  function handleExport() {
    const json = JSON.stringify(page, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${page.meta.title || 'page'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const schema = JSON.parse(ev.target?.result as string)
          usePageStore.getState().loadPage(schema)
        } catch {
          alert('无效的页面文件')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <header className="flex items-center justify-between px-4 h-10 border-b border-editor-border bg-editor-panel flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-editor-accent font-bold text-sm">VWE</span>
        <span className="text-gray-500 text-xs">可视化网站编辑器</span>
      </div>

      {/* 中间操作区 */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          title="撤销 (Ctrl+Z)"
          className="px-2 py-1 text-xs rounded disabled:opacity-30 hover:bg-editor-hover transition-colors"
        >
          ↩ 撤销
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="重做 (Ctrl+Y)"
          className="px-2 py-1 text-xs rounded disabled:opacity-30 hover:bg-editor-hover transition-colors"
        >
          ↪ 重做
        </button>
      </div>

      {/* 右侧工具 */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleImport}
          className="px-3 py-1 text-xs rounded border border-editor-border hover:bg-editor-hover transition-colors"
        >
          导入
        </button>
        <button
          onClick={handleExport}
          className="px-3 py-1 text-xs rounded border border-editor-border hover:bg-editor-hover transition-colors"
        >
          导出 JSON
        </button>
        <button
          onClick={() => { if (confirm('确认重置页面？')) resetPage() }}
          className="px-3 py-1 text-xs rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
        >
          重置
        </button>
      </div>
    </header>
  )
}
