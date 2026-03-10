import { useEffect, useState } from 'react'
import EditorLayout from '@/components/EditorLayout'
import PreviewPage from '@/components/PreviewPage'

type AppMode = 'editor' | 'preview'

function getAppMode(): AppMode {
  return window.location.hash.startsWith('#/preview') ? 'preview' : 'editor'
}

export default function App() {
  const [mode, setMode] = useState<AppMode>(getAppMode)

  useEffect(() => {
    const onHashChange = () => setMode(getAppMode())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return mode === 'preview' ? <PreviewPage /> : <EditorLayout />
}
