import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useSelectionStore, usePageStore, withHistory } from '@/store';
import { getComponentMeta } from '@/engine';
function PropControl({ schema, value, onChange, }) {
    switch (schema.control) {
        case 'input':
            return (_jsx("input", { type: "text", value: String(value ?? ''), onChange: (e) => onChange(e.target.value), className: "w-full px-2 py-1 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent" }));
        case 'textarea':
            return (_jsx("textarea", { value: String(value ?? ''), onChange: (e) => onChange(e.target.value), rows: 3, className: "w-full px-2 py-1 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent resize-none" }));
        case 'switch':
            return (_jsx("button", { onClick: () => onChange(!value), className: `w-9 h-5 rounded-full transition-colors relative ${value ? 'bg-editor-accent' : 'bg-gray-600'}`, children: _jsx("span", { className: `absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}` }) }));
        case 'select':
            return (_jsx("select", { value: String(value ?? ''), onChange: (e) => onChange(e.target.value), className: "w-full px-2 py-1 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none", children: schema.options?.map((opt) => (_jsx("option", { value: String(opt.value), children: opt.label }, String(opt.value)))) }));
        case 'color':
            return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "color", value: String(value ?? '#000000'), onChange: (e) => onChange(e.target.value), className: "w-8 h-6 rounded cursor-pointer border-0 bg-transparent" }), _jsx("span", { className: "text-xs text-gray-400", children: String(value ?? '') })] }));
        case 'number':
            return (_jsx("input", { type: "number", value: Number(value ?? 0), onChange: (e) => onChange(Number(e.target.value)), className: "w-full px-2 py-1 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent" }));
        case 'image':
            return (_jsxs("div", { className: "space-y-2", children: [_jsx("input", { type: "text", value: String(value ?? ''), onChange: (e) => onChange(e.target.value), placeholder: "https://example.com/image.jpg", className: "w-full px-2 py-1 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent" }), _jsx("input", { type: "file", accept: "image/*", onChange: (e) => {
                            const file = e.target.files?.[0];
                            if (!file)
                                return;
                            const reader = new FileReader();
                            reader.onload = () => onChange(String(reader.result ?? ''));
                            reader.readAsDataURL(file);
                        }, className: "w-full text-xs text-gray-400 file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:bg-editor-panel file:text-gray-300" })] }));
        case 'event':
            const raw = String(value ?? '');
            const [action, ...payloadParts] = raw.split(':');
            const payload = payloadParts.join(':');
            const normalizedAction = action || 'alert';
            return (_jsxs("div", { className: "space-y-2", children: [_jsxs("select", { value: normalizedAction, onChange: (e) => onChange(`${e.target.value}:${payload}`), className: "w-full px-2 py-1 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none", children: [_jsx("option", { value: "alert", children: "\u5F39\u7A97\u63D0\u793A" }), _jsx("option", { value: "link", children: "\u6253\u5F00\u94FE\u63A5\uFF08\u65B0\u7A97\u53E3\uFF09" }), _jsx("option", { value: "navigate", children: "\u9875\u9762\u8DF3\u8F6C\uFF08\u5F53\u524D\u7A97\u53E3\uFF09" }), _jsx("option", { value: "console", children: "\u63A7\u5236\u53F0\u8F93\u51FA" })] }), _jsx("input", { type: "text", value: payload, onChange: (e) => onChange(`${normalizedAction}:${e.target.value}`), placeholder: "\u586B\u5199\u5185\u5BB9\uFF0C\u4F8B\u5982 https://example.com", className: "w-full px-2 py-1 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent" }), _jsx("p", { className: "text-[10px] text-gray-500", children: "\u683C\u5F0F: action:payload" })] }));
        default:
            return _jsx("span", { className: "text-xs text-gray-500", children: "\u6682\u4E0D\u652F\u6301" });
    }
}
export default function InspectorPanel() {
    const { selectedId, select } = useSelectionStore();
    const { findNode, updateNodeProps, updateNodeStyles, removeNode, page } = usePageStore();
    // 键盘删除快捷键 (Delete / Backspace)
    useEffect(() => {
        if (!selectedId)
            return;
        const handleKeyDown = (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                handleDelete();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId]);
    function handleDelete() {
        if (!selectedId || selectedId === 'root')
            return;
        withHistory('删除组件', removeNode)(selectedId);
        select(null);
    }
    if (!selectedId) {
        return (_jsx("div", { className: "flex items-center justify-center h-full text-xs text-gray-500", children: "\u70B9\u51FB\u753B\u5E03\u4E2D\u7684\u7EC4\u4EF6\u4EE5\u7F16\u8F91\u5C5E\u6027" }));
    }
    const node = findNode(selectedId);
    if (!node)
        return null;
    const meta = getComponentMeta(node.type);
    if (!meta)
        return null;
    const currentBp = page.activeBreakpoint;
    const bpStyles = node.styles[currentBp] ?? {};
    return (_jsxs("div", { className: "flex flex-col h-full text-sm", children: [_jsxs("div", { className: "px-3 py-2 border-b border-editor-border flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-400", children: "\u7EC4\u4EF6: " }), _jsx("span", { className: "text-xs font-medium text-editor-accent", children: meta.label }), _jsxs("span", { className: "text-xs text-gray-600 ml-1", children: ["#", node.id.slice(0, 6)] })] }), node.id !== 'root' && (_jsx("button", { onClick: handleDelete, title: "\u5220\u9664\u7EC4\u4EF6 (Delete)", className: "px-2 py-1 text-[10px] rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors border border-red-500/30 hover:border-red-500/50", children: "\uD83D\uDDD1 \u5220\u9664" }))] }), _jsxs("div", { className: "flex-1 overflow-y-auto", children: [_jsxs("div", { className: "px-3 py-2 border-b border-editor-border", children: [_jsx("p", { className: "text-xs font-medium text-gray-300 mb-2", children: "\u5C5E\u6027" }), _jsx("div", { className: "space-y-3", children: Object.entries(meta.propsSchema).map(([key, schema]) => (_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-400 mb-1", children: schema.label }), _jsx(PropControl, { name: key, schema: schema, value: node.props[key], onChange: (val) => updateNodeProps(node.id, { [key]: val }) })] }, key))) })] }), _jsxs("div", { className: "px-3 py-2 border-b border-editor-border", children: [_jsxs("p", { className: "text-xs font-medium text-gray-300 mb-2", children: ["\u5C3A\u5BF8 & \u95F4\u8DDD", _jsxs("span", { className: "text-gray-500 font-normal ml-1", children: ["(", currentBp === 'desktop' ? '桌面' : currentBp === 'tablet' ? '平板' : '移动', ")"] })] }), _jsx("div", { className: "space-y-2", children: [
                                    ['width', '宽度'],
                                    ['height', '高度'],
                                    ['padding', '内边距'],
                                    ['margin', '外边距'],
                                    ['display', '显示模式'],
                                    ['gap', '间隔'],
                                ].map(([key, label]) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-gray-500 w-14 flex-shrink-0", children: label }), _jsx("input", { type: "text", value: String(bpStyles[key] ?? node.styles.base?.[key] ?? ''), onChange: (e) => updateNodeStyles(node.id, {
                                                ...node.styles,
                                                [currentBp === 'desktop' ? 'base' : currentBp]: {
                                                    ...(currentBp === 'desktop' ? node.styles.base : node.styles[currentBp]),
                                                    [key]: e.target.value,
                                                },
                                            }), placeholder: "auto", className: "flex-1 min-w-0 px-2 py-0.5 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent" })] }, key))) })] }), _jsxs("div", { className: "px-3 py-2 border-b border-editor-border", children: [_jsx("p", { className: "text-xs font-medium text-gray-300 mb-2", children: "Flex \u5E03\u5C40" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-gray-500 w-14 flex-shrink-0", children: "\u589E\u957F\u6BD4" }), _jsx("input", { type: "number", min: "0", value: String(bpStyles.flexGrow ?? node.styles.base?.flexGrow ?? ''), onChange: (e) => updateNodeStyles(node.id, {
                                                    ...node.styles,
                                                    [currentBp === 'desktop' ? 'base' : currentBp]: {
                                                        ...(currentBp === 'desktop' ? node.styles.base : node.styles[currentBp]),
                                                        flexGrow: e.target.value ? Number(e.target.value) : undefined,
                                                    },
                                                }), placeholder: "0", className: "flex-1 min-w-0 px-2 py-0.5 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-gray-500 w-14 flex-shrink-0", children: "\u6536\u7F29\u6BD4" }), _jsx("input", { type: "number", min: "0", value: String(bpStyles.flexShrink ?? node.styles.base?.flexShrink ?? ''), onChange: (e) => updateNodeStyles(node.id, {
                                                    ...node.styles,
                                                    [currentBp === 'desktop' ? 'base' : currentBp]: {
                                                        ...(currentBp === 'desktop' ? node.styles.base : node.styles[currentBp]),
                                                        flexShrink: e.target.value ? Number(e.target.value) : undefined,
                                                    },
                                                }), placeholder: "1", className: "flex-1 min-w-0 px-2 py-0.5 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-gray-500 w-14 flex-shrink-0", children: "\u57FA\u7840\u503C" }), _jsx("input", { type: "text", value: String(bpStyles.flexBasis ?? node.styles.base?.flexBasis ?? ''), onChange: (e) => updateNodeStyles(node.id, {
                                                    ...node.styles,
                                                    [currentBp === 'desktop' ? 'base' : currentBp]: {
                                                        ...(currentBp === 'desktop' ? node.styles.base : node.styles[currentBp]),
                                                        flexBasis: e.target.value || undefined,
                                                    },
                                                }), placeholder: "auto", className: "flex-1 min-w-0 px-2 py-0.5 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent" })] }), _jsxs("p", { className: "text-[10px] text-gray-500 mt-1", children: ["\uD83D\uDCA1 \u8BBE\u7F6E\u7236\u5BB9\u5668\u4E3A ", _jsx("code", { children: "flex" }), "\uFF0C\u5B50\u5143\u7D20\u7684\"\u589E\u957F\u6BD4\"\u5373\u4E3A\u5BBD\u5EA6\u5360\u6BD4", _jsx("br", {}), "\u4F8B\u5982\uFF1A\u589E\u957F\u6BD4 1 / 1 / 2 = 25% / 25% / 50% \u7684\u5BBD\u5EA6\u5206\u5E03"] })] })] }), _jsxs("div", { className: "px-3 py-2 border-b border-editor-border", children: [_jsx("p", { className: "text-xs font-medium text-gray-300 mb-2", children: "\u6587\u5B57" }), _jsx("div", { className: "space-y-2", children: [
                                    ['fontSize', '字号'],
                                    ['fontWeight', '字重'],
                                    ['color', '颜色'],
                                    ['lineHeight', '行高'],
                                    ['textAlign', '对齐'],
                                ].map(([key, label]) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-gray-500 w-14 flex-shrink-0", children: label }), _jsx("input", { type: "text", value: String(bpStyles[key] ?? node.styles.base?.[key] ?? ''), onChange: (e) => updateNodeStyles(node.id, {
                                                ...node.styles,
                                                [currentBp === 'desktop' ? 'base' : currentBp]: {
                                                    ...(currentBp === 'desktop' ? node.styles.base : node.styles[currentBp]),
                                                    [key]: e.target.value,
                                                },
                                            }), placeholder: "\u2014", className: "flex-1 min-w-0 px-2 py-0.5 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent" })] }, key))) })] }), _jsxs("div", { className: "px-3 py-2 border-b border-editor-border", children: [_jsx("p", { className: "text-xs font-medium text-gray-300 mb-2", children: "\u5916\u89C2" }), _jsx("div", { className: "space-y-2", children: [
                                    ['backgroundColor', '背景色'],
                                    ['borderRadius', '圆角'],
                                    ['border', '边框'],
                                    ['boxShadow', '阴影'],
                                    ['opacity', '透明度'],
                                ].map(([key, label]) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-gray-500 w-14 flex-shrink-0", children: label }), _jsx("input", { type: "text", value: String(bpStyles[key] ?? node.styles.base?.[key] ?? ''), onChange: (e) => updateNodeStyles(node.id, {
                                                ...node.styles,
                                                [currentBp === 'desktop' ? 'base' : currentBp]: {
                                                    ...(currentBp === 'desktop' ? node.styles.base : node.styles[currentBp]),
                                                    [key]: e.target.value,
                                                },
                                            }), placeholder: "\u2014", className: "flex-1 min-w-0 px-2 py-0.5 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent" })] }, key))) })] }), _jsxs("div", { className: "px-3 py-2", children: [_jsx("p", { className: "text-xs font-medium text-gray-300 mb-1", children: "\u5B9A\u4F4D" }), _jsxs("p", { className: "text-[10px] text-gray-500 mb-2", children: ["\u8BBE\u4E3A ", _jsx("code", { className: "text-editor-accent", children: "absolute" }), " \u540E\u53EF\u5728\"\u81EA\u7531\u5C42\"\u5BB9\u5668\u5185\u81EA\u7531\u91CD\u53E0"] }), _jsx("div", { className: "space-y-2", children: [
                                    ['position', '定位方式'],
                                    ['top', '上 (top)'],
                                    ['left', '左 (left)'],
                                    ['right', '右 (right)'],
                                    ['bottom', '下 (bottom)'],
                                    ['zIndex', '层级 (z)'],
                                ].map(([key, label]) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-gray-500 w-14 flex-shrink-0", children: label }), _jsx("input", { type: "text", value: String(bpStyles[key] ?? node.styles.base?.[key] ?? ''), onChange: (e) => updateNodeStyles(node.id, {
                                                ...node.styles,
                                                [currentBp === 'desktop' ? 'base' : currentBp]: {
                                                    ...(currentBp === 'desktop' ? node.styles.base : node.styles[currentBp]),
                                                    [key]: e.target.value,
                                                },
                                            }), placeholder: "\u2014", className: "flex-1 min-w-0 px-2 py-0.5 text-xs bg-editor-bg border border-editor-border rounded text-gray-200 focus:outline-none focus:border-editor-accent" })] }, key))) })] })] })] }));
}
//# sourceMappingURL=InspectorPanel.js.map