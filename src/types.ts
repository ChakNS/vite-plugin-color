import { OptionsPromise } from 'clean-css'
import { HtmlTagDescriptor } from 'vite'

export interface propType {
  extract: string[]
  transform?: (code: string) => string
  output?: string
  minify?: boolean
  minifyOptions?: OptionsPromise
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend' | HtmlTagDescriptor
}

export type optionType = Array<propType> | propType