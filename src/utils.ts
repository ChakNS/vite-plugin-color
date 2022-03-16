import CleanCss, { OptionsPromise } from 'clean-css'
import { propType, optionType } from './types'
import request from 'request'

export async function minifyCSS(css: string, options: OptionsPromise ) {
  const res = await new CleanCss(Object.assign({ rebase: false }, options)).minify(css)

  if (res.errors && res.errors.length) {
    console.error(`error when minifying css:\n${res.errors}`)
    throw res.errors[0]
  }

  if (res.warnings && res.warnings.length) {
    console.warn(`warnings when minifying css:\n${res.warnings}`)
  }

  return res.styles
}

export const patchReg = (s: string) => new RegExp(s.replace(/\s/g, '').replace(/,/g, ',\\s*') + '([\\da-f]{2})?(\\b|\\)|,|\\s)', 'i')

export const isTargetFile = (name: string) => /\.css|scss|less|styl$/.test(name)

export const formatOption = (options: optionType) => {
  if (!Array.isArray(options)) {
    return <Array<propType>>[options]
  }
  return options
}

export const fetchFile = (url: string) => {
  return new Promise((resolve, reject) => {
    request(url, (error: any, response: any, data: any) => {
      if (error) {
        reject(error)
      }
      resolve(data)
    })
  })
}