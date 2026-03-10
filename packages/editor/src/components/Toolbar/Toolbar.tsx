import { useState } from 'react'
import { useHistoryStore, usePageStore } from '@/store'
import { crawlWebsiteAsTemplatePack } from '@/utils/webTemplate'

const PREVIEW_SCHEMA_KEY = 'vwe:preview-schema'

export default function Toolbar() {
  const { canUndo, canRedo, undo, redo } = useHistoryStore()
  const { page, resetPage, updateCssVars, loadPage } = usePageStore()
  const [isCrawling, setIsCrawling] = useState(false)

  function handleExport() {
    const json = JSON.stringify(page, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${page.meta.title || 'page'}.json`
    a.click()
    URL.revokeObjectURL(url)

    // Save latest schema for instant real-page preview in a separate tab.
    window.localStorage.setItem(PREVIEW_SCHEMA_KEY, json)
    const previewUrl = `${window.location.origin}${window.location.pathname}#/preview`
    window.open(previewUrl, '_blank', 'noopener,noreferrer')
  }

  function handlePreviewOnly() {
    const json = JSON.stringify(page)
    window.localStorage.setItem(PREVIEW_SCHEMA_KEY, json)
    const previewUrl = `${window.location.origin}${window.location.pathname}#/preview`
    window.open(previewUrl, '_blank', 'noopener,noreferrer')
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

  async function handleCrawlTemplate() {
    const raw = prompt('请输入网站入口 URL（会抓取同域 1 层子页面）', 'https://lktop.cn/')
    if (!raw) return
    const entryUrl = raw.trim()
    if (!/^https?:\/\//i.test(entryUrl)) {
      alert('请输入 http(s) 开头的完整 URL')
      return
    }

    setIsCrawling(true)
    try {
      const pack = await crawlWebsiteAsTemplatePack(entryUrl, 1)

      const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `template-pack-${new URL(entryUrl).hostname}.json`
      a.click()
      URL.revokeObjectURL(url)

      if (pack.pages.length > 0) {
        loadPage(pack.pages[0].schema)
      }

      alert(`抓取完成：成功 ${pack.pages.length} 页（已加载首页，并下载模板包）`)
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误'
      alert(`抓取失败：${message}\n如果是 CORS 限制，请在目标站开启跨域，或让我们改为服务端抓取。`)
    } finally {
      setIsCrawling(false)
    }
  }

  const primary = page.cssVars?.['--primary'] ?? '#7c6af5'
  const bg = page.cssVars?.['--bg'] ?? '#ffffff'
  const text = page.cssVars?.['--text'] ?? '#1a1a1a'

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
        <div className="flex items-center gap-1 mr-2 px-2 py-1 border border-editor-border rounded">
          <label className="text-[10px] text-gray-400">主色</label>
          <input
            type="color"
            value={primary}
            onChange={(e) => updateCssVars({ '--primary': e.target.value })}
            className="w-5 h-5 bg-transparent border-0 cursor-pointer"
            title="主题主色"
          />
          <label className="text-[10px] text-gray-400 ml-1">背景</label>
          <input
            type="color"
            value={bg}
            onChange={(e) => updateCssVars({ '--bg': e.target.value })}
            className="w-5 h-5 bg-transparent border-0 cursor-pointer"
            title="页面背景色"
          />
          <label className="text-[10px] text-gray-400 ml-1">文字</label>
          <input
            type="color"
            value={text}
            onChange={(e) => updateCssVars({ '--text': e.target.value })}
            className="w-5 h-5 bg-transparent border-0 cursor-pointer"
            title="页面文字色"
          />
        </div>
        <button
          onClick={handleImport}
          className="px-3 py-1 text-xs rounded border border-editor-border hover:bg-editor-hover transition-colors"
        >
          导入
        </button>
        <button
          onClick={handleCrawlTemplate}
          disabled={isCrawling}
          className="px-3 py-1 text-xs rounded border border-editor-border hover:bg-editor-hover transition-colors disabled:opacity-50"
          title="抓取网站并生成模板包（同域 1 层）"
        >
          {isCrawling ? '抓取中...' : '抓取模板'}
        </button>
        <button
          onClick={handleExport}
          className="px-3 py-1 text-xs rounded border border-editor-border hover:bg-editor-hover transition-colors"
        >
          导出并预览
        </button>
        <button
          onClick={handlePreviewOnly}
          className="px-3 py-1 text-xs rounded border border-editor-border hover:bg-editor-hover transition-colors"
        >
          仅预览
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
