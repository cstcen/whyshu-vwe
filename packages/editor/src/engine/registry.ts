import type { ComponentMeta } from '@/types'

const registry = new Map<string, ComponentMeta>()

export function registerComponent(meta: ComponentMeta) {
  registry.set(meta.type, meta)
}

export function getComponentMeta(type: string): ComponentMeta | undefined {
  return registry.get(type)
}

export function getAllMetas(): ComponentMeta[] {
  return Array.from(registry.values())
}

export function getMetasByCategory(category: ComponentMeta['category']): ComponentMeta[] {
  return getAllMetas().filter((m) => m.category === category)
}
