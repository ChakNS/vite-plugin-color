import extractColor from './extract'
import { HtmlTagDescriptor, ResolvedConfig } from 'vite'
import { minifyCSS, patchReg, isTargetFile, formatOption } from './utils'
import { propType, optionType } from './types'
import { LINK_CSS_REG } from './contants'
import { fetchFile } from './utils'
import chalk from 'chalk'

export { propType, optionType, HtmlTagDescriptor }

export default (options: optionType) => {
  options = formatOption(options)

  const transformCode = (code: string) => (options as Array<propType>).reduce((pre, curr) => curr.transform ? curr.transform(pre) : pre, code)
  const extractRegs = (extract: string[]) => extract.map(patchReg)
  const extractCode = (code: string) => {
    outputFiles.forEach(file => {
      const extractCode = extractColor(file.extractRegs)(code).join('')
      file.code += file.transform ? `${file.transform(extractCode)}` : extractCode
    })
  }

  let isProd: boolean
  let cache: Map<string, string> = new Map()
  const outputFiles = options.filter(item => item.output).map(item => ({
    ...item,
    extractRegs: extractRegs(item.extract),
    code: '',
  }))

  return {
    name: 'vite:color',
    configResolved(config: ResolvedConfig) {
      isProd = config.command === 'build'
    },
    async transform(code: string, id: string) {
      // todo 外部css文件
      if (isTargetFile(id)) {
        if (cache.has(id)) {
          return { code: cache.get(id), map: null }
        }
        const sourceCode = transformCode(code)
        cache.set(id, sourceCode)
        if (isProd) extractCode(code)
        return { code: sourceCode, map: null }
      }
    },
    async buildEnd() {
      if (isProd) {
        for await (const file of outputFiles) {
          if (file.external?.length) {
            for await (const url of file.external) {
              if (LINK_CSS_REG.test(url)) {
                try {
                  let code:string | unknown
                  if (cache.has(url)) {
                    code = cache.get(url)
                  } else {
                    console.log(chalk.cyan('\n🛠️ [vite-plugin-color]') + `- extracting external css from ${url}...`)
                    code = await fetchFile(url)
                    cache.set(url, code as string)
                  }
  
                  if (typeof code === 'string') {
                    const extractCode = extractColor(file.extractRegs)(code).join('')
                    file.code += file.transform ? `${file.transform(extractCode)}` : extractCode
                  } else throw new Error('error for fetch external css')
                } catch (error) {
                  console.error(chalk.cyan('❌ [vite-plugin-color]') + ` - ${error}`)
                }
              }
            }
          }

          if (file.minify !== false) {
            file.code = await minifyCSS(file.code, Object.assign({ returnPromise: true }, file.minifyOptions))
          }

          // @ts-ignore
          this.emitFile({
            type: 'asset',
            name: file.output,
            fileName: file.output,
            source: file.code,
          })
        }
        console.log(chalk.cyan('✨ [vite-plugin-color]') + ` - successfully!\n`)
        cache.clear()
      }
    },
    transformIndexHtml() {
      if (isProd) {
        const injectTags = outputFiles.map(item => {
          if (typeof item.injectTo === 'object') return item.injectTo
          return {
            tag: 'link',
            attrs: {
              rel: 'stylesheet',
              href: `./${item.output}`,
            },
            injectTo: item.injectTo || 'head',
          }
        })

        return injectTags
      }
    },
  }
}
