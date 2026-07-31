
## 使用说明

简要：`ext-custom-tag` 用于在渲染的 HTML/自定义标签中嵌入外部 AI Web Component（例如 `ai-report-panel`）。该标签的宿主实现会在客户端挂载时自动注入脚本 `https://cdn.jsdelivr.net/npm/ai-com-web@0.1.1/dist/ai-component-web-component.js`，并在脚本加载完成以及自定义元素注册后渲染目标 Web Component。

**控制大模型返回格式示例**

```html
<ext-custom-tag
    component-tag="xxx"
    custom-data="xxxx">
</ext-custom-tag>
```

**完整返回示例（示意）**

```html
<ext-custom-tag component-tag=\"ai-report-panel\" custom-data=\"[{&quot;type&quot;:&quot;markdown&quot;,&quot;name&quot;:&quot;来自父页面的消息&quot;,&quot;value&quot;:&quot;这是通过 `postMessage` 从父页面触发的 **AI 报告面板** 渲染测试。&quot;},{&quot;type&quot;:&quot;alertcard&quot;,&quot;name&quot;:&quot;&quot;,&quot;value&quot;:&quot;&quot;,&quot;object&quot;:{&quot;title&quot;:&quot;提示&quot;,&quot;score&quot;:&quot;99&quot;,&quot;desc&quot;:&quot;当前为父页面主动下发的测试数据，用于验证跨 iframe 通信。&quot;,&quot;alert&quot;:[&quot;事项一：确认 iframe 内能收到消息&quot;,&quot;事项二：确认 Web Component 或 Portal 能正确渲染&quot;]}}]\"></ext-custom-tag>
```

**字段说明**

- `component-tag`：自定义标签名称，用于指定要渲染的 Web Component（例如 `ai-report-panel`）。
- `custom-data`：传递给自定义组件的数据，用于配置或初始化目标组件的内容。

**说明与注意事项**

- 组件会在客户端注入并加载外部脚本；
- 若页面中已存在相同脚本，宿主会复用该脚本并等待其加载完成以避免重复加载。





