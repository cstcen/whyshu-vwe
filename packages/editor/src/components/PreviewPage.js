import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { PageRenderer } from '@vwe/renderer';
const PREVIEW_SCHEMA_KEY = 'vwe:preview-schema';
function readPreviewSchema() {
    try {
        const raw = window.localStorage.getItem(PREVIEW_SCHEMA_KEY);
        if (!raw)
            return null;
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
export default function PreviewPage() {
    const schema = useMemo(readPreviewSchema, []);
    if (!schema) {
        return (_jsx("div", { style: {
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                padding: '24px',
                background: '#f8fafc',
                color: '#0f172a',
            }, children: _jsxs("div", { style: {
                    maxWidth: '560px',
                    width: '100%',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                    padding: '20px',
                }, children: [_jsx("h2", { style: { margin: 0, fontSize: '20px', marginBottom: '10px' }, children: "\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u9875\u9762" }), _jsx("p", { style: { margin: 0, lineHeight: 1.6, color: '#475569' }, children: "\u8BF7\u56DE\u5230\u7F16\u8F91\u5668\u70B9\u51FB\u201C\u5BFC\u51FA JSON\u201D\u3002\u5BFC\u51FA\u65F6\u4F1A\u81EA\u52A8\u6253\u5F00\u672C\u9884\u89C8\u9875\uFF0C\u5E76\u6E32\u67D3\u5B9E\u9645\u7F51\u9875\u6548\u679C\u3002" }), _jsx("div", { style: { marginTop: '16px', display: 'flex', gap: '10px' }, children: _jsx("button", { onClick: () => {
                                window.location.hash = '#/';
                            }, style: {
                                height: '36px',
                                padding: '0 14px',
                                borderRadius: '10px',
                                border: '1px solid #cbd5e1',
                                background: '#fff',
                                cursor: 'pointer',
                            }, children: "\u8FD4\u56DE\u7F16\u8F91\u5668" }) })] }) }));
    }
    return _jsx(PageRenderer, { schema: schema });
}
//# sourceMappingURL=PreviewPage.js.map