import { ref } from "vue";
import { MessageType, type Message, type MessageViewInfo } from "../types/message";

export function useMessageView() {
  const currentMeassageViewInfo = ref<MessageViewInfo[]>([
    {
      isExpanded: true,
      messageGroupInfo: [],
    },
  ]);
  const mergingMessage = (message: Message) => {
    return {
      ...message,
      thinkingIsExpanded: true
    }
  }
  /**
   * 处理收到的消息数据，并将其加入当前展示组
   *
   * 处理逻辑：
   * 1. 忽略空消息和不需要展示的系统类型消息
   * 2. 尝试与当前组最后一条消息合并（trace/session/type 全部一致）
   * 3. 如果 THINKING 后紧接 ANSWER，则保持同一组展示，但展开状态不同
   * 4. 否则折叠当前组并创建一个新的展开组来展示当前消息
   */
  const handleData = (message: Message) => {
    // 安全保护，避免空消息导致异常
    if (!message) {
      return;
    }
    if ([MessageType.END,MessageType.HEART,MessageType.TOOL_RESULT,MessageType.TOOL_RESULT_SILENT,MessageType.PING].some(t=> t === message.type)) {
      return;
    }
    // 获取当前显示组的最后一项，如果不存在则创建默认组
    const lastMeassageViewInfo = currentMeassageViewInfo.value[currentMeassageViewInfo.value.length - 1];
    const lastItemMessageGroupInfo = lastMeassageViewInfo.messageGroupInfo;

    // 获取当前组中的最后一条消息，用于判断是否可合并
    const previousMessage = lastItemMessageGroupInfo[lastItemMessageGroupInfo.length - 1];

    // 如果当前组为空，则直接将新消息添加到当前组
    if (!previousMessage) {
      lastItemMessageGroupInfo.push(mergingMessage(message));
      return;
    }

    // 判断当前消息是否与上一条消息来源一致，可进行内容合并
    const isSameTrace = previousMessage.traceId === message.traceId;
    const isSameSession = previousMessage.sessionId === message.sessionId;
    const isSameType = previousMessage.type === message.type;

    // 只有在 trace/session/type 都一致时，才将内容追加到上一条消息中
    if (isSameTrace && isSameSession && isSameType) {
      previousMessage.content += message.content;
      return;
    }

    // THINKING 后紧跟 ANSWER 时，保持在同一个展开分组内展示
    if (
      lastItemMessageGroupInfo.length === 1 &&
      previousMessage.type === MessageType.THINKING &&
      message.type === MessageType.ANSWER
    ) {
      previousMessage.thinkingIsExpanded = false;
      lastItemMessageGroupInfo.push(mergingMessage(message));
      return;
    }

    // 其他情况下，将当前分组折叠，并创建一个新的展开分组用于新消息
    if (lastMeassageViewInfo.messageGroupInfo.length === 1 
      && (lastMeassageViewInfo.messageGroupInfo[0].type === MessageType.TOOL_USE || lastMeassageViewInfo.messageGroupInfo[0].type === MessageType.TOOL_USE_SILENT)
      ) { 
        lastMeassageViewInfo.isExpanded = true;
      } else {
        lastMeassageViewInfo.isExpanded = false;
      }
    currentMeassageViewInfo.value.push({
      isExpanded: true,
      messageGroupInfo: [mergingMessage(message)]
    });
  }
  return { currentMeassageViewInfo, handleData };
}