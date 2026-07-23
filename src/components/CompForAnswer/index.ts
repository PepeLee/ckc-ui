import type { App } from 'vue'
import CustomData from './CustomData.vue'

(CustomData as any).install = (app: App) => {
  const compName = (CustomData as any).__name ?? (CustomData as any).name ?? 'CustomData'
  app.component(compName as string, CustomData)
}

export default CustomData