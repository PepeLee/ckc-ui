<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';

const props = defineProps<{
  node: {
    type: string
    content?: string
    loading?: boolean
    attrs?: string
  }
  customId?: string
  isDark?: boolean
}>()

const getAttrStringByKey = (key: string) => {
    if (props.node.attrs && Array.isArray(props.node.attrs)) {
        const customDataAttrArray = props.node.attrs.find((attrArray: any[]) =>
        Array.isArray(attrArray) && attrArray.length === 2 && attrArray[0] === key
        )
        if (customDataAttrArray) {
        return customDataAttrArray[1] as string
        }
        return null
    }
  return null
}
const customData = computed(() => { return getAttrStringByKey('custom-data')  })
// const customData = ref<string>('[{&quot;type&quot;:&quot;markdown&quot;,&quot;name&quot;:&quot;来自父页面的消息&quot;,&quot;value&quot;:&quot;这是通过 `postMessage` 从父页面触发的 **AI 报告面板** 渲染测试。&quot;},{&quot;type&quot;:&quot;alertcard&quot;,&quot;name&quot;:&quot;&quot;,&quot;value&quot;:&quot;&quot;,&quot;object&quot;:{&quot;title&quot;:&quot;提示&quot;,&quot;score&quot;:&quot;99&quot;,&quot;desc&quot;:&quot;当前为父页面主动下发的测试数据，用于验证跨 iframe 通信。&quot;,&quot;alert&quot;:[&quot;事项一：确认 iframe 内能收到消息&quot;,&quot;事项二：确认 Web Component 或 Portal 能正确渲染&quot;]}}]')
const WEB_COMPONENT_TAG = computed(() => { return getAttrStringByKey('component-tag') })

const scriptLoaded = ref(false)
const scriptError = ref(false)
const showWebComponent = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const webComponentWrapperRef = ref<HTMLElement | null>(null)

const SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/ai-com-web@0.1.1/dist/ai-component-web-component.js'
// const WEB_COMPONENT_TAG = 'ai-component-web-component'

function createScriptTag() {
  const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`) as HTMLScriptElement | null
  if (existing) {
    if (existing.getAttribute('data-loaded') === 'true') {
      scriptLoaded.value = true
      renderWebComponent()
      return
    }
    existing.addEventListener('load', onScriptLoad)
    existing.addEventListener('error', onScriptError)
    return
  }

  const script = document.createElement('script')
  script.src = SCRIPT_URL
  script.async = true
  script.onload = onScriptLoad
  script.onerror = onScriptError
  document.head.appendChild(script)
}

function onScriptLoad() {
  scriptLoaded.value = true
  const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`) as HTMLScriptElement | null
  if (existing) {
    existing.setAttribute('data-loaded', 'true')
  }
  renderWebComponent()
}

function onScriptError() {
  scriptError.value = true
}

async function renderWebComponent() {
  if (!containerRef.value) return
  console.log('WEB_COMPONENT_TAG', WEB_COMPONENT_TAG.value)
  try {
    if (window.customElements && typeof window.customElements.whenDefined === 'function') {
      await window.customElements.whenDefined(WEB_COMPONENT_TAG.value as string)
    }
  } catch {
    // ignore if whenDefined fails or the element is already defined
  }

  showWebComponent.value = true
  setTimeout(() => {
    if (webComponentWrapperRef.value) {
        const innerHTML = `<${WEB_COMPONENT_TAG.value} items="${customData.value}"></${WEB_COMPONENT_TAG.value}>`;
        // console.log('innerHTML', innerHTML)
        webComponentWrapperRef.value.innerHTML= innerHTML;
    }
  })

}

onMounted(() => {
  createScriptTag()
})
</script>

<template>
  <!-- <div>
    <div>标签属性 {{ customData }}</div>
    <div>tag: {{ WEB_COMPONENT_TAG }}</div>
    {{ showWebComponent }}
  </div> -->
    <div ref="containerRef">
        <template v-if="showWebComponent">
            <div ref="webComponentWrapperRef"></div>
        <!-- <component :is="WEB_COMPONENT_TAG" :items="customData" /> -->
        </template>
        <div v-else-if="scriptError">Web Component 加载失败</div>
        <div v-else>正在加载 AI Web 组件...</div>
    </div>
</template>
