import pkg from './package.json'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
	input: 'lib/main.ts',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
		},
		{
			file: pkg.module,
			format: 'es',
		},
		{
			file: pkg.browser,
			format: 'iife',
			name: 'BridgeModelViewer',
		},
	],
	external: ['three', 'molang'],
	plugins: [
		typescript({
			typescript: require('typescript'),

			tsconfigOverride: {
				compilerOptions: {
					outDir: 'dist',
					module: 'ESNext',
				},
			},
		}),
		nodeResolve(),
		commonjs(),
		terser(),
	],
}
