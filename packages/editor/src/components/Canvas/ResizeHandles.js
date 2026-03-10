import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { usePageStore } from '@/store';
/**
 * 拖拽调整大小手柄组件
 * 在选中节点周围显示8个手柄（四角 + 四边）
 */
export function ResizeHandles({ node }) {
    const { updateNodeStyles } = usePageStore();
    const resizeState = useRef(null);
    function onResizeStart(e, direction) {
        e.preventDefault();
        e.stopPropagation();
        const target = e.currentTarget.parentElement;
        if (!target)
            return;
        const rect = target.getBoundingClientRect();
        const currentStyles = node.styles.base || {};
        // 获取当前尺寸
        const startWidth = rect.width;
        const startHeight = rect.height;
        const startTop = parseFloat(String(currentStyles.top ?? '0')) || 0;
        const startLeft = parseFloat(String(currentStyles.left ?? '0')) || 0;
        resizeState.current = {
            direction,
            startX: e.clientX,
            startY: e.clientY,
            startWidth,
            startHeight,
            startTop,
            startLeft,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
        // 添加全局鼠标移动和释放监听
        document.addEventListener('pointermove', onResizeMove);
        document.addEventListener('pointerup', onResizeEnd);
    }
    function onResizeMove(e) {
        if (!resizeState.current)
            return;
        e.preventDefault();
        const { direction, startX, startY, startWidth, startHeight, startTop, startLeft } = resizeState.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newTop = startTop;
        let newLeft = startLeft;
        // 计算新尺寸和位置（根据拖拽方向）
        if (direction.includes('e')) {
            newWidth = Math.max(20, startWidth + dx);
        }
        if (direction.includes('w')) {
            newWidth = Math.max(20, startWidth - dx);
            if (node.styles.base?.position === 'absolute') {
                newLeft = startLeft + dx;
            }
        }
        if (direction.includes('s')) {
            newHeight = Math.max(20, startHeight + dy);
        }
        if (direction.includes('n')) {
            newHeight = Math.max(20, startHeight - dy);
            if (node.styles.base?.position === 'absolute') {
                newTop = startTop + dy;
            }
        }
        // 更新节点样式
        const updatedStyles = {
            ...node.styles,
            base: {
                ...node.styles.base,
                width: `${newWidth}px`,
                height: `${newHeight}px`,
            },
        };
        // 如果是绝对定位，还需要更新 top/left
        if (node.styles.base?.position === 'absolute') {
            if (direction.includes('w')) {
                updatedStyles.base.left = `${newLeft}px`;
            }
            if (direction.includes('n')) {
                updatedStyles.base.top = `${newTop}px`;
            }
        }
        updateNodeStyles(node.id, updatedStyles);
    }
    function onResizeEnd(e) {
        e.preventDefault();
        resizeState.current = null;
        // 移除全局监听器
        document.removeEventListener('pointermove', onResizeMove);
        document.removeEventListener('pointerup', onResizeEnd);
    }
    // 手柄样式配置
    const handleClass = 'absolute bg-white border-2 border-editor-accent shadow-sm hover:scale-125 transition-transform';
    const cornerSize = 'w-3 h-3';
    const edgeClass = 'bg-editor-accent/20 hover:bg-editor-accent/40';
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: `${handleClass} ${cornerSize} -top-1.5 -left-1.5 cursor-nw-resize rounded-full`, onPointerDown: (e) => onResizeStart(e, 'nw'), onClick: (e) => e.stopPropagation() }), _jsx("div", { className: `${handleClass} ${cornerSize} -top-1.5 -right-1.5 cursor-ne-resize rounded-full`, onPointerDown: (e) => onResizeStart(e, 'ne'), onClick: (e) => e.stopPropagation() }), _jsx("div", { className: `${handleClass} ${cornerSize} -bottom-1.5 -left-1.5 cursor-sw-resize rounded-full`, onPointerDown: (e) => onResizeStart(e, 'sw'), onClick: (e) => e.stopPropagation() }), _jsx("div", { className: `${handleClass} ${cornerSize} -bottom-1.5 -right-1.5 cursor-se-resize rounded-full`, onPointerDown: (e) => onResizeStart(e, 'se'), onClick: (e) => e.stopPropagation() }), _jsx("div", { className: `${handleClass} ${edgeClass} h-1 top-0 left-2 right-2 cursor-n-resize`, onPointerDown: (e) => onResizeStart(e, 'n'), onClick: (e) => e.stopPropagation() }), _jsx("div", { className: `${handleClass} ${edgeClass} w-1 right-0 top-2 bottom-2 cursor-e-resize`, onPointerDown: (e) => onResizeStart(e, 'e'), onClick: (e) => e.stopPropagation() }), _jsx("div", { className: `${handleClass} ${edgeClass} h-1 bottom-0 left-2 right-2 cursor-s-resize`, onPointerDown: (e) => onResizeStart(e, 's'), onClick: (e) => e.stopPropagation() }), _jsx("div", { className: `${handleClass} ${edgeClass} w-1 left-0 top-2 bottom-2 cursor-w-resize`, onPointerDown: (e) => onResizeStart(e, 'w'), onClick: (e) => e.stopPropagation() })] }));
}
//# sourceMappingURL=ResizeHandles.js.map