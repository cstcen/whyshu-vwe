import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { usePageStore } from '@/store';
import { ContainerChildren } from './NodeWrapper';
/** 根据当前断点合并响应式样式 */
function resolveStyles(node, bp) {
    const { base = {}, mobile = {}, tablet = {}, desktop = {} } = node.styles;
    if (bp === 'mobile')
        return { ...base, ...mobile };
    if (bp === 'tablet')
        return { ...base, ...tablet };
    return { ...base, ...desktop };
}
// 表单输入框统一样式
const INPUT_STYLE = {
    width: '100%',
    padding: '7px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    color: 'var(--text, #374151)',
    background: 'var(--bg, #fff)',
    outline: 'none',
};
function runAction(actionSpec) {
    const raw = String(actionSpec ?? '').trim();
    if (!raw)
        return;
    const [action, ...payloadParts] = raw.split(':');
    const payload = payloadParts.join(':').trim();
    switch (action) {
        case 'alert':
            window.alert(payload || '按钮点击事件触发');
            break;
        case 'link':
            if (payload)
                window.open(payload, '_blank', 'noopener,noreferrer');
            break;
        case 'navigate':
            if (payload)
                window.location.href = payload;
            break;
        case 'console':
            console.log(payload || '[VWE] Button clicked');
            break;
        default:
            break;
    }
}
export default function NodeRenderer({ node }) {
    const bp = usePageStore((s) => s.page.activeBreakpoint);
    const style = resolveStyles(node, bp);
    switch (node.type) {
        // ─── 根节点 ───────────────────────────────────────────────────────────────
        case 'Root':
            return (_jsx("div", { style: style, children: _jsx(ContainerChildren, { node: node }) }));
        // ─── 基础组件 ─────────────────────────────────────────────────────────────
        case 'Heading': {
            const Tag = node.props.level ?? 'h2';
            return _jsx(Tag, { style: style, children: String(node.props.content ?? '标题') });
        }
        case 'Text': {
            const Tag = node.props.tag ?? 'p';
            return _jsx(Tag, { style: style, children: String(node.props.content ?? '') });
        }
        case 'Badge':
            return _jsx("span", { style: style, children: String(node.props.text ?? '标签') });
        case 'Link':
            return (_jsx("a", { href: String(node.props.href ?? '#'), target: String(node.props.target ?? '_self'), style: { color: 'var(--primary, #7c6af5)', ...style }, onClick: (e) => e.preventDefault(), children: String(node.props.text ?? '链接') }));
        case 'Spacer':
            return _jsx("div", { style: style });
        case 'Button': {
            const variantStyles = {
                primary: { background: 'var(--primary, #7c6af5)', color: '#fff', border: 'none' },
                secondary: { background: '#e5e7eb', color: 'var(--text, #374151)', border: 'none' },
                danger: { background: '#ef4444', color: '#fff', border: 'none' },
                ghost: { background: 'transparent', border: '1px solid currentColor' },
            };
            const variant = String(node.props.variant ?? 'primary');
            return (_jsx("button", { style: { ...style, ...variantStyles[variant] }, disabled: !!node.props.disabled, onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    runAction(node.props.onClick);
                }, children: String(node.props.text ?? '按钮') }));
        }
        case 'Divider':
            return _jsx("hr", { style: style });
        // ─── 布局组件 ─────────────────────────────────────────────────────────────
        case 'Container': {
            const direction = node.props.direction === 'horizontal' ? 'row' : 'column';
            return (_jsx("div", { style: { ...style, flexDirection: direction }, children: _jsx(ContainerChildren, { node: node }) }));
        }
        case 'Section':
            return (_jsx("section", { style: style, children: _jsx(ContainerChildren, { node: node }) }));
        case 'Card':
            return (_jsx("div", { style: style, children: _jsx(ContainerChildren, { node: node }) }));
        case 'Columns': {
            const cols = String(node.props.columns ?? '3');
            return (_jsx("div", { style: { ...style, gridTemplateColumns: `repeat(${cols}, 1fr)` }, children: _jsx(ContainerChildren, { node: node }) }));
        }
        case 'AbsoluteBox':
            return (_jsx("div", { style: style, children: _jsx(ContainerChildren, { node: node }) }));
        // ─── 表单组件 ─────────────────────────────────────────────────────────────
        case 'InputField': {
            const fieldLabel = String(node.props.label ?? '');
            return (_jsxs("div", { style: style, children: [fieldLabel && (_jsx("label", { style: { fontSize: '13px', fontWeight: '500', color: 'var(--text, #374151)', display: 'block', marginBottom: '4px' }, children: fieldLabel })), _jsx("input", { type: String(node.props.inputType ?? 'text'), placeholder: String(node.props.placeholder ?? ''), style: INPUT_STYLE, readOnly: true })] }));
        }
        case 'TextareaField': {
            const fieldLabel = String(node.props.label ?? '');
            return (_jsxs("div", { style: style, children: [fieldLabel && (_jsx("label", { style: { fontSize: '13px', fontWeight: '500', color: 'var(--text, #374151)', display: 'block', marginBottom: '4px' }, children: fieldLabel })), _jsx("textarea", { placeholder: String(node.props.placeholder ?? ''), rows: Number(node.props.rows ?? 4), style: { ...INPUT_STYLE, resize: 'vertical' }, readOnly: true })] }));
        }
        case 'Checkbox':
            return (_jsxs("label", { style: style, children: [_jsx("input", { type: "checkbox", defaultChecked: !!node.props.checked, style: { width: '16px', height: '16px', accentColor: 'var(--primary, #7c6af5)' }, readOnly: true }), _jsx("span", { children: String(node.props.label ?? '选项') })] }));
        case 'SelectField': {
            const opts = String(node.props.options ?? '').split(',').map((s) => s.trim()).filter(Boolean);
            const fieldLabel = String(node.props.label ?? '');
            return (_jsxs("div", { style: style, children: [fieldLabel && (_jsx("label", { style: { fontSize: '13px', fontWeight: '500', color: 'var(--text, #374151)', display: 'block', marginBottom: '4px' }, children: fieldLabel })), _jsxs("select", { style: INPUT_STYLE, children: [!!node.props.placeholder && _jsx("option", { value: "", children: String(node.props.placeholder ?? '') }), opts.map((opt) => _jsx("option", { value: opt, children: opt }, opt))] })] }));
        }
        // ─── 媒体组件 ─────────────────────────────────────────────────────────────
        case 'Image':
            return (_jsx("img", { src: String(node.props.src ?? ''), alt: String(node.props.alt ?? ''), style: { ...style, objectFit: node.props.objectFit } }));
        case 'Video': {
            const src = String(node.props.src ?? '');
            return src ? (_jsx("video", { src: src, poster: String(node.props.poster ?? ''), style: style, controls: true })) : (_jsxs("div", { style: { ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '14px', gap: '8px' }, children: ["\uD83C\uDFAC ", _jsx("span", { children: "\u89C6\u9891\u5360\u4F4D\uFF08\u586B\u5199\u89C6\u9891\u5730\u5740\u540E\u663E\u793A\uFF09" })] }));
        }
        // ─── 导航布局组件 ─────────────────────────────────────────────────────────
        case 'Header':
            return (_jsx("header", { style: style, children: _jsx(ContainerChildren, { node: node }) }));
        case 'Nav': {
            const orientation = node.props.orientation ?? 'horizontal';
            const navStyle = {
                ...style,
                flexDirection: orientation === 'vertical' ? 'column' : 'row',
            };
            return (_jsx("nav", { style: navStyle, children: _jsx(ContainerChildren, { node: node }) }));
        }
        case 'MenuItem':
            return (_jsx("a", { href: String(node.props.href ?? '#'), onClick: (e) => {
                    e.preventDefault();
                    runAction(node.props.onClick);
                }, style: style, children: String(node.props.text ?? '菜单项') }));
        case 'Dropdown': {
            const label = String(node.props.label ?? '菜单');
            const trigger = String(node.props.trigger ?? 'click');
            const [isOpen, setIsOpen] = useState(false);
            return (_jsxs("div", { style: { ...style, position: 'relative' }, children: [_jsxs("button", { onClick: () => trigger === 'click' && setIsOpen(!isOpen), onMouseEnter: () => trigger === 'hover' && setIsOpen(true), onMouseLeave: () => trigger === 'hover' && setIsOpen(false), style: {
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: 'var(--text)',
                        }, children: [label, _jsx("span", { style: { transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }, children: "\u25BC" })] }), isOpen && (_jsx("div", { style: {
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            zIndex: 1000,
                            minWidth: '160px',
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            marginTop: '4px',
                        }, onMouseLeave: () => trigger === 'hover' && setIsOpen(false), children: _jsx(ContainerChildren, { node: node }) }))] }));
        }
        case 'Carousel': {
            const autoPlay = node.props.autoPlay !== false;
            const interval = Number(node.props.interval ?? 3000);
            const showDots = node.props.showDots !== false;
            const showArrows = node.props.showArrows !== false;
            const duration = Number(node.props.duration ?? 500);
            const [currentIndex, setCurrentIndex] = useState(0);
            const children = node.children ?? [];
            useEffect(() => {
                if (!autoPlay || children.length <= 1)
                    return;
                const timer = setInterval(() => {
                    setCurrentIndex((prev) => (prev + 1) % children.length);
                }, interval);
                return () => clearInterval(timer);
            }, [autoPlay, interval, children.length]);
            const nextSlide = () => {
                setCurrentIndex((prev) => (prev + 1) % children.length);
            };
            const prevSlide = () => {
                setCurrentIndex((prev) => (prev - 1 + children.length) % children.length);
            };
            return (_jsxs("div", { style: style, children: [_jsx("div", { style: {
                            display: 'flex',
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                        }, children: children.map((child, idx) => (_jsx("div", { style: {
                                ...resolveStyles(child, bp),
                                position: 'absolute',
                                left: `${(idx - currentIndex) * 100}%`,
                                transition: `left ${duration}ms ease-in-out`,
                                width: '100%',
                                height: '100%',
                            }, children: _jsx(NodeRenderer, { node: child }) }, child.id))) }), showArrows && children.length > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: prevSlide, style: {
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 100,
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255,255,255,0.5)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    color: '#000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background-color 0.2s',
                                }, onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)'), onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)'), children: "\u2039" }), _jsx("button", { onClick: nextSlide, style: {
                                    position: 'absolute',
                                    right: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 100,
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255,255,255,0.5)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    color: '#000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background-color 0.2s',
                                }, onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)'), onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)'), children: "\u203A" })] })), showDots && children.length > 1 && (_jsx("div", { style: {
                            position: 'absolute',
                            bottom: '16px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 100,
                            display: 'flex',
                            gap: '8px',
                        }, children: children.map((_, idx) => (_jsx("button", { onClick: () => setCurrentIndex(idx), style: {
                                width: idx === currentIndex ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                backgroundColor: idx === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                            } }, idx))) }))] }));
        }
        case 'CarouselItem':
            return (_jsx("div", { style: { ...style, width: '100%', height: '100%' }, children: _jsx(ContainerChildren, { node: node }) }));
        case 'FloatingButton': {
            const position = String(node.props.position ?? 'bottom-right');
            const icon = String(node.props.icon ?? '●');
            const text = String(node.props.text ?? '按钮');
            const size = String(node.props.size ?? 'lg');
            const sizeMap = { sm: '40px', md: '48px', lg: '56px' };
            const dimension = sizeMap[size] ?? '56px';
            const positionStyles = {
                'bottom-right': { bottom: '24px', right: '24px' },
                'bottom-left': { bottom: '24px', left: '24px' },
                'top-right': { top: '24px', right: '24px' },
                'top-left': { top: '24px', left: '24px' },
            };
            return (_jsx("button", { style: {
                    ...style,
                    width: dimension,
                    height: dimension,
                    ...positionStyles[position],
                }, onClick: (e) => {
                    e.preventDefault();
                    runAction(node.props.onClick);
                }, title: text, children: icon }));
        }
        case 'Footer':
            return (_jsx("footer", { style: style, children: _jsx(ContainerChildren, { node: node }) }));
        case 'Hero':
            return (_jsx("section", { style: style, children: _jsx(ContainerChildren, { node: node }) }));
        case 'Grid': {
            const columns = node.props.columns ?? '3';
            const gap = String(node.props.gap ?? '16px');
            const gridStyle = {
                ...style,
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap,
            };
            return (_jsx("div", { style: gridStyle, children: _jsx(ContainerChildren, { node: node }) }));
        }
        case 'Flex': {
            const direction = node.props.direction ?? 'row';
            const justify = node.props.justify ?? 'flex-start';
            const align = node.props.align ?? 'flex-start';
            const gap = String(node.props.gap ?? '8px');
            const flexStyle = {
                ...style,
                flexDirection: direction,
                justifyContent: justify,
                alignItems: align,
                gap,
            };
            return (_jsx("div", { style: flexStyle, children: _jsx(ContainerChildren, { node: node }) }));
        }
        case 'Alert': {
            const variant = String(node.props.variant ?? 'info');
            const title = String(node.props.title ?? '提示');
            const colors = {
                info: { bg: 'color-mix(in srgb, var(--primary, #7c6af5) 14%, white)', border: 'var(--primary, #7c6af5)', text: 'var(--primary, #7c6af5)', icon: 'ℹ' },
                success: { bg: '#dcfce7', border: '#22c55e', text: '#14532d', icon: '✓' },
                warning: { bg: '#fef3c7', border: '#f59e0b', text: '#78350f', icon: '⚠' },
                error: { bg: '#fee2e2', border: '#ef4444', text: '#7f1d1d', icon: '✕' },
            };
            const color = colors[variant] ?? colors.info;
            const alertStyle = {
                ...style,
                backgroundColor: color.bg,
                borderColor: color.border,
                color: color.text,
            };
            return (_jsxs("div", { style: alertStyle, children: [_jsx("span", { style: { fontSize: '20px', fontWeight: 'bold' }, children: color.icon }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { fontWeight: 'bold', marginBottom: '4px' }, children: title }), _jsx(ContainerChildren, { node: node })] })] }));
        }
        case 'Avatar': {
            const src = String(node.props.src ?? '');
            const alt = String(node.props.alt ?? 'Avatar');
            const fallback = String(node.props.fallback ?? 'U');
            const size = String(node.props.size ?? 'md');
            const sizes = { sm: '32px', md: '40px', lg: '56px', xl: '80px' };
            const dimension = sizes[size] ?? sizes.md;
            const avatarStyle = {
                ...style,
                width: dimension,
                height: dimension,
            };
            return src ? (_jsx("img", { src: src, alt: alt, style: avatarStyle })) : (_jsx("div", { style: {
                    ...avatarStyle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#9ca3af',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: size === 'sm' ? '14px' : size === 'lg' ? '24px' : size === 'xl' ? '32px' : '16px',
                }, children: fallback }));
        }
        case 'Tabs': {
            const tabsStr = String(node.props.tabs ?? 'Tab 1,Tab 2,Tab 3');
            const activeIndex = Number(node.props.activeIndex ?? 0);
            const tabList = tabsStr.split(',').map(t => t.trim());
            return (_jsxs("div", { style: style, children: [_jsx("div", { style: { display: 'flex', borderBottom: '2px solid #e5e7eb', gap: '4px' }, children: tabList.map((tab, idx) => (_jsx("div", { style: {
                                padding: '8px 16px',
                                cursor: 'pointer',
                                borderBottom: idx === activeIndex ? '2px solid var(--primary, #7c6af5)' : 'none',
                                color: idx === activeIndex ? 'var(--primary, #7c6af5)' : '#6b7280',
                                fontWeight: idx === activeIndex ? 'bold' : 'normal',
                                marginBottom: '-2px',
                            }, children: tab }, idx))) }), _jsx("div", { style: { padding: '16px 0' }, children: _jsx(ContainerChildren, { node: node }) })] }));
        }
        // ─── 未知组件 ─────────────────────────────────────────────────────────────
        default:
            return (_jsxs("div", { style: { ...style, border: '1px dashed #ef4444', padding: '8px', color: '#ef4444', fontSize: 12 }, children: ["\u672A\u77E5\u7EC4\u4EF6: ", node.type] }));
    }
}
//# sourceMappingURL=NodeRenderer.js.map