import JSON5 from 'json5'

/** 解开多一层 stringify 留下的 `\"` / `\\` */
function unescapeJsonLayer(text: string): string {
  return text.replace(/\\"/g, '"').replace(/\\\\/g, '\\')
}

/** 从流式/夹杂标签的文本里取出最外层 JSON */
function extractJsonPayload(text: string): string {
  const trimmed = text.trim()
  const objStart = trimmed.indexOf('{')
  const arrStart = trimmed.indexOf('[')
  let start = -1
  if (objStart < 0) start = arrStart
  else if (arrStart < 0) start = objStart
  else start = Math.min(objStart, arrStart)
  if (start < 0) return trimmed

  const open = trimmed[start]
  const close = open === '[' ? ']' : '}'
  const end = trimmed.lastIndexOf(close)
  if (end <= start) return trimmed.slice(start)
  return trimmed.slice(start, end + 1)
}

/**
 * 兼容标准 JSON / JSON5，以及被额外转义过的内容（如 `[{\"type\":\"wikiinfo\"}]`）。
 * 流式半截内容返回 undefined，不抛错。
 */
export function parseCustomDataJson(content: string): unknown {
  let text = extractJsonPayload(String(content ?? ''))
  if (!text) return undefined

  for (let i = 0; i < 4; i++) {
    try {
      const value = JSON5.parse(text)
      if (typeof value === 'string') {
        text = extractJsonPayload(value)
        continue
      }
      return value
    } catch {
      const next = unescapeJsonLayer(text)
      if (next === text) return undefined
      text = extractJsonPayload(next)
    }
  }

  return undefined
}
