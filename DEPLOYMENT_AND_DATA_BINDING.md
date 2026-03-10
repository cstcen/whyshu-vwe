# VWE 部署方案与动态数据绑定指南

> 本文档记录了 Visual Web Editor (VWE) 与 uni-app/uniCloud 项目集成的技术方案

---

## 一、技术栈对接方案

### 背景
- **官网项目**：lktop.cn，基于 uni-app (Vue) 开发
- **数据层**：uniCloud 云函数
- **编辑器**：VWE，基于 React 开发
- **目标**：用编辑器生成页面，保持原有数据获取方式

### 核心问题
**PageRenderer 是 React 实现，uni-app 是 Vue 技术栈** — 存在技术栈不匹配

---

## 二、集成方案对比

### 方案 A：开发 Vue 版 PageRenderer（中长期推荐）

**实施步骤**：
1. 新增包 `packages/renderer-vue/`
2. 用 Vue 3 重写 PageRenderer 渲染逻辑
3. 保持与 React 版相同的 API

**在 uni-app 中使用**：
```vue
<template>
  <PageRenderer :schema="pageSchema" :data="productData" />
</template>

<script>
import { PageRenderer } from '@vwe/renderer-vue'
import { getProductDetail } from '@/api'

export default {
  data() {
    return {
      pageSchema: require('@/schemas/product-detail.json'),
      productData: null
    }
  },
  async onLoad(options) {
    // 从 uniCloud 获取动态数据
    this.productData = await getProductDetail(options.id)
  }
}
</script>
```

**优势**：
- 编辑器改动最小（继续用 React）
- uni-app 无缝集成
- 一次开发，所有页面复用

**工作量**：约 100-200 行代码（1-2 周）

---

### 方案 B：JSON → Vue 模板代码生成器

**实施方式**：
编写转换脚本 `scripts/schema-to-vue.js`：
```javascript
function convertSchemaToVue(schema) {
  // 遍历 ComponentNode 树
  // 生成 <template> 代码
  // 数据绑定 {{product.name}} → {{ data.product.name }}
}
```

**使用流程**：
```bash
# 从编辑器导出 JSON
node scripts/schema-to-vue.js product-detail.json > pages/product/detail.vue
```

**优势**：
- 生成静态 Vue 组件，无运行时开销
- 可手动微调生成代码

**劣势**：
- 每次编辑都要重新生成
- 维护两份代码（JSON + Vue）

---

### 方案 C：纯静态 SPA 部署（短期推荐）⭐

**架构图**：
```
┌─────────────┐
│  VWE 编辑器  │ → 导出 page-schema.json
└─────────────┘
       ↓
┌─────────────────────────────────┐
│  构建脚本                        │
│  1. 打包 PageRenderer (React)    │
│  2. 复制 page-schema.json       │
│  3. 生成 index.html 入口         │
└─────────────────────────────────┘
       ↓
┌─────────────────────────────────┐
│  uniCloud 前端网页托管 / CDN     │
│  ├── index.html                 │
│  ├── page-schema.json           │
│  └── assets/renderer.js         │
└─────────────────────────────────┘
       ↓ (运行时)
┌─────────────────────────────────┐
│  用户访问                        │
│  → 加载 schema                  │
│  → 调用 uniCloud 云函数获取数据  │
│  → PageRenderer 动态渲染         │
└─────────────────────────────────┘
```

**部署产物结构**：
```
dist/
├── index.html           # 入口页面
├── page-schema.json     # 从编辑器导出的页面结构
├── assets/
│   ├── renderer.js      # PageRenderer + React 运行时
│   └── styles.css       # 样式文件
└── unicloud-config.js   # uniCloud 配置（可选）
```

**index.html 示例**：
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>产品详情</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://web-ext-storage.dcloud.net.cn/uni-app/uniCloud.js"></script>
</head>
<body>
  <div id="root"></div>
  <script>
    // 初始化 uniCloud
    const uniCloud = new window.uniCloud.Unicloud({
      spaceId: 'your-space-id',
      clientSecret: 'your-client-secret'
    })
    
    // 获取 URL 参数
    function getUrlParam(name) {
      const params = new URLSearchParams(window.location.search)
      return params.get(name)
    }
    
    // 加载页面配置并渲染
    fetch('/page-schema.json')
      .then(res => res.json())
      .then(schema => {
        // 调用云函数获取动态数据
        return uniCloud.callFunction({
          name: 'getProductDetail',
          data: { id: getUrlParam('id') }
        }).then(({ result }) => {
          // 渲染页面
          const root = ReactDOM.createRoot(document.getElementById('root'))
          root.render(
            React.createElement(PageRenderer, {
              schema: schema,
              data: result
            })
          )
        })
      })
      .catch(err => {
        console.error('加载失败:', err)
        document.getElementById('root').innerHTML = 
          '<div style="padding:20px">页面加载失败</div>'
      })
  </script>
  <script src="/assets/renderer.js"></script>
</body>
</html>
```

**部署命令**：
```bash
# 1. 构建静态文件
pnpm build:static

# 2. 上传到 uniCloud 前端网页托管
# 或上传到任意 CDN（阿里云 OSS、腾讯云 COS 等）
```

**核心优势**：
- ✅ 与原 uni-app 部署方式完全一致（静态 CDN）
- ✅ 页面结构修改只需替换 `page-schema.json`，无需重新构建代码
- ✅ 保持原有 uniCloud 数据层不变
- ✅ 部署流程零学习成本

---

### 方案 D：Serverless SSR（可选，SEO 场景）

**适用场景**：需要 SEO 优化的页面（产品详情页、文章页等）

**实现方式**：
```javascript
// uniCloud/cloudfunctions/render-page/index.js
const { renderToString } = require('react-dom/server')
const { PageRenderer } = require('@vwe/renderer')

exports.main = async (event) => {
  // 读取页面配置
  const schema = await db.collection('page-schemas')
    .doc(event.pageId).get()
  
  // 获取动态数据
  const data = await getProductData(event.productId)
  
  // 服务端渲染
  const html = renderToString(
    React.createElement(PageRenderer, { schema, data })
  )
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `<!DOCTYPE html><html><body>${html}</body></html>`
  }
}
```

**部署**：云函数 + URL 化 + CDN 加速

---

## 三、部署方案对比表

| 项目 | uni-app 原方案 | VWE 方案 C（推荐） |
|------|---------------|-------------------|
| 构建产物 | Vue SPA | React SPA + JSON Schema |
| 部署方式 | 静态 CDN | 静态 CDN（**相同**） |
| 数据获取 | uniCloud 云函数 | uniCloud 云函数（**相同**） |
| 更新成本 | 重新构建 + 部署 | **只更新 JSON，无需重新构建** ⭐ |
| SEO 支持 | 需要预渲染 | 可选 SSR（方案 D） |
| 技术栈 | Vue | React |

---

## 四、动态数据绑定方案

### 问题场景
产品详情页中的动态内容包含循环数据，例如：
- 轮播组件中的图片数组
- 产品规格列表
- 用户评论列表

### 解决方案 1：数据循环配置（推荐）⭐

**Schema 结构**：
```json
{
  "type": "Carousel",
  "dataLoop": {
    "source": "product.images",     // 数据路径
    "itemVar": "image"              // 循环变量名
  },
  "children": [
    {
      "type": "CarouselItem",
      "isTemplate": true,           // 标记为模板节点
      "children": [
        {
          "type": "Image",
          "props": {
            "src": "{{image.url}}",         // 使用循环变量
            "alt": "{{image.description}}"
          }
        }
      ]
    }
  ]
}
```

**PageRenderer 渲染逻辑**：
```javascript
function RenderNode({ node, data }) {
  // 检测是否有数据循环配置
  if (node.dataLoop) {
    const items = getNestedValue(data, node.dataLoop.source) 
    // 结果: [{url: '...', description: '...'}, ...]
    
    const template = node.children.find(c => c.isTemplate)
    
    return items.map((item, index) => {
      // 创建循环作用域数据
      const loopData = { 
        ...data, 
        [node.dataLoop.itemVar]: item 
      }
      return (
        <RenderNode 
          key={index} 
          node={template} 
          data={loopData} 
        />
      )
    })
  }
  
  // 普通节点渲染...
  const style = resolveStyles(node, bp)
  const props = resolveProps(node.props, data) // 解析 {{}} 绑定
  
  switch (node.type) {
    case 'Image':
      return <img src={props.src} alt={props.alt} style={style} />
    // ...
  }
}

// 工具函数：获取嵌套对象值
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

// 工具函数：解析数据绑定
function resolveProps(props, data) {
  const resolved = {}
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'string' && value.includes('{{')) {
      // 替换 {{product.name}} 为实际值
      resolved[key] = value.replace(/\{\{(.+?)\}\}/g, (_, path) => {
        return getNestedValue(data, path.trim())
      })
    } else {
      resolved[key] = value
    }
  }
  return resolved
}
```

**编辑器配置界面**（属性面板）：
```
┌─────────────────────────────┐
│ Carousel 组件属性            │
├─────────────────────────────┤
│ 基础设置                     │
│ ☑ 自动播放                   │
│ 切换间隔: 3000ms             │
│                              │
│ 数据循环 ▼                   │
│ ☑ 启用数据循环               │
│ 数据源路径: product.images   │
│ 循环变量名: image            │
│                              │
│ [提示] 子节点中可用 {{image.url}} │
└─────────────────────────────┘
```

---

### 解决方案 2：repeat 指令（灵活性最高）

**Schema 结构**：
```json
{
  "type": "Container",
  "repeat": {
    "data": "{{product.reviews}}",
    "var": "review",
    "key": "review.id"           // 用于 React key
  },
  "children": [
    {
      "type": "Card",
      "children": [
        {
          "type": "Heading",
          "props": { "content": "{{review.title}}" }
        },
        {
          "type": "Text",
          "props": { "content": "{{review.content}}" }
        },
        {
          "type": "Badge",
          "props": { "text": "{{review.rating}}星" }
        }
      ]
    }
  ]
}
```

**渲染实现**：
```javascript
function RenderNode({ node, data }) {
  // 处理 repeat 指令
  if (node.repeat) {
    let items = node.repeat.data
    
    // 解析绑定表达式
    if (typeof items === 'string' && items.startsWith('{{')) {
      const path = items.slice(2, -2).trim()
      items = getNestedValue(data, path)
    }
    
    const varName = node.repeat.var
    
    return items.map((item, idx) => {
      const scopedData = { ...data, [varName]: item }
      const key = node.repeat.key 
        ? resolveBinding(node.repeat.key, scopedData) 
        : idx
      
      return (
        <div key={key}>
          {node.children.map(child => (
            <RenderNode 
              key={child.id} 
              node={child} 
              data={scopedData} 
            />
          ))}
        </div>
      )
    })
  }
  
  // 普通渲染...
}
```

---

### 实际应用示例

**完整产品详情页配置**：
```json
{
  "id": "product-detail-page",
  "version": "1.0.0",
  "meta": {
    "title": "产品详情",
    "description": "商品详细信息页"
  },
  "root": {
    "id": "root",
    "type": "Root",
    "children": [
      {
        "id": "carousel-1",
        "type": "Carousel",
        "dataLoop": {
          "source": "product.images",
          "itemVar": "img"
        },
        "props": {
          "autoPlay": true,
          "interval": 3000
        },
        "children": [
          {
            "id": "carousel-item-template",
            "type": "CarouselItem",
            "isTemplate": true,
            "children": [
              {
                "id": "img-template",
                "type": "Image",
                "props": {
                  "src": "{{img.url}}",
                  "alt": "{{img.title}}"
                },
                "styles": {
                  "base": {
                    "width": "100%",
                    "height": "400px",
                    "objectFit": "cover"
                  }
                }
              }
            ]
          }
        ]
      },
      {
        "id": "product-info",
        "type": "Section",
        "children": [
          {
            "id": "product-name",
            "type": "Heading",
            "props": {
              "content": "{{product.name}}",
              "level": "h1"
            }
          },
          {
            "id": "product-price",
            "type": "Text",
            "props": {
              "content": "¥{{product.price}}"
            },
            "styles": {
              "base": {
                "fontSize": "32px",
                "color": "#e74c3c",
                "fontWeight": "700"
              }
            }
          },
          {
            "id": "specs-container",
            "type": "Container",
            "repeat": {
              "data": "{{product.specs}}",
              "var": "spec"
            },
            "children": [
              {
                "id": "spec-item",
                "type": "Flex",
                "props": {
                  "justify": "space-between"
                },
                "children": [
                  {
                    "id": "spec-name",
                    "type": "Text",
                    "props": {
                      "content": "{{spec.name}}"
                    }
                  },
                  {
                    "id": "spec-value",
                    "type": "Text",
                    "props": {
                      "content": "{{spec.value}}"
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "cssVars": {
    "--primary": "#3498db",
    "--bg": "#ffffff",
    "--text": "#2c3e50"
  }
}
```

**对应的动态数据**：
```javascript
// uniCloud 云函数返回的数据格式
const productData = {
  product: {
    id: 123,
    name: "高端笔记本电脑",
    price: 8999,
    images: [
      { url: "https://cdn.lktop.cn/product/1.jpg", title: "正面图" },
      { url: "https://cdn.lktop.cn/product/2.jpg", title: "侧面图" },
      { url: "https://cdn.lktop.cn/product/3.jpg", title: "细节图" }
    ],
    specs: [
      { name: "处理器", value: "Intel Core i7-12700H" },
      { name: "内存", value: "16GB DDR5" },
      { name: "硬盘", value: "512GB NVMe SSD" },
      { name: "显卡", value: "NVIDIA RTX 3060" },
      { name: "屏幕", value: "15.6英寸 2K 165Hz" }
    ]
  }
}
```

---

## 五、Schema 类型扩展

**当前类型定义** (`packages/editor/src/types/schema.ts`)：
```typescript
export interface ComponentNode {
  id: string
  type: string
  props: Record<string, unknown>
  styles: ResponsiveStyle
  events: EventBinding[]
  children?: ComponentNode[]
  locked?: boolean
  hidden?: boolean
}
```

**扩展后的类型**：
```typescript
export interface DataLoopConfig {
  source: string      // 数据源路径，如 "product.images"
  itemVar: string     // 循环变量名，如 "image"
}

export interface RepeatConfig {
  data: string        // 数据绑定表达式，如 "{{product.reviews}}"
  var: string         // 循环变量名
  key?: string        // React key 绑定表达式（可选）
}

export interface ComponentNode {
  id: string
  type: string
  props: Record<string, unknown>
  styles: ResponsiveStyle
  events: EventBinding[]
  children?: ComponentNode[]
  
  // ===== 新增字段 =====
  dataLoop?: DataLoopConfig    // 数据循环配置
  repeat?: RepeatConfig        // repeat 指令配置
  isTemplate?: boolean         // 标记为模板节点
  // ===================
  
  locked?: boolean
  hidden?: boolean
}
```

---

## 六、实施路线图

### Phase 1：静态部署方案（1-2 天）
- [ ] 创建 `packages/static-deploy/` 目录
- [ ] 编写构建脚本 `build-static.js`
- [ ] 创建 `index.html` 模板（集成 uniCloud SDK）
- [ ] 测试部署到 uniCloud 前端网页托管
- [ ] 文档：部署流程说明

### Phase 2：数据绑定基础（2-3 天）
- [ ] 扩展 `ComponentNode` 类型定义（增加 `dataLoop` 字段）
- [ ] 实现 `resolveBinding()` 工具函数
- [ ] 在 PageRenderer 中实现数据循环渲染
- [ ] 添加单元测试
- [ ] 在预览页测试数据绑定

### Phase 3：编辑器配置界面（3-5 天）
- [ ] 在属性面板增加"数据循环"配置项
- [ ] 支持可视化配置 `dataLoop.source` 和 `itemVar`
- [ ] 模板节点标记与高亮显示
- [ ] 添加数据预览功能（mock 数据）
- [ ] 编辑器内实时预览循环渲染效果

### Phase 4：Vue 版 PageRenderer（可选，1-2 周）
- [ ] 创建 `packages/renderer-vue/` 包
- [ ] 用 Vue 3 Composition API 重写渲染逻辑
- [ ] 保持与 React 版相同的 API
- [ ] 添加 uni-app 集成示例
- [ ] 性能优化与测试

---

## 七、核心代码片段

### 数据绑定工具函数
```javascript
/**
 * 解析对象嵌套路径值
 * @example getNestedValue({a: {b: {c: 1}}}, 'a.b.c') // 1
 */
export function getNestedValue(obj, path) {
  if (!path) return obj
  return path.split('.').reduce((acc, key) => {
    if (acc === null || acc === undefined) return undefined
    return acc[key]
  }, obj)
}

/**
 * 解析模板字符串中的绑定表达式
 * @example resolveBinding('Hello {{user.name}}!', {user: {name: 'Alice'}})
 *          // 'Hello Alice!'
 */
export function resolveBinding(template, data) {
  if (typeof template !== 'string') return template
  
  return template.replace(/\{\{(.+?)\}\}/g, (match, path) => {
    const value = getNestedValue(data, path.trim())
    return value !== undefined ? String(value) : match
  })
}

/**
 * 批量解析 props 中的所有绑定
 */
export function resolveProps(props, data) {
  const resolved = {}
  for (const [key, value] of Object.entries(props)) {
    resolved[key] = resolveBinding(value, data)
  }
  return resolved
}
```

### PageRenderer 核心渲染逻辑
```javascript
function RenderNode({ node, data, bp }) {
  // 1. 处理数据循环
  if (node.dataLoop) {
    const items = getNestedValue(data, node.dataLoop.source) || []
    const template = node.children?.find(c => c.isTemplate)
    
    if (!template) {
      console.warn(`DataLoop node ${node.id} has no template child`)
      return null
    }
    
    return items.map((item, index) => {
      const loopData = { 
        ...data, 
        [node.dataLoop.itemVar]: item,
        $index: index,
        $length: items.length
      }
      return (
        <RenderNode 
          key={index} 
          node={template} 
          data={loopData} 
          bp={bp}
        />
      )
    })
  }
  
  // 2. 处理 repeat 指令
  if (node.repeat) {
    let items = resolveBinding(node.repeat.data, data)
    if (!Array.isArray(items)) {
      console.warn(`Repeat data is not an array:`, items)
      items = []
    }
    
    return items.map((item, idx) => {
      const scopedData = { 
        ...data, 
        [node.repeat.var]: item,
        $index: idx
      }
      const key = node.repeat.key 
        ? resolveBinding(node.repeat.key, scopedData) 
        : idx
      
      return (
        <div key={key}>
          {node.children?.map(child => (
            <RenderNode 
              key={child.id} 
              node={child} 
              data={scopedData}
              bp={bp}
            />
          ))}
        </div>
      )
    })
  }
  
  // 3. 普通节点渲染
  const style = resolveStyles(node, bp)
  const props = resolveProps(node.props, data)
  
  // 根据 node.type 渲染对应组件...
  switch (node.type) {
    case 'Text':
      return <p style={style}>{props.content}</p>
    case 'Image':
      return <img src={props.src} alt={props.alt} style={style} />
    // ...其他组件
    default:
      return (
        <div style={style}>
          {node.children?.map(child => (
            <RenderNode 
              key={child.id} 
              node={child} 
              data={data}
              bp={bp}
            />
          ))}
        </div>
      )
  }
}
```

---

## 八、常见问题 FAQ

### Q1: 编辑器如何预览循环数据效果？
**A**: 在编辑器中提供 Mock 数据功能：
```javascript
// 编辑器预览时注入测试数据
const mockData = {
  product: {
    images: [
      { url: 'https://via.placeholder.com/400x300/1', title: 'Image 1' },
      { url: 'https://via.placeholder.com/400x300/2', title: 'Image 2' },
      { url: 'https://via.placeholder.com/400x300/3', title: 'Image 3' }
    ]
  }
}

<PageRenderer schema={editorSchema} data={mockData} />
```

### Q2: 如何处理嵌套循环？
**A**: 支持多层 `dataLoop` 嵌套：
```json
{
  "type": "Container",
  "dataLoop": {
    "source": "categories",
    "itemVar": "category"
  },
  "children": [
    {
      "type": "Section",
      "isTemplate": true,
      "children": [
        {
          "type": "Heading",
          "props": { "content": "{{category.name}}" }
        },
        {
          "type": "Grid",
          "dataLoop": {
            "source": "category.products",
            "itemVar": "product"
          },
          "children": [
            {
              "type": "Card",
              "isTemplate": true,
              "props": {
                "title": "{{product.name}}"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Q3: 如何在循环中访问索引？
**A**: 渲染器自动注入 `$index` 和 `$length` 变量：
```json
{
  "type": "Text",
  "props": {
    "content": "第 {{$index + 1}} / {{$length}} 张"
  }
}
```

### Q4: 部署后如何更新页面？
**A**: 
- **只修改样式/布局**：替换 CDN 上的 `page-schema.json`，无需重新构建
- **修改组件逻辑**：需要重新构建 `renderer.js` 并上传
- **修改数据结构**：只需修改云函数，前端无需改动

---

## 九、参考资源

### 项目内部文档
- [组件元数据定义](./packages/editor/src/engine/builtinComponents.ts)
- [PageSchema 类型定义](./packages/editor/src/types/schema.ts)
- [PageRenderer 实现](./packages/renderer/src/PageRenderer.tsx)

### 外部文档
- [uniCloud 前端网页托管](https://uniapp.dcloud.net.cn/uniCloud/hosting.html)
- [uniCloud 云函数](https://uniapp.dcloud.net.cn/uniCloud/cf-functions.html)
- [React 服务端渲染](https://react.dev/reference/react-dom/server)

---

## 十、总结

### 推荐技术方案组合

**短期（1 个月内）**：
- ✅ 方案 C：纯静态 SPA 部署
- ✅ 数据绑定方案 1：dataLoop 配置

**中期（1-3 个月）**：
- ✅ 开发 Vue 版 PageRenderer（方案 A）
- ✅ 完善编辑器数据循环配置界面

**长期（可选）**：
- 🔄 Serverless SSR（SEO 场景）
- 🔄 代码生成器（性能极致优化）

### 核心优势
1. **零部署成本**：与现有 uni-app 方式完全一致
2. **快速迭代**：修改页面只需替换 JSON 文件
3. **数据复用**：保持原有 uniCloud 数据层不变
4. **技术独立**：编辑器与业务项目技术栈解耦

---

**文档版本**: v1.0  
**更新日期**: 2026-03-10  
**维护者**: VWE Team
