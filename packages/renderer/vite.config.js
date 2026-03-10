import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'VweRenderer',
            formats: ['es'],
            fileName: 'index',
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});
//# sourceMappingURL=vite.config.js.map