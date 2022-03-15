import extractColor from './extract'
import { HtmlTagDescriptor, ResolvedConfig } from 'vite'
import { OptionsPromise } from 'clean-css'
import { minifyCSS } from './utils'

interface propType {
  extract: string[]
  transform?: (code: string) => string
  output?: string
  minify?: boolean
  minifyOptions?: OptionsPromise
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend' | HtmlTagDescriptor
}

interface EmittedAsset {
  type: 'asset'
  name?: string
  fileName?: string
  source?: string | Uint8Array
}

interface rollupPluginContext {
  emitFile: (options: EmittedAsset) => {}
}

type optionType = Array<propType> | propType

const isTargetFile = (name: string) => /\.css|scss|less|styl$/.test(name)
const patchReg = (s: string) =>
  new RegExp(s.replace(/\s/g, '').replace(/,/g, ',\\s*') + '([\\da-f]{2})?(\\b|\\)|,|\\s)', 'i')

export { propType, HtmlTagDescriptor }

export default (options: optionType) => {
  if (!Array.isArray(options)) {
    options = <Array<propType>>[options]
  }
  let isProd: boolean
  let cache: Map<string, string> = new Map()

  const transformCode = (code: string) => {
    return (options as Array<propType>).reduce((pre, curr) => curr.transform ? curr.transform(pre) : pre, code)
  }
  const extractRegs = (extract: string[]) => extract.map(patchReg)
  const outputFiles = options.filter(item => item.output).map(item => ({
    ...item,
    extractRegs: extractRegs(item.extract),
    code: '',
  }))
  const extractCode = (code: string) => {
    outputFiles.forEach(file => {
      const extractCode = extractColor(file.extractRegs)(code).join('')
      file.code += file.transform ? `${file.transform(extractCode)}` : extractCode
    })
  }
  return {
    name: 'vite:color',
    configResolved(config: ResolvedConfig) {
      isProd = config.command === 'build'
    },
    async transform(code: string, id: string) {
      // todo 外部css文件
      if (isTargetFile(id)) {
        console.log(888, code)
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
          if (file.minify) {
            file.code = await minifyCSS(file.code, Object.assign({ returnPromise: true }, file.minifyOptions))
          }
          console.log({
            type: 'asset',
            name: file.output,
            fileName: file.output,
            source: file.code,
          });
          (this as unknown as rollupPluginContext).emitFile({
            type: 'asset',
            name: file.output,
            fileName: file.output,
            source: file.code,
          })
        }
      }
      cache.clear()
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
