import type { PageSchema, ComponentNode, Breakpoint } from '@/types';
interface PageStore {
    page: PageSchema;
    findNode(id: string): ComponentNode | null;
    findParent(id: string): ComponentNode | null;
    addNode(node: ComponentNode, parentId: string, index?: number): void;
    removeNode(id: string): void;
    updateNodeProps(id: string, props: Record<string, unknown>): void;
    updateNodeStyles(id: string, styles: ComponentNode['styles']): void;
    moveNode(id: string, targetParentId: string, index: number): void;
    setBreakpoint(bp: Breakpoint): void;
    updatePageMeta(meta: Partial<PageSchema['meta']>): void;
    updateCssVars(vars: Record<string, string>): void;
    loadPage(schema: PageSchema): void;
    resetPage(): void;
}
export declare const usePageStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<PageStore>, "setState"> & {
    setState(nextStateOrUpdater: PageStore | Partial<PageStore> | ((state: import("immer").WritableDraft<PageStore>) => void), shouldReplace?: false): void;
    setState(nextStateOrUpdater: PageStore | ((state: import("immer").WritableDraft<PageStore>) => void), shouldReplace: true): void;
}>;
export {};
//# sourceMappingURL=pageStore.d.ts.map