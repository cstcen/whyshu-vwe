import React, { useState } from 'react'
import { PageRenderer } from '../../../renderer/src/PageRenderer'

const sampleSchema = {
  id: 'demo-page',
  version: '1.0',
  meta: { title: 'Demo Page' },
  activeBreakpoint: 'desktop',
  cssVars: { '--primary': '#7c6af5', '--bg': '#ffffff', '--text': '#111827' },
  root: {
    id: 'root',
    type: 'Root',
    props: {},
    styles: { base: { padding: '24px' } },
    events: [],
    children: [
      {
        id: 'h1',
        type: 'Heading',
        props: { content: '示例页面：使用 PageRenderer 渲染' },
        styles: { base: { margin: '0 0 12px', fontSize: '28px' } },
        events: [],
      },
      {
        id: 'p1',
        type: 'Text',
        props: { content: '这是一个由 VWE 渲染器渲染的简单示例。' },
        styles: { base: { margin: '0 0 16px', fontSize: '16px' } },
        events: [],
      },
      {
        id: 'btn',
        type: 'Button',
        props: { text: '点击弹窗', onClick: 'alert:Hello from VWE' },
        styles: { base: { padding: '10px 16px', borderRadius: '6px' } },
        events: [],
      },
    ],
  },
}

export default function EditorDemo() {
  const [bp, setBp] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editor Demo</h1>
        <div className="flex gap-2">
          <button onClick={() => setBp('mobile')} className="px-3 py-1 rounded bg-gray-100">Mobile</button>
          <button onClick={() => setBp('tablet')} className="px-3 py-1 rounded bg-gray-100">Tablet</button>
          <button onClick={() => setBp('desktop')} className="px-3 py-1 rounded bg-gray-100">Desktop</button>
        </div>
      </div>

      <p className="text-sm text-gray-600">此页面演示如何在站点中使用 `PageRenderer` 渲染导出的 schema。</p>

      <div className="bg-white p-4 rounded shadow">
        <PageRenderer schema={{ ...sampleSchema, activeBreakpoint: bp }} breakpoint={bp} />
      </div>
    </div>
  )
}
