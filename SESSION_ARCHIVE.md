# VWE 项目存档 - Session 1

> 存档时间：2026-03-09  
> 下次 session 继续前请先阅读此文档

---

## 一、项目概述

**项目名**: `whyshu-vwe` — Visual Website Editor，可视化拖拽式网站编辑器  
**工作目录**: `E:\Code\whyshu-vwe`  
**包管理器**: pnpm (workspace monorepo)  
**技术栈**: React 18 + TypeScript + Vite + @dnd-kit + Zustand + Immer + Tailwind CSS

---

## 二、已完成工作

### 2.1 目录结构（已全部创建）

```
whyshu-vwe/
├── package.json              ✅ monorepo 根配置，workspaces: packages/*
├── pnpm-workspace.yaml       ✅
├── tsconfig.base.json        ✅ 共享 TS 配置
├── .gitignore                ✅ 已更新
├── SESSION_ARCHIVE.md        ✅ 本文档
│
└── packages/
    ├── editor/               ✅ 编辑器主应用 (@vwe/editor)
    │   ├── package.json
    │   ├── tsconfig.json / tsconfig.node.json
    │   ├── vite.config.ts
    │   ├── tailwind.config.js
    │   ├── postcss.config.js
    │   ├── index.html
    │   └── src/
    │       ├── main.tsx           ✅ 入口
    │       ├── App.tsx            ✅ 根组件
    │       ├── index.css          ✅ Tailwind + 自定义样式
    │       ├── types/
    │       │   ├── schema.ts      ✅ 核心 DSL 类型定义
    │       │   └── index.ts
    │       ├── store/
    │       │   ├── pageStore.ts   ✅ 页面树 CRUD (Zustand + Immer)
    │       │   ├── selectionStore.ts ✅ 选中/hover 节点状态
    │       │   ├── historyStore.ts   ✅ 撤销/重做 (基于 Immer patches)
    │       │   └── index.ts
    │       ├── engine/
    │       │   ├── registry.ts    ✅ 组件元数据注册表
    │       │   ├── builtinComponents.ts ✅ 内置 5 个组件的 Meta 定义
    │       │   └── index.ts
    │       ├── utils/
    │       │   └── nanoid.ts      ✅ 轻量 ID 生成（无额外依赖）
    │       └── components/
    │           ├── EditorLayout.tsx           ✅ 三栏布局壳
    │           ├── Toolbar/
    │           │   └── Toolbar.tsx            ✅ 顶栏：撤销/重做/导入/导出/重置
    │           ├── ComponentLib/
    │           │   └── ComponentLibPanel.tsx  ✅ 左侧组件面板（分类+搜索+可拖拽）
    │           ├── Canvas/
    │           │   ├── Canvas.tsx             ✅ 画布主体（DndContext+断点切换）
    │           │   ├── NodeWrapper.tsx        ✅ 节点包装器（选中/hover/DropZone）
    │           │   └── NodeRenderer.tsx       ✅ DSL 节点 → DOM 渲染
    │           └── Inspector/
    │               └── InspectorPanel.tsx     ✅ 右侧属性/样式编辑面板
    │
    ├── renderer/             ✅ 独立渲染器 (@vwe/renderer)，可单独部署
    │   ├── package.json
    │   ├── tsconfig.json / tsconfig.node.json
    │   ├── vite.config.ts    (lib 模式，external: react)
    │   └── src/
    │       ├── types.ts       ✅ 与 editor 同构的 DSL 类型（独立副本，无 editor 依赖）
    │       ├── PageRenderer.tsx ✅ PageSchema → React 树
    │       └── index.ts       ✅ 公开导出
    │
    └── components/           ✅ 共享组件库骨架 (@vwe/components)
        ├── package.json
        ├── tsconfig.json / tsconfig.node.json
        ├── vite.config.ts
        └── src/
            └── index.ts      ✅ Phase 1 暂只导出类型，后续迁入具体组件
```

### 2.2 内置组件（5个）

| 类型 | 分类 | 说明 |
|------|------|------|
| `Text` | basic | 文本，支持 tag (p/h1-h4/span)、内容 |
| `Button` | basic | 按钮，支持 variant (primary/secondary/danger/ghost)、禁用 |
| `Image` | media | 图片，支持 src/alt/objectFit |
| `Container` | layout | 容器（可嵌套），支持 horizontal/vertical 排列 |
| `Divider` | basic | 分割线 |

### 2.3 核心功能实现状态

| 功能 | 状态 |
|------|------|
| 拖拽：从组件库拖入画布 | ✅ 代码完成，待测试 |
| 拖拽：画布内节点移动 | ✅ 代码完成，待测试 |
| DropZone 插入占位符 | ✅ 代码完成，待测试 |
| 节点选中/悬停高亮 | ✅ 代码完成，待测试 |
| 属性面板动态表单 | ✅ 代码完成，待测试 |
| 样式编辑（基础 CSS） | ✅ 代码完成，待测试 |
| 撤销/重做（Ctrl+Z/Y） | ✅ 代码完成，待测试 |
| 断点切换 (mobile/tablet/desktop) | ✅ 代码完成，待测试 |
| 页面导出 JSON | ✅ 代码完成，待测试 |
| 页面导入 JSON | ✅ 代码完成，待测试 |
| 页面重置 | ✅ 代码完成，待测试 |

---

## 三、当前阻塞问题

### ❌ 依赖未安装

`pnpm install` 失败，退出码为 1。

**可能原因**：
1. `package.json` 中指定了 `"packageManager": "pnpm@9.0.0"`，Corepack 尝试下载该版本时提示确认并可能因网络问题失败
2. 网络环境问题（npm registry 访问受限）

**解决方案（下次 session 优先执行）**：

```powershell
# 方案 A：移除 packageManager 字段限制，用系统已安装的 pnpm
# 先检查系统 pnpm 版本
pnpm --version

# 然后安装（需要先从 package.json 删除 "packageManager" 字段或修改为实际版本）
pnpm install

# 方案 B：如果网络是问题，切换国内镜像
pnpm config set registry https://registry.npmmirror.com
pnpm install

# 方案 C：逐包安装（如果 workspace 有问题）
cd packages/editor
pnpm install
```

**需要修改的地方**：`package.json` 的 `packageManager` 字段改为本机实际版本，或直接删除该字段。

---

## 四、下次 Session 的任务清单

### 优先级 P0（必须先做）
- [ ] **修复 `package.json` 的 `packageManager` 字段**（改为本机 pnpm 实际版本）
- [ ] **执行 `pnpm install`** 安装所有依赖
- [ ] **执行 `pnpm dev`** 验证编辑器能启动

### 优先级 P1（启动后立即处理的 Bug）
- [ ] `NodeRenderer.tsx` 中 `Text` 组件的动态 Tag 有 TS 类型错误（`JSX.IntrinsicElements`），需要将 `Tag` 断言为 `React.ElementType`
- [ ] `historyStore.ts` 的 `withHistory` 实现比较粗糙，`produceWithPatches(before, () => after)` 用法不对，需修正为真正记录操作前后 diff
- [ ] `Canvas.tsx` 中 `handleDragStart` 参数类型应为 `DragStartEvent` 而非 `DragEndEvent`，需修正

### 优先级 P2（功能完善）
- [ ] 画布内节点拖拽移动（目前只实现了从组件库拖入，画布内节点还缺少 `useDraggable` 包装）
- [ ] 节点删除功能（键盘 Delete 键 或 Inspector 面板的删除按钮）
- [ ] 节点层级树面板（显示页面组件树结构，类似 Figma 的 Layers 面板）
- [ ] 画布选中框的精确定位（目前用 CSS outline，后续可用绝对定位的选中框覆盖层）
- [ ] Inspector 面板的间距可视化编辑器（padding/margin 的盒模型图）

### 优先级 P3（Phase 2 内容，下下次）
- [ ] 撤销重做的 historyStore 重构（当前实现有逻辑缺陷）
- [ ] iframe 预览隔离
- [ ] 页面持久化（localStorage 或后端 API）
- [ ] 响应式预览模式

---

## 五、关键设计决策备忘

### DSL 数据流
```
ComponentLibPanel (drag start)
    → DndContext (Canvas.tsx)
    → handleDragEnd → addNode(pageStore)
    → NodeRenderer 重新渲染
```

### 状态管理分层
```
pageStore      — 页面 DSL 树（真相来源）
selectionStore — 当前选中/hover 的节点 ID
historyStore   — 撤销/重做栈（存储 immer patches）
```

### 组件注册表
- `engine/registry.ts` — 全局 Map<type, ComponentMeta>
- `engine/builtinComponents.ts` — 调用 `registerComponent` 注册内置组件
- `EditorLayout.tsx` 顶层调用 `registerBuiltinComponents()` 初始化

### Tailwind 自定义色彩（`tailwind.config.js`）
```js
editor: {
  bg: '#1e1e2e',      // 编辑器背景
  panel: '#2a2a3e',   // 面板背景
  border: '#3a3a5c',  // 边框
  accent: '#7c6af5',  // 强调色（紫色）
  hover: '#3a3a5c',   // 悬停背景
}
```

---

## 六、已知代码问题清单（需修复）

| 文件 | 问题 | 优先级 |
|------|------|--------|
| `Canvas.tsx` | `handleDragStart` 参数类型是 `DragEndEvent` 应为 `DragStartEvent` | P1 |
| `NodeRenderer.tsx` | 动态 Tag 类型：`const Tag = ... as keyof JSX.IntrinsicElements` 需改为 `as React.ElementType` | P1 |
| `historyStore.ts` | `withHistory` 的 `produceWithPatches(before, () => after)` 语意错误，应当在动作执行前后分别拿快照再 diff | P1 |
| `ComponentLibPanel.tsx` | 未使用的 `nanoid` import（32行）需删除 | P2 |
| `NodeWrapper.tsx` | `parentId`、`indexInParent` props 目前未使用（为画布内拖拽预留），导致 lint 警告 | P2 |
| `renderer/PageRenderer.tsx` | `RenderNode` children 的 `key` prop TS 报错（React key 不在 props 类型中），可用 `React.ReactElement` 返回类型代替 `JSX.Element` | P2 |

---

## 七、快速启动命令

```powershell
cd E:\Code\whyshu-vwe

# 1. 检查/修复 packageManager 字段后安装依赖
pnpm install

# 2. 启动编辑器开发服务器 (http://localhost:3000)
pnpm dev

# 3. 单独构建某个包
pnpm --filter @vwe/editor build
pnpm --filter @vwe/renderer build
```
