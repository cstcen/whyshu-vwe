import type { ComponentNode } from '@/types';
interface NodeWrapperProps {
    node: ComponentNode;
    parentId: string;
    indexInParent: number;
}
/** 单个节点包装器：选中高亮 + 画布内拖拽移动 */
declare function NodeWrapper({ node, parentId, indexInParent }: NodeWrapperProps): import("react/jsx-runtime").JSX.Element;
interface ContainerChildrenProps {
    node: ComponentNode;
}
/** 容器节点的子内容渲染（带 DropZone） */
export declare function ContainerChildren({ node }: ContainerChildrenProps): import("react/jsx-runtime").JSX.Element;
export default NodeWrapper;
//# sourceMappingURL=NodeWrapper.d.ts.map