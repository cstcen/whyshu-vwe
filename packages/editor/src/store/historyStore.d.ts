import { type Patch } from 'immer';
interface HistoryEntry {
    patches: Patch[];
    inverses: Patch[];
    label: string;
}
interface HistoryStore {
    entries: HistoryEntry[];
    cursor: number;
    canUndo: boolean;
    canRedo: boolean;
    push(patches: Patch[], inverses: Patch[], label: string): void;
    undo(): void;
    redo(): void;
    clear(): void;
}
export declare const useHistoryStore: import("zustand").UseBoundStore<import("zustand").StoreApi<HistoryStore>>;
export declare function withHistory<T extends unknown[]>(label: string, action: (...args: T) => void): (...args: T) => void;
export {};
//# sourceMappingURL=historyStore.d.ts.map