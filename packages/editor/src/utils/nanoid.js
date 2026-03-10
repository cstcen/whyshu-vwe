// 轻量级 nanoid 实现（避免额外依赖）
export function nanoid(size = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const bytes = crypto.getRandomValues(new Uint8Array(size));
    for (const byte of bytes) {
        result += chars[byte % chars.length];
    }
    return result;
}
//# sourceMappingURL=nanoid.js.map