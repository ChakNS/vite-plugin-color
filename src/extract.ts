const DATA_URL_REG = /url\s*\([\\'"\s]*data:/
const QUOT_REG = /\\+(['"])/g
const LEFT_BRACKET = '{'
const RIGHT_BRACKET = '}'

const pullChart = (s: string) => s.includes(';') ? s.split(';')[1] : s

export default function extractColor(extractRegs: RegExp[]) {
  const isExtract = (code: string) => extractRegs.some(reg => reg.test(code))

  const extractor = (code: string) => {
    const rules = code.split(';')
    const result = []
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i]
      if (rule.match(DATA_URL_REG)) {
        rule += ';' + rules[i + 1]
        rule = rule.replace(QUOT_REG, '$1')
        i++
      }
      if (isExtract(rule)) {
        result.push(rule)
      }
    }
    return result
  }

  const handler = (code: string) => {
    const stack = []
    const len = code.length
    let contanter = ''
    let selector = ''
    let content = ''
    let i = 0
    const result: Array<{ selector: string; content: string }> = []

    while (i < len) {
      if (code[i] === LEFT_BRACKET) {
        if (!stack.length) {
          selector = contanter
          contanter = ''
        } else {
          contanter += code[i]
        }
        stack.push(LEFT_BRACKET)

        i++
        continue
      }

      if (code[i] === RIGHT_BRACKET) {
        stack.pop()
        if (stack.length) {
          contanter += code[i]
          i++
          continue
        }

        content = contanter
        contanter = ''

        if (!content) {
          i++
          continue
        }

        const exist = result.find(item => item.selector === selector)
        if (!exist) {
          result.push({ selector, content })
        } else if (exist.content !== content) {
          exist.content += content
        }

        i++
        continue
      }

      contanter += code[i]
      i++
    }

    return result.reduce((pre, curr) => {
      let rules: Array<string> = []
      if (curr.content.includes(LEFT_BRACKET)) {
        const keyframesMatched = handler(curr.content)
        if (keyframesMatched && keyframesMatched.length) {
          rules = [curr.content]
        }
      } else {
        rules = extractor(curr.content)
      }

      if (rules.length) {
        curr.selector = pullChart(curr.selector)
        return pre.concat(`${curr.selector}{${rules.join(';')}}`)
      }

      return pre
    }, [] as string[])
  }

  return handler
}
