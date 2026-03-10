interface SelectionStore {
    selectedId: string | null;
    hoveredId: string | null;
    select(id: string | null): void;
    hover(id: string | null): void;
}
export declare const useSelectionStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SelectionStore>>;
export {};
//# sourceMappingURL=selectionStore.d.ts.map