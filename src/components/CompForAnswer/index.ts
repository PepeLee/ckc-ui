import type { App } from 'vue'
import CustomData from './CustomData.vue'
import CustomDataArray from './CustomDataArray.vue'

(CustomData as any).install = (app: App) => {
  const compName = (CustomData as any).__name ?? (CustomData as any).name ?? 'CustomData'
  app.component(compName as string, CustomData)
}

(CustomDataArray as any).install = (app: App) => {
  const compName = (CustomDataArray as any).__name ?? (CustomDataArray as any).name ?? 'CustomDataArray'
  app.component(compName as string, CustomDataArray)
}

export { CustomData, CustomDataArray }

