import vue from '@vitejs/plugin-vue'
import viteColor from '../src'

export default {
	base: './',
	plugins: [
		vue(),
		viteColor([
			{
				extract: ['#eee'],
				output: 'themes/test-css_1.css',
				injectTo: 'head'
			},
			{
				extract: ['#ccc'],
				output: 'themes/test-css_2.css',
				transform: code => code.replace('#ccc', '#fff'),
				injectTo: 'head'
			}
		])
	]
}