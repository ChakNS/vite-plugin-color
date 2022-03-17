<h2 align="left">vite-plugin-color</h2>

**中文** | [English](./README.EN.md)

<p align="left">自动改变指定颜色并输出主题包</p>

## 用法

### 安装

**node version:** >= 14.0.0

**vite version:** >= 2.0.0

```
yarn add vite-plugin-color -D

or

npm i vite-plugin-color -D
```

### 使用

`vite.config.js`添加插件配置
```
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

| 参数 | 类型 | 必须 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| extract | `string[]` | 是 | - | 需要抽取的色值，暂不支持内联样式或styled |
| output | `string` | 否 | - | 文件输出路径 |
| external | `string[]` | 否 | - | 外部css文件链接，如`cdn` |
| minify | `boolean` | 否 | `true` | 是否压缩 |
| minifyOptions | `<OptionsPromise>` | 否 | `{ returnPromise: true }` | 压缩参数，遵循`clean-css` |
| transform | `(code:string) => string` | 否 | - | 对匹配内容的处理函数 |
| injectTo | `head`或`body`或`head-prepend`或`body-prepend`或`<HtmlTagDescriptor>` | 否 | - | 生产环境自动注入加载的 css, 支持自定义，遵循`vite HtmlTagDescriptor` |
## Reference

[webpack-theme-color-replacer](https://github.com/hzsrc/webpack-theme-color-replacer)

## License

MIT
