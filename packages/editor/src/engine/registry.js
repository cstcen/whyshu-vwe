const registry = new Map();
export function registerComponent(meta) {
    registry.set(meta.type, meta);
}
export function getComponentMeta(type) {
    return registry.get(type);
}
export function getAllMetas() {
    return Array.from(registry.values());
}
export function getMetasByCategory(category) {
    return getAllMetas().filter((m) => m.category === category);
}
//# sourceMappingURL=registry.js.map