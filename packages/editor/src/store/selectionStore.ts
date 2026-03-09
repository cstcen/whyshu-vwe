import { create } from 'zustand'

interface SelectionStore {
  selectedId: string | null
  hoveredId: string | null
  select(id: string | null): void
  hover(id: string | null): void
}

export const useSelectionStore = create<SelectionStore>((set) => ({
  selectedId: null,
  hoveredId: null,

  select(id) {
    set({ selectedId: id })
  },

  hover(id) {
    set({ hoveredId: id })
  },
}))
