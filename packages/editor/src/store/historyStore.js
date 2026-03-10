import { create } from 'zustand';
import { applyPatches, produceWithPatches, enablePatches } from 'immer';
import { usePageStore } from './pageStore';
enablePatches();
const MAX_HISTORY = 100;
export const useHistoryStore = create((set, get) => ({
    entries: [],
    cursor: -1,
    canUndo: false,
    canRedo: false,
    push(patches, inverses, label) {
        const { entries, cursor } = get();
        // 如果在历史中间操作，丢弃后面的记录
        const newEntries = entries.slice(0, cursor + 1);
        newEntries.push({ patches, inverses, label });
        // 超出上限时裁剪
        if (newEntries.length > MAX_HISTORY)
            newEntries.shift();
        const newCursor = newEntries.length - 1;
        set({
            entries: newEntries,
            cursor: newCursor,
            canUndo: newCursor >= 0,
            canRedo: false,
        });
    },
    undo() {
        const { entries, cursor } = get();
        if (cursor < 0)
            return;
        const { inverses } = entries[cursor];
        const currentPage = usePageStore.getState().page;
        const newPage = applyPatches(currentPage, inverses);
        usePageStore.getState().loadPage(newPage);
        const newCursor = cursor - 1;
        set({ cursor: newCursor, canUndo: newCursor >= 0, canRedo: true });
    },
    redo() {
        const { entries, cursor } = get();
        const nextCursor = cursor + 1;
        if (nextCursor >= entries.length)
            return;
        const { patches } = entries[nextCursor];
        const currentPage = usePageStore.getState().page;
        const newPage = applyPatches(currentPage, patches);
        usePageStore.getState().loadPage(newPage);
        set({
            cursor: nextCursor,
            canUndo: true,
            canRedo: nextCursor < entries.length - 1,
        });
    },
    clear() {
        set({ entries: [], cursor: -1, canUndo: false, canRedo: false });
    },
}));
// 包装 pageStore 操作，自动记录历史
export function withHistory(label, action) {
    return (...args) => {
        const before = usePageStore.getState().page;
        action(...args);
        const after = usePageStore.getState().page;
        const [, patches, inverses] = produceWithPatches(before, () => after);
        if (patches.length > 0) {
            useHistoryStore.getState().push(patches, inverses, label);
        }
    };
}
//# sourceMappingURL=historyStore.js.map