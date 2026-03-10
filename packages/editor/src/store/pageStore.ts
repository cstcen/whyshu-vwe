import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { enableMapSet } from 'immer'
import type { PageSchema, ComponentNode, Breakpoint } from '@/types'
import { nanoid } from '@/utils/nanoid'

enableMapSet()

// 默认空页面 DSL
function createDefaultPage(): PageSchema {
  return {
    id: nanoid(),
    version: '1.0.0',
    meta: { title: '未命名页面' },
    activeBreakpoint: 'desktop',
    root: {
      id: 'root',
      type: 'Root',
      props: {},
      styles: { base: { minHeight: '100vh', position: 'relative' } },
      events: [],
      children: [],
    },
    cssVars: {
      '--primary': '#7c6af5',
      '--bg': '#ffffff',
      '--text': '#1a1a1a',
    },
  }
}

interface PageStore {
  page: PageSchema

  // 节点查找
  findNode(id: string): ComponentNode | null
  findParent(id: string): ComponentNode | null

  // 节点 CRUD
  addNode(node: ComponentNode, parentId: string, index?: number): void
  removeNode(id: string): void
  updateNodeProps(id: string, props: Record<string, unknown>): void
  updateNodeStyles(id: string, styles: ComponentNode['styles']): void
  moveNode(id: string, targetParentId: string, index: number): void

  // 元数据
  setBreakpoint(bp: Breakpoint): void
  updatePageMeta(meta: Partial<PageSchema['meta']>): void
  updateCssVars(vars: Record<string, string>): void

  // 序列化
  loadPage(schema: PageSchema): void
  resetPage(): void
}

// 递归查找节点
function findNodeById(root: ComponentNode, id: string): ComponentNode | null {
  if (root.id === id) return root
  if (!root.children) return null
  for (const child of root.children) {
    const found = findNodeById(child, id)
    if (found) return found
  }
  return null
}

function findParentById(root: ComponentNode, id: string): ComponentNode | null {
  if (!root.children) return null
  for (const child of root.children) {
    if (child.id === id) return root
    const found = findParentById(child, id)
    if (found) return found
  }
  return null
}

export const usePageStore = create<PageStore>()(
  immer((set, get) => ({
    page: createDefaultPage(),

    findNode(id) {
      return findNodeById(get().page.root, id)
    },

    findParent(id) {
      return findParentById(get().page.root, id)
    },

    addNode(node, parentId, index) {
      set((state) => {
        const parent = findNodeById(state.page.root, parentId)
        if (!parent) return
        if (!parent.children) parent.children = []
        const insertAt = index ?? parent.children.length
        parent.children.splice(insertAt, 0, { ...node, id: node.id || nanoid() })
      })
    },

    removeNode(id) {
      set((state) => {
        const parent = findParentById(state.page.root, id)
        if (!parent || !parent.children) return
        parent.children = parent.children.filter((c) => c.id !== id)
      })
    },

    updateNodeProps(id, props) {
      set((state) => {
        const node = findNodeById(state.page.root, id)
        if (!node) return
        node.props = { ...node.props, ...props }
      })
    },

    updateNodeStyles(id, styles) {
      set((state) => {
        const node = findNodeById(state.page.root, id)
        if (!node) return
        node.styles = { ...node.styles, ...styles }
      })
    },

    moveNode(id, targetParentId, index) {
      set((state) => {
        const srcParent = findParentById(state.page.root, id)
        if (!srcParent?.children) return
        const nodeIdx = srcParent.children.findIndex((c) => c.id === id)
        if (nodeIdx === -1) return
        const [node] = srcParent.children.splice(nodeIdx, 1)

        const destParent = findNodeById(state.page.root, targetParentId)
        if (!destParent) return
        if (!destParent.children) destParent.children = []
        destParent.children.splice(index, 0, node)
      })
    },

    setBreakpoint(bp) {
      set((state) => {
        state.page.activeBreakpoint = bp
      })
    },

    updatePageMeta(meta) {
      set((state) => {
        state.page.meta = { ...state.page.meta, ...meta }
      })
    },

    updateCssVars(vars) {
      set((state) => {
        state.page.cssVars = { ...(state.page.cssVars ?? {}), ...vars }
      })
    },

    loadPage(schema) {
      set((state) => {
        state.page = schema
      })
    },

    resetPage() {
      set((state) => {
        state.page = createDefaultPage()
      })
    },
  })),
)
