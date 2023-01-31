import cleaner from 'rollup-plugin-cleaner'
import copy from 'rollup-plugin-copy'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import dayTool from 'dayjs'
import fs from 'fs'


const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8' }))

const author = pkg.author
const banner = `/**
 * @license ${pkg.license}
 * author: ${author}
 * date: ${dayTool().format('YYYY-MM-DD')}
 */
`

export default {
	input: 'src/index.ts',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			exports: 'named',
			sourcemap: false,
			banner
		},
		{
			file: pkg.module,
			format: 'es',
			exports: 'named',
			sourcemap: false,
			banner
		}
	],
	plugins: [
		copy({
			targets: [{ src: 'src/types', dest: 'dist' }]
		}),
		terser(),
		typescript({
			tsconfigOverride: {
				exclude: ['__test__/*', '__test__/**', 'vitest.*', 'test/*']
			},
			rollupCommonJSResolveHack: false,
			clean: true
		}),
		cleaner({
			targets: ['./dist/']
		})
	]
}
