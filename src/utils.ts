import CleanCss, { OptionsPromise } from 'clean-css'

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