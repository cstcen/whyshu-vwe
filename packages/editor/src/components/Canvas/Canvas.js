import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { usePageStore, useSelectionStore } from '@/store';
import { BREAKPOINTS } from '@/types';
import NodeRenderer from './NodeRenderer';
const BREAKPOINT_OPTIONS = [
    { key: 'mobile', label: '📱 移动', width: BREAKPOINTS.mobile },
    { key: 'tablet', label: '💻 平板', width: BREAKPOINTS.tablet },
    { key: 'desktop', label: '🖥️ 桌面', width: BREAKPOINTS.desktop },
];
export default function Canvas() {
    const { page, setBreakpoint } = usePageStore();
    const { select } = useSelectionStore();
    const bp = page.activeBreakpoint;
    const canvasWidth = BREAKPOINTS[bp];
    const cssVarStyle = page.cssVars
        ? Object.fromEntries(Object.entries(page.cssVars).map(([k, v]) => [k, v]))
        : undefined;
    return (_jsxs("div", { className: "flex flex-col h-full", children: [_jsx("div", { className: "flex items-center justify-center gap-1 py-2 border-b border-gray-200 bg-white sticky top-0 z-10", children: BREAKPOINT_OPTIONS.map((opt) => (_jsxs("button", { onClick: () => setBreakpoint(opt.key), className: `px-3 py-1 text-xs rounded transition-colors ${bp === opt.key
                        ? 'bg-editor-accent text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: [opt.label, " (", opt.width, "px)"] }, opt.key))) }), _jsx("div", { className: "flex-1 overflow-auto p-8 flex justify-center", children: _jsx("div", { style: {
                        ...(cssVarStyle ?? {}),
                        width: canvasWidth,
                        minHeight: '600px',
                        transition: 'width 0.3s ease',
                        background: 'var(--bg, #ffffff)',
                        color: 'var(--text, #1a1a1a)',
                    }, className: "bg-white shadow-xl relative", onClick: () => select(null), children: _jsx(NodeRenderer, { node: page.root }) }) })] }));
}
//# sourceMappingURL=Canvas.js.map