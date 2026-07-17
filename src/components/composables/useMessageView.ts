import { ref } from "vue";
import { MessageType, type Message, type MessageForView, type MessageViewInfo } from "../types/message";

export function useMessageView() {
  const currentMeassageViewInfo = ref<MessageViewInfo[]>([]); // 当前展示的消息分组信息，每个分组包含多条消息和分组状态
  const recommendations = ref<string[]>([]); // 推荐消息内容，单独提取出来方便展示组件使用
  const end = ref(false);
  const progressShow = ref(true);
  const hasThinkingMessage = ref(false);
  const uploadHeartInfo = ref<{
    task: string;
  }>();
  const humanConfirmMessage = ref<Message | null>(null); // 用于存储 human_confirm 类型的消息，方便后续处理
  const taskListMessage = ref<Message | null>(null); // 用于存储 task_list 类型的消息，方便后续处理
  const mergingMessage = (message: Message) : MessageForView => {
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
    if (message.type === MessageType.END || message.endFlag) {
      end.value = true;
      return;
    }
    if (!message.type) {
      return;
    }
    // 提取推荐问题内容，单独处理后直接返回，不进入消息分组逻辑
    if (message.type === MessageType.RECOMMENDATIONS) {
      recommendations.value = message.content as string[];
      return;
    }
    if (!Object.values(MessageType).includes(message.type)) {
      return;
    }
    if (message.type === MessageType.ANSWER && !message.content) {
      return;
    }
    if (message.type === MessageType.EXCEPTION) {
      end.value = true;
    }
    // 如果是 human_confirm 类型的消息，直接返回，不进入消息分组逻辑
    if (message.type === MessageType.HUMAN_CONFIRM) {
      humanConfirmMessage.value = message;
      return;
    }
    // 如果是 task_list 类型的消息，直接返回，不进入消息分组逻辑
    if (message.type === MessageType.TASK_LIST) {
      taskListMessage.value = message;
      return;
    }
    if (message.type === MessageType.THINKING) {
      hasThinkingMessage.value = true;
    }
    if(message.type === MessageType.ANALYSIS) {
      try {
        uploadHeartInfo.value = {
          task: message.content as string,
        };
      } catch (e) {
        uploadHeartInfo.value = undefined;
        return;
      }
      return;
    }
    uploadHeartInfo.value = undefined;
    // 如果MessageType 是TOOL_RESULT，找到最近一条如果MessageType 为TOOL_USE 的消息的messageGroupInfo，toolUseComplete状态设置为 true
    if(message.type === MessageType.TOOL_RESULT || message.type === MessageType.TOOL_RESULT_SILENT) {
      const filterType = message.type === MessageType.TOOL_RESULT ? MessageType.TOOL_USE : MessageType.TOOL_USE_SILENT;
      // 从后往前遍历，找到最近一条 TOOL_USE 或 TOOL_USE_SILENT 的消息
      for (let i = currentMeassageViewInfo.value.length - 1; i >= 0; i--) {
        const messageViewInfo = currentMeassageViewInfo.value[i];
        const hasToolUseMessage = messageViewInfo.messageGroupInfo.some(
          msg => msg.type === filterType
        );
        
        if (hasToolUseMessage && !messageViewInfo.toolUseComplete) {
          messageViewInfo.toolUseComplete = true;
          return;
        }
      }
      return;
    }
    // if ([
    //   MessageType.END,
    //   MessageType.HEART,
    //   MessageType.TOOL_RESULT,
    //   MessageType.TOOL_RESULT_SILENT,
    //   MessageType.PING,
    //   MessageType.ALL_ANSWER,
    //   MessageType.CHATFLOW_RESULT,
    //   MessageType.WORKFLOW_RESULT,
    //   MessageType.AGENT_THINKING
    // ].some(t=> t === message.type)) {
    //   return;
    // }
    if (currentMeassageViewInfo.value.length === 0) {
      currentMeassageViewInfo.value.push({
        isExpanded: true,
        thinkState: message.type === MessageType.THINKING ? 'loading' : undefined,
        messageGroupInfo: [mergingMessage(message)]
      });
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
    if (isSameTrace && isSameSession && isSameType && typeof message.content === 'string' && message.type !== MessageType.TOOL_USE && message.type !== MessageType.TOOL_USE_SILENT) {
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
      lastMeassageViewInfo.thinkState = 'success';
      lastItemMessageGroupInfo.push(mergingMessage(message));
      return;
    }
    lastMeassageViewInfo.isExpanded = false;
    // 处理折叠逻辑：如果当前消息类型为 TOOL_USE 或 DOCUMENTS，则默认展开；否则默认折叠
    if (lastMeassageViewInfo.messageGroupInfo.length === 1 
      && (lastMeassageViewInfo.messageGroupInfo[0].type === MessageType.TOOL_USE 
        || lastMeassageViewInfo.messageGroupInfo[0].type === MessageType.TOOL_USE_SILENT
        || lastMeassageViewInfo.messageGroupInfo[0].type === MessageType.ANSWER
        || lastMeassageViewInfo.messageGroupInfo[0].type === MessageType.EXCEPTION)
      ) { 
        lastMeassageViewInfo.isExpanded = true;
    }
    if (message.type === MessageType.DOCUMENTS) {
      lastMeassageViewInfo.isExpanded = true;
    }
    // 如果当前消息与上一条消息的 trace/session/type 都一致，并且消息类型为 DOCUMENTS，则将其合并到当前分组中
    if (isSameTrace && isSameSession && isSameType && message.content && message.type === MessageType.DOCUMENTS) {
      lastItemMessageGroupInfo.push(mergingMessage(message));
      return;
    }
    if (lastMeassageViewInfo.thinkState) {
      lastMeassageViewInfo.thinkState = 'success';
    }
    // 当下一个消息（不是推荐问或者文档）插入到currentMeassageViewInfo时，上一条currentMeassageViewInfo 被判定为执行过程··
    if (message.type !== MessageType.DOCUMENTS) {
      lastMeassageViewInfo.isProgress = true;
    }
    currentMeassageViewInfo.value.push({
      isExpanded: true,
      isDocumentGroup: message.type === MessageType.DOCUMENTS,
      thinkState: message.type === MessageType.THINKING ? 'loading' : undefined,
      messageGroupInfo: [mergingMessage(message)]
    });
  }
  return { currentMeassageViewInfo, recommendations, end, handleData, uploadHeartInfo, humanConfirmMessage, taskListMessage, progressShow, hasThinkingMessage };
}