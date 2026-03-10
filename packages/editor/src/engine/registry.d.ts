import type { ComponentMeta } from '@/types';
export declare function registerComponent(meta: ComponentMeta): void;
export declare function getComponentMeta(type: string): ComponentMeta | undefined;
export declare function getAllMetas(): ComponentMeta[];
export declare function getMetasByCategory(category: ComponentMeta['category']): ComponentMeta[];
//# sourceMappingURL=registry.d.ts.map