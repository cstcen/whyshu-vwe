import { create } from 'zustand';
export const useSelectionStore = create((set) => ({
    selectedId: null,
    hoveredId: null,
    select(id) {
        set({ selectedId: id });
    },
    hover(id) {
        set({ hoveredId: id });
    },
}));
//# sourceMappingURL=selectionStore.js.map