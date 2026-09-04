import JSON5 from 'json5'

/** 解开多一层 stringify 留下的 `\"` / `\\` */
function unescapeJsonLayer(text: string): string {
  // 前半段 /\\"/g → "
  // 把「反斜杠 + 双引号」变成普通双引号。
  return text.replace(/\\"/g, '"').replace(/\\\\/g, '\\')
// 后半段 /\\\\/g → \\
// 把「两个反斜杠」收成一个。
// 如果字段值里本身有路径或 \\n 这类转义，多 stringify 一次会变成 \\\\，这一步把它还原成 JSON 里该有的 \\。

// 顺序要先处理 \"，再处理 \\。如果先把 \\ 收成 \，\" 可能对不齐，引号解不干净。
}

/** 从流式/夹杂标签的文本里取出最外层 JSON */
function extractJsonPayload(text: string): string {
  const trimmed = text.trim()
  const objStart = trimmed.indexOf('{')
  const arrStart = trimmed.indexOf('[')
  let start = -1
  // 如果对象开头不是 {，则从数组开头开始
  if (objStart < 0) start = arrStart
  // 如果数组开头不是 [，则从对象开头开始
  else if (arrStart < 0) start = objStart
  // 如果对象和数组开头都不是 { 和 [，则从开头开始
  else start = Math.min(objStart, arrStart)
  // 如果开头不是 { 或 [，则返回原文本
  if (start < 0) return trimmed

  const open = trimmed[start]
  const close = open === '[' ? ']' : '}'
  const end = trimmed.lastIndexOf(close)
  if (end <= start) return trimmed.slice(start)
  return trimmed.slice(start, end + 1)
}

function tryParse(text: string): unknown {
  try {
    return JSON5.parse(text)
  } catch {
    return undefined
  }
}

/**
 * 兼容标准 JSON / JSON5，以及被额外转义过的内容（如 `[{\"type\":\"wikiinfo\"}]`）。
 * 流式半截内容返回 undefined，不抛错。
 */
export function parseCustomDataJson(content: string): unknown {
  const text = extractJsonPayload(String(content ?? ''))
  if (!text) return undefined

  let value = tryParse(text)
  if (value === undefined) {
    const unescaped = unescapeJsonLayer(text)
    if (unescaped === text) return undefined
    value = tryParse(extractJsonPayload(unescaped))
  }
  if (typeof value === 'string') {
    value = tryParse(extractJsonPayload(value))
  }
  if (value === undefined || typeof value === 'string') return undefined
  return value
}
