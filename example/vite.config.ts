import vue from '@vitejs/plugin-vue'
import viteColor from '../src'

export default {
  base: './',
  plugins: [
    vue(),
    viteColor([
      {
        extract: ['#eee'],
        output: 'themes/triple-e.css',
        injectTo: 'head',
      },
      {
        extract: ['#409eff'],
        external: [
          'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
        ],
        output: 'themes/element-primary.css',
      },
      {
        extract: ['#F56C6C'],
        output: 'themes/element-danger-success.css',
        external: [
          'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
        ],
        transform: code => code.replace(new RegExp('#F56C6C', 'gi'), '#67C23A'),
      },
    ]),
  ],
	// remove @charset warning
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: atRule => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            },
          },
        },
      ],
    },
  },
}
