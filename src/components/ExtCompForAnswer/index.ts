import type { App } from 'vue'
import ExtCustomTag from './ExtCustomTag.vue'

(ExtCustomTag as any).install = (app: App) => {
  const compName = (ExtCustomTag as any).__name ?? (ExtCustomTag as any).name ?? 'ExtCustomTag'
  app.component(compName as string, ExtCustomTag)
}


export { ExtCustomTag }

