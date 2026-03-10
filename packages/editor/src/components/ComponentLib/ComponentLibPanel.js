import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { getMetasByCategory, getAllMetas } from '@/engine';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
const CATEGORIES = [
    { key: 'basic', label: '基础' },
    { key: 'layout', label: '布局' },
    { key: 'form', label: '表单' },
    { key: 'media', label: '媒体' },
    { key: 'advanced', label: '高级' },
];
function DraggableItem({ meta }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `lib-${meta.type}`,
        data: {
            // 标识来源：组件库，区别于画布内拖拽
            source: 'library',
            type: meta.type,
            defaultProps: meta.defaultProps,
            defaultStyles: meta.defaultStyles,
        },
    });
    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };
    return (_jsxs("div", { ref: setNodeRef, style: style, ...listeners, ...attributes, className: "flex items-center gap-2 px-2 py-2 rounded cursor-grab hover:bg-editor-hover active:cursor-grabbing select-none text-sm text-gray-300", title: meta.label, children: [_jsx("span", { className: "text-gray-400 text-xs w-4 text-center", children: "\u229E" }), _jsx("span", { children: meta.label })] }));
}
export default function ComponentLibPanel() {
    const [activeCategory, setActiveCategory] = useState('basic');
    const [searchQuery, setSearchQuery] = useState('');
    const items = searchQuery
        ? getAllMetas().filter((m) => m.label.includes(searchQuery) || m.type.toLowerCase().includes(searchQuery.toLowerCase()))
        : getMetasByCategory(activeCategory);
    return (_jsxs("div", { className: "flex flex-col h-full", children: [_jsx("div", { className: "p-3 border-b border-editor-border", children: _jsx("input", { type: "text", placeholder: "\u641C\u7D22\u7EC4\u4EF6...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full px-2 py-1 text-xs rounded bg-editor-bg border border-editor-border text-gray-300 placeholder-gray-500 focus:outline-none focus:border-editor-accent" }) }), !searchQuery && (_jsx("div", { className: "flex border-b border-editor-border", children: CATEGORIES.map((cat) => (_jsx("button", { onClick: () => setActiveCategory(cat.key), className: `flex-1 py-2 text-xs transition-colors ${activeCategory === cat.key
                        ? 'text-editor-accent border-b-2 border-editor-accent'
                        : 'text-gray-400 hover:text-gray-200'}`, children: cat.label }, cat.key))) })), _jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-0.5", children: items.length === 0 ? (_jsx("p", { className: "text-xs text-gray-500 text-center mt-4", children: "\u65E0\u5339\u914D\u7EC4\u4EF6" })) : (items.map((meta) => _jsx(DraggableItem, { meta: meta }, meta.type))) })] }));
}
//# sourceMappingURL=ComponentLibPanel.js.map