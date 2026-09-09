/** 文件卡片「保存到个人知识库」默认支持的后缀 */
export const DEFAULT_SAVE_FILE_FORMATS = [
  'doc', 'docx', 'pdf', 'xls', 'xlsx', 'txt', 'md',
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico',
  'tif', 'tiff', 'heic', 'heif', 'avif', 'apng', 'jfif',
]

function getFileExtension(filename: string) {
  const name = filename.trim()
  const idx = name.lastIndexOf('.')
  if (idx <= 0 || idx === name.length - 1) {
    return ''
  }
  return name.slice(idx + 1).toLowerCase()
}

export function isSaveableFilename(filename: string) {
  const extension = getFileExtension(filename)
  if (!extension) {
    return false
  }
  return DEFAULT_SAVE_FILE_FORMATS.some((format) => format === extension)
}

