import { useMemo } from 'react'
import { PageRenderer } from '@vwe/renderer'
import type { PageSchema } from '@/types/schema'

const PREVIEW_SCHEMA_KEY = 'vwe:preview-schema'

function readPreviewSchema(): PageSchema | null {
  try {
    const raw = window.localStorage.getItem(PREVIEW_SCHEMA_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PageSchema
  } catch {
    return null
  }
}

export default function PreviewPage() {
  const schema = useMemo(readPreviewSchema, [])

  if (!schema) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '24px',
          background: '#f8fafc',
          color: '#0f172a',
        }}
      >
        <div
          style={{
            maxWidth: '560px',
            width: '100%',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            padding: '20px',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '20px', marginBottom: '10px' }}>没有可预览的页面</h2>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#475569' }}>
            请回到编辑器点击“导出 JSON”。导出时会自动打开本预览页，并渲染实际网页效果。
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                window.location.hash = '#/'
              }}
              style={{
                height: '36px',
                padding: '0 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              返回编辑器
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <PageRenderer schema={schema} />
}
