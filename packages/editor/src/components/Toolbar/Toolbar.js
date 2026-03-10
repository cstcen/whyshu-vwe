import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useHistoryStore, usePageStore } from '@/store';
import { crawlWebsiteAsTemplatePack } from '@/utils/webTemplate';
const PREVIEW_SCHEMA_KEY = 'vwe:preview-schema';
export default function Toolbar() {
    const { canUndo, canRedo, undo, redo } = useHistoryStore();
    const { page, resetPage, updateCssVars, loadPage } = usePageStore();
    const [isCrawling, setIsCrawling] = useState(false);
    function handleExport() {
        const json = JSON.stringify(page, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${page.meta.title || 'page'}.json`;
        a.click();
        URL.revokeObjectURL(url);
        // Save latest schema for instant real-page preview in a separate tab.
        window.localStorage.setItem(PREVIEW_SCHEMA_KEY, json);
        const previewUrl = `${window.location.origin}${window.location.pathname}#/preview`;
        window.open(previewUrl, '_blank', 'noopener,noreferrer');
    }
    function handlePreviewOnly() {
        const json = JSON.stringify(page);
        window.localStorage.setItem(PREVIEW_SCHEMA_KEY, json);
        const previewUrl = `${window.location.origin}${window.location.pathname}#/preview`;
        window.open(previewUrl, '_blank', 'noopener,noreferrer');
    }
    function handleImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (!file)
                return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const schema = JSON.parse(ev.target?.result);
                    usePageStore.getState().loadPage(schema);
                }
                catch {
                    alert('无效的页面文件');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    async function handleCrawlTemplate() {
        const raw = prompt('请输入网站入口 URL（会抓取同域 1 层子页面）', 'https://lktop.cn/');
        if (!raw)
            return;
        const entryUrl = raw.trim();
        if (!/^https?:\/\//i.test(entryUrl)) {
            alert('请输入 http(s) 开头的完整 URL');
            return;
        }
        setIsCrawling(true);
        try {
            const pack = await crawlWebsiteAsTemplatePack(entryUrl, 1);
            const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `template-pack-${new URL(entryUrl).hostname}.json`;
            a.click();
            URL.revokeObjectURL(url);
            if (pack.pages.length > 0) {
                loadPage(pack.pages[0].schema);
            }
            alert(`抓取完成：成功 ${pack.pages.length} 页（已加载首页，并下载模板包）`);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : '未知错误';
            alert(`抓取失败：${message}\n如果是 CORS 限制，请在目标站开启跨域，或让我们改为服务端抓取。`);
        }
        finally {
            setIsCrawling(false);
        }
    }
    const primary = page.cssVars?.['--primary'] ?? '#7c6af5';
    const bg = page.cssVars?.['--bg'] ?? '#ffffff';
    const text = page.cssVars?.['--text'] ?? '#1a1a1a';
    return (_jsxs("header", { className: "flex items-center justify-between px-4 h-10 border-b border-editor-border bg-editor-panel flex-shrink-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-editor-accent font-bold text-sm", children: "VWE" }), _jsx("span", { className: "text-gray-500 text-xs", children: "\u53EF\u89C6\u5316\u7F51\u7AD9\u7F16\u8F91\u5668" })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: undo, disabled: !canUndo, title: "\u64A4\u9500 (Ctrl+Z)", className: "px-2 py-1 text-xs rounded disabled:opacity-30 hover:bg-editor-hover transition-colors", children: "\u21A9 \u64A4\u9500" }), _jsx("button", { onClick: redo, disabled: !canRedo, title: "\u91CD\u505A (Ctrl+Y)", className: "px-2 py-1 text-xs rounded disabled:opacity-30 hover:bg-editor-hover transition-colors", children: "\u21AA \u91CD\u505A" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "flex items-center gap-1 mr-2 px-2 py-1 border border-editor-border rounded", children: [_jsx("label", { className: "text-[10px] text-gray-400", children: "\u4E3B\u8272" }), _jsx("input", { type: "color", value: primary, onChange: (e) => updateCssVars({ '--primary': e.target.value }), className: "w-5 h-5 bg-transparent border-0 cursor-pointer", title: "\u4E3B\u9898\u4E3B\u8272" }), _jsx("label", { className: "text-[10px] text-gray-400 ml-1", children: "\u80CC\u666F" }), _jsx("input", { type: "color", value: bg, onChange: (e) => updateCssVars({ '--bg': e.target.value }), className: "w-5 h-5 bg-transparent border-0 cursor-pointer", title: "\u9875\u9762\u80CC\u666F\u8272" }), _jsx("label", { className: "text-[10px] text-gray-400 ml-1", children: "\u6587\u5B57" }), _jsx("input", { type: "color", value: text, onChange: (e) => updateCssVars({ '--text': e.target.value }), className: "w-5 h-5 bg-transparent border-0 cursor-pointer", title: "\u9875\u9762\u6587\u5B57\u8272" })] }), _jsx("button", { onClick: handleImport, className: "px-3 py-1 text-xs rounded border border-editor-border hover:bg-editor-hover transition-colors", children: "\u5BFC\u5165" }), _jsx("button", { onClick: handleCrawlTemplate, disabled: isCrawling, className: "px-3 py-1 text-xs rounded border border-editor-border hover:bg-editor-hover transition-colors disabled:opacity-50", title: "\u6293\u53D6\u7F51\u7AD9\u5E76\u751F\u6210\u6A21\u677F\u5305\uFF08\u540C\u57DF 1 \u5C42\uFF09", children: isCrawling ? '抓取中...' : '抓取模板' }), _jsx("button", { onClick: handleExport, className: "px-3 py-1 text-xs rounded border border-editor-border hover:bg-editor-hover transition-colors", children: "\u5BFC\u51FA\u5E76\u9884\u89C8" }), _jsx("button", { onClick: handlePreviewOnly, className: "px-3 py-1 text-xs rounded border border-editor-border hover:bg-editor-hover transition-colors", children: "\u4EC5\u9884\u89C8" }), _jsx("button", { onClick: () => { if (confirm('确认重置页面？'))
                            resetPage(); }, className: "px-3 py-1 text-xs rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors", children: "\u91CD\u7F6E" })] })] }));
}
//# sourceMappingURL=Toolbar.js.map