import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'lib/main.ts'),
			name: 'ModelViewer',
			fileName: (format) => `model-viewer.${format}.js`,
		},
		rollupOptions: {
			external: ['molang', 'three', 'wintersky'],
		},
	},
})
