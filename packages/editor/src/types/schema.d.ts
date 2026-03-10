import type { CSSProperties } from 'react';
export interface ResponsiveStyle {
    base?: CSSProperties;
    mobile?: Partial<CSSProperties>;
    tablet?: Partial<CSSProperties>;
    desktop?: Partial<CSSProperties>;
}
export type EventTrigger = 'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onSubmit';
export type EventAction = 'navigate' | 'openModal' | 'closeModal' | 'callAPI' | 'setState' | 'custom';
export interface EventBinding {
    id: string;
    trigger: EventTrigger;
    action: EventAction;
    payload: Record<string, unknown>;
}
export interface ComponentNode {
    id: string;
    type: string;
    props: Record<string, unknown>;
    styles: ResponsiveStyle;
    events: EventBinding[];
    children?: ComponentNode[];
    locked?: boolean;
    hidden?: boolean;
}
export interface PageMeta {
    title: string;
    description?: string;
    keywords?: string[];
    favicon?: string;
}
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';
export declare const BREAKPOINTS: Record<Breakpoint, number>;
export interface PageSchema {
    id: string;
    version: string;
    meta: PageMeta;
    activeBreakpoint: Breakpoint;
    root: ComponentNode;
    cssVars?: Record<string, string>;
}
export type PropControlType = 'input' | 'textarea' | 'number' | 'switch' | 'select' | 'color' | 'slider' | 'image' | 'event' | 'spacing';
export interface PropSchema {
    type: 'string' | 'number' | 'boolean' | 'enum' | 'color' | 'event' | 'image';
    label: string;
    control: PropControlType;
    options?: Array<{
        label: string;
        value: string | number | boolean;
    }>;
    defaultValue?: unknown;
    description?: string;
}
export interface ComponentMeta {
    type: string;
    label: string;
    icon: string;
    category: 'basic' | 'layout' | 'form' | 'media' | 'advanced';
    defaultProps: Record<string, unknown>;
    defaultStyles: ResponsiveStyle;
    propsSchema: Record<string, PropSchema>;
    isContainer?: boolean;
    accepts?: string[];
}
//# sourceMappingURL=schema.d.ts.map