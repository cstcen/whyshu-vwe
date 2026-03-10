import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import EditorLayout from '@/components/EditorLayout';
import PreviewPage from '@/components/PreviewPage';
function getAppMode() {
    return window.location.hash.startsWith('#/preview') ? 'preview' : 'editor';
}
export default function App() {
    const [mode, setMode] = useState(getAppMode);
    useEffect(() => {
        const onHashChange = () => setMode(getAppMode());
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);
    return mode === 'preview' ? _jsx(PreviewPage, {}) : _jsx(EditorLayout, {});
}
//# sourceMappingURL=App.js.map