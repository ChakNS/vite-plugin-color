<h2 align="left">vite-plugin-color</h2>

**English** | [中文文档](./README.zh_CN.md)

<p align="left">Automatically change colors and output theme packs for Vite</p>

## Usage

### Install

**node version:** >= 14.0.0

**vite version:** >= 2.0.0

```
yarn add vite-plugin-color -D

or

npm i vite-plugin-color -D
```

### Config

Add it to `vite.config.js`
```javascript
// vite.config.js
import viteColor from 'vite-plugin-color'

export default {
  plugins: [
    viteColor([
      {
        extract: ['#eee'],
        output: 'themes/triple-e.css',
        injectTo: 'head'
      }
    ])
  ]
}
```

## Options

The parameters can be a single object or an array of objects.

```ts
export interface propType {
  // The color value that needs to be extracted.
  // Inline styles or styled are not supported at this time.
  extract: string[]
  // The handler of the matching content
  transform?: (code: string) => string
  // External css file links like 'cdn'
  external?: string[]
  // The file output path
  output?: string
  // Whether to minify. @default true
  minify?: boolean
  // Minify options，follow `clean-css`
  minifyOptions?: OptionsPromise
  // Production environment auto-injects loaded css,
  // supports customization, follows `vite HtmlTagDescriptor`
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend' | HtmlTagDescriptor
}

export type optionType = Array<propType> | propType
```

## License

MIT
