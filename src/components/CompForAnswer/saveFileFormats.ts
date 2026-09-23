import { computed, inject, ref, unref, type MaybeRef } from 'vue'

/**
 * 文件卡片「保存到个人知识库」控制流程：
 * 1. 使用方在 CkcAnswer 上传入 :show-file-save（默认 true）
 * 2. CkcAnswer 同时 provide 该值，并 syncShowFileSave 写入模块状态
 *    （FileCard 经 markstream 自定义节点渲染，不一定能 inject 到 provide）
 * 3. FileCard 用 useShowFileSave() 读取开关：优先 inject，拿不到则用模块状态
 * 4. 开关为 true 时，再按 filename 后缀是否在 DEFAULT_SAVE_FILE_FORMATS 里决定是否展示
 * 5. 打开菜单时把 showSave 传给 popover，由 FileCardPopover 渲染保存按钮
 */

/** 可保存到个人知识库的默认文件后缀 */
export const DEFAULT_SAVE_FILE_FORMATS = [
  'doc', 'docx', 'pdf', 'xls', 'xlsx', 'txt', 'md',
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico',
  'tif', 'tiff', 'heic', 'heif', 'avif', 'apng', 'jfif',
]

/** CkcAnswer provide / FileCard inject 使用的 key */
export const SHOW_FILE_SAVE_KEY = 'ckcShowFileSave'

/** inject 失败时的兜底开关，由 CkcAnswer 通过 syncShowFileSave 同步 */
const showFileSaveState = ref(true)

/** CkcAnswer 在 showFileSave 变化时调用，保证自定义节点也能读到最新开关 */
export function syncShowFileSave(enabled: boolean) {
  showFileSaveState.value = enabled
}

function getFileExtension(filename: string) {
  const name = filename.trim()
  const idx = name.lastIndexOf('.')
  if (idx <= 0 || idx === name.length - 1) {
    return ''
  }
  return name.slice(idx + 1).toLowerCase()
}

/** 后缀是否在默认可保存格式列表中 */
export function isSaveableFilename(filename: string) {
  const extension = getFileExtension(filename)
  if (!extension) {
    return false
  }
  return DEFAULT_SAVE_FILE_FORMATS.some((format) => format === extension)
}

/** FileCard 读取「是否允许展示保存」：inject 优先，否则用模块兜底状态 */
export function useShowFileSave() {
  const injected = inject<MaybeRef<boolean | undefined>>(SHOW_FILE_SAVE_KEY, undefined)
  return computed(() => {
    const fromInject = unref(injected)
    if (typeof fromInject === 'boolean') {
      return fromInject
    }
    return showFileSaveState.value
  })
}
