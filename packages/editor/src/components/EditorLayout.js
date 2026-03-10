import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors, } from '@dnd-kit/core';
import { registerBuiltinComponents, getComponentMeta } from '@/engine';
import { usePageStore, useSelectionStore, useHistoryStore, withHistory } from '@/store';
import { nanoid } from '@/utils/nanoid';
import ComponentLibPanel from './ComponentLib/ComponentLibPanel';
import Canvas from './Canvas/Canvas';
import InspectorPanel from './Inspector/InspectorPanel';
import Toolbar from './Toolbar/Toolbar';
// 初始化内置组件
registerBuiltinComponents();
export default function EditorLayout() {
    const { addNode, moveNode } = usePageStore();
    const { select } = useSelectionStore();
    const { undo, redo } = useHistoryStore();
    const [activeType, setActiveType] = useState(null);
    const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 5 } }), useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }));
    // 全局快捷键
    useEffect(() => {
        const handler = (e) => {
            const isMac = navigator.platform.includes('Mac');
            const ctrl = isMac ? e.metaKey : e.ctrlKey;
            if (ctrl && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [undo, redo]);
    function handleDragStart(event) {
        const data = event.active.data.current;
        if (data?.source === 'library') {
            setActiveType(data.type);
        }
    }
    function handleDragEnd(event) {
        setActiveType(null);
        const { active, over } = event;
        if (!over)
            return;
        const activeData = active.data.current;
        const overData = over.data.current;
        if (over.id.toString().startsWith('dropzone-')) {
            const targetParentId = overData?.parentId;
            const targetIndex = overData?.index;
            if (activeData?.source === 'library') {
                const meta = getComponentMeta(activeData.type);
                if (!meta)
                    return;
                const newNode = {
                    id: nanoid(),
                    type: activeData.type,
                    props: { ...meta.defaultProps },
                    styles: { ...meta.defaultStyles },
                    events: [],
                    children: meta.isContainer ? [] : undefined,
                };
                withHistory(`添加 ${meta.label}`, addNode)(newNode, targetParentId, targetIndex);
                select(newNode.id);
            }
            else if (activeData?.source === 'canvas') {
                withHistory('移动节点', moveNode)(activeData.nodeId, targetParentId, targetIndex);
            }
        }
    }
    return (_jsxs("div", { className: "flex flex-col w-full h-full bg-editor-bg text-white", children: [_jsx(Toolbar, {}), _jsxs(DndContext, { sensors: sensors, onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: [_jsxs("div", { className: "flex flex-1 overflow-hidden", children: [_jsx("aside", { className: "w-56 flex-shrink-0 border-r border-editor-border bg-editor-panel overflow-y-auto", children: _jsx(ComponentLibPanel, {}) }), _jsx("main", { className: "flex-1 overflow-auto bg-gray-100", children: _jsx(Canvas, {}) }), _jsx("aside", { className: "w-64 flex-shrink-0 border-l border-editor-border bg-editor-panel overflow-y-auto", children: _jsx(InspectorPanel, {}) })] }), _jsx(DragOverlay, { children: activeType && (_jsx("div", { className: "px-3 py-2 bg-editor-accent text-white text-xs rounded shadow-lg opacity-80", children: activeType })) })] })] }));
}
//# sourceMappingURL=EditorLayout.js.map