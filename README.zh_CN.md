<h2 align="left">vite-plugin-color</h2>

<p align="left">自动改变指定颜色并输出主题包</p>

## 用法

### 安装

**node version:** >= 14.0.0

**vite version:** >= 2.0.0

```bash
yarn add vite-plugin-color -D

or

npm i vite-plugin-color -D
```

### 使用

`vite.config.js`添加插件配置
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

参数可以是单个对象，也可以是对象数组

```ts
export interface propType {
  // 需要抽取的色值，暂不支持内联样式或styled
  extract: string[]
  // 对匹配内容的处理函数
  transform?: (code: string) => string
  // 外部css文件链接，如`cdn`
  external?: string[]
  // 文件输出路径
  output?: string
  // 是否压缩 @default true
  minify?: boolean
  // 压缩参数，遵循`clean-css`
  minifyOptions?: OptionsPromise
  // 生产环境自动注入加载的 css, 支持自定义，遵循`vite HtmlTagDescriptor`
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend' | HtmlTagDescriptor
}

export type optionType = Array<propType> | propType
```

## License

MIT
