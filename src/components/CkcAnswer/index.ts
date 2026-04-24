import type { App } from 'vue'
import CkcAnswer from './CkcAnswer.vue'

(CkcAnswer as any).install = (app: App) => {
  const compName = (CkcAnswer as any).__name ?? (CkcAnswer as any).name ?? 'CkcAnswer'
  app.component(compName as string, CkcAnswer)
}

export default CkcAnswer