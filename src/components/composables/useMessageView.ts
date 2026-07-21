import { ref } from "vue";
import { MessageType, type Message, type MessageForView, type MessageViewInfo } from "../types/message";
 import json5 from 'json5';

export function useMessageView() {
  const currentMeassageViewInfo = ref<MessageViewInfo[]>([]); // 当前展示的消息分组信息，每个分组包含多条消息和分组状态
  const recommendations = ref<string[]>([]); // 推荐消息内容，单独提取出来方便展示组件使用
  const end = ref(false);
  const progressShow = ref(true);
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
  const getGroupTitle = (group: MessageViewInfo) => {
    if (group.messageGroupInfo.length === 0) {
      return;
    }
    let title = '';
    let toolName = '';
    if (group.messageGroupInfo.length > 0) {
      const answerMsgIdex = group.messageGroupInfo.findIndex((mgx) => {
        return mgx.type === MessageType.ANSWER
      })
      if (answerMsgIdex >= 0) {
        const answerMsg = group.messageGroupInfo[answerMsgIdex];
        title = answerMsg?.content as string || '';
        group.messageGroupInfo = group.messageGroupInfo.filter((_, idx) => idx !== answerMsgIdex)
      } else {
        const toolMsgIdx = group.messageGroupInfo.findIndex((mgx) => {
          return mgx.type === MessageType.TOOL_USE || mgx.type === MessageType.TOOL_USE_SILENT
        })
        if (toolMsgIdx >= 0) {
          const toolMsg = group.messageGroupInfo[toolMsgIdx];
          try {
            toolName = json5.parse(toolMsg?.content as string).name || '';
          } catch {
            toolName = '';
          }
          title = toolName;
          group.messageGroupInfo = group.messageGroupInfo.filter((_, idx) => idx !== toolMsgIdx)
        }
      }
    }
    group.groupTitle = title || '任务已执行';
  }
  const isThinkingAndAnswerGroup = (group: MessageViewInfo): boolean => {
    if (group.messageGroupInfo.length !== 2) {
      return false;
    }
    const [first, second] = group.messageGroupInfo;
    return first.type === MessageType.THINKING && second.type === MessageType.ANSWER;
  }
  // 在结束时处理，特殊情况：知识门户问答只有thinking 和 answer.
  const handleDataAfterEnd = () => {
    // 如果有多个正文组，或者没有正文组，则不处理
    const filteredInfo = currentMeassageViewInfo.value.filter((info) => !info.isProgress && !info.isDocumentGroup);
    if (filteredInfo.length > 1 || filteredInfo.length === 0) {
      return;
    }
    const mainGroupIndex = currentMeassageViewInfo.value.findIndex((info) => !info.isProgress && !info.isDocumentGroup);
    const mainGroup = currentMeassageViewInfo.value[mainGroupIndex];
    // 如果输出正文是在第一个
    if (mainGroupIndex === 0 && isThinkingAndAnswerGroup(mainGroup)) {
      return;
    }
    // 取出answer 放到当前组后面，并删除当前组的answer,当前组设为执行过程
    const answerIndex = mainGroup.messageGroupInfo.findIndex((msg) => msg.type === MessageType.ANSWER);
    if (answerIndex >= 0) {
      const answerMessage = mainGroup.messageGroupInfo[answerIndex];
      mainGroup.messageGroupInfo.splice(answerIndex, 1);
      getGroupTitle(mainGroup);
      mainGroup.isProgress = true;
      mainGroup.isExpanded = false;
      currentMeassageViewInfo.value.push({
        isExpanded: true,
        groupTitle: '',
        show: true,
        messageGroupInfo: [answerMessage]
      });
    }
  }
  const handleData = (message: Message) => {
    // 安全保护，避免空消息导致异常
    if (!message) {
      return;
    }
    // 对话结束，end标志变为true，后续消息不再处理
    if (message.endFlag) {
      end.value = true;
      handleDataAfterEnd();
      return;
    }
    if (!message.type) {
      return;
    }
    // 如果类型不在前端处理的类型范围内，则直接忽略该消息
    if (!Object.values(MessageType).includes(message.type)) {
      return;
    }
    // 对话结束，end标志变为true，后续消息不再处理
    if (message.type === MessageType.END) {
      end.value = true;
      handleDataAfterEnd();
      return;
    }
    // 提取推荐问题内容，单独处理后直接返回，不进入消息分组逻辑
    if (message.type === MessageType.RECOMMENDATIONS) {
      recommendations.value = message.content as string[];
      return;
    }
    // 如果是 ANSWER 类型的消息，但内容为空，则直接返回，不进入消息分组逻辑
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

    // todo: 处理执行工具状态
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
    if (currentMeassageViewInfo.value.length === 0) {
      currentMeassageViewInfo.value.push({
        isExpanded: true,
        groupTitle: '',
        show: true,
        thinkState: message.type === MessageType.THINKING ? 'loading' : undefined,
        messageGroupInfo: [{ ...mergingMessage(message), thinkingIsExpanded: message.type !== MessageType.THINKING }]
      });
      return;
    }
   
    const lastMeassageViewInfo = currentMeassageViewInfo.value[currentMeassageViewInfo.value.length - 1];
    const lastItemMessageGroupInfo = lastMeassageViewInfo.messageGroupInfo;

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
    // 如果当前消息与上一条消息的 trace/session/type 都一致，并且消息类型为 DOCUMENTS，则将其合并到当前分组中
    if (isSameTrace && isSameSession && isSameType && message.content && message.type === MessageType.DOCUMENTS) {
      lastItemMessageGroupInfo.push(mergingMessage(message));
      return;
    }
    // 如果上一条消息不是 THINKING 类型，则直接将新消息添加到当前组
    if (message.type !== MessageType.THINKING && message.type !== MessageType.DOCUMENTS) {
      lastItemMessageGroupInfo.push(mergingMessage(message));
      
    }
    // 如果上一条消息是 THINKING 类型，则将新消息作为一个新的分组添加到 currentMeassageViewInfo 中，并将上一条 THINKING 消息的 thinkState 设置为 success
    if (message.type === MessageType.THINKING) {
      currentMeassageViewInfo.value.push({
        isExpanded: true,
        groupTitle: '',
        show: true,
        thinkState: message.type === MessageType.THINKING ? 'loading' : undefined,
        messageGroupInfo: [{ ...mergingMessage(message), thinkingIsExpanded: false }]
      });
      // let title = '';
      // let toolName = '';
      if (lastMeassageViewInfo.messageGroupInfo.length > 0) {
        // const answerMsgIdex = lastMeassageViewInfo.messageGroupInfo.findIndex((mgx) => {
        //   return mgx.type === MessageType.ANSWER
        // })
        // if (answerMsgIdex >= 0) {
        //   const answerMsg = lastMeassageViewInfo.messageGroupInfo[answerMsgIdex];
        //   title = answerMsg?.content as string || '';
        //   lastMeassageViewInfo.messageGroupInfo = lastMeassageViewInfo.messageGroupInfo.filter((_, idx) => idx !== answerMsgIdex)
        // } else {
        //   const toolMsgIdx = lastMeassageViewInfo.messageGroupInfo.findIndex((mgx) => {
        //     return mgx.type === MessageType.TOOL_USE || mgx.type === MessageType.TOOL_USE_SILENT
        //   })
        //   if (toolMsgIdx >= 0) {
        //     const toolMsg = lastMeassageViewInfo.messageGroupInfo[toolMsgIdx];
        //     try {
        //       toolName = json5.parse(toolMsg?.content as string).name || '';
        //     } catch {
        //       toolName = '';
        //     }
        //     title = toolName;
        //     lastMeassageViewInfo.messageGroupInfo = lastMeassageViewInfo.messageGroupInfo.filter((_, idx) => idx !== toolMsgIdx)
        //   }
        // }
        // lastMeassageViewInfo.groupTitle = title;
        getGroupTitle(lastMeassageViewInfo);
        lastMeassageViewInfo.isProgress = true;
        lastMeassageViewInfo.isExpanded = false;
      }
      
    }
    if (message.type === MessageType.DOCUMENTS) {
      currentMeassageViewInfo.value.push({
        isExpanded: true,
        groupTitle: '',
        show: true,
        isDocumentGroup: message.type === MessageType.DOCUMENTS,
        messageGroupInfo: [mergingMessage(message)]
      });
    }
    // 
    // if (
    //   lastItemMessageGroupInfo.length === 1 &&
    //   previousMessage.type === MessageType.THINKING &&
    //   message.type === MessageType.ANSWER
    // ) {
    //   previousMessage.thinkingIsExpanded = true;
    //   lastMeassageViewInfo.thinkState = 'success';
    //   lastItemMessageGroupInfo.push(mergingMessage(message));
    //   return;
    // }
    // lastMeassageViewInfo.isExpanded = true;
    // 处理折叠逻辑：如果当前消息类型为 TOOL_USE 或 DOCUMENTS，则默认展开；否则默认折叠
    if (lastItemMessageGroupInfo.length === 1 
      && (lastItemMessageGroupInfo[0].type === MessageType.TOOL_USE 
        || lastItemMessageGroupInfo[0].type === MessageType.TOOL_USE_SILENT
        || lastItemMessageGroupInfo[0].type === MessageType.ANSWER
        || lastItemMessageGroupInfo[0].type === MessageType.EXCEPTION)
      ) { 
        lastMeassageViewInfo.isExpanded = true;
    }
    if (message.type === MessageType.DOCUMENTS) {
      lastMeassageViewInfo.isExpanded = true;
    }

    if (lastMeassageViewInfo.thinkState) {
      lastMeassageViewInfo.thinkState = 'success';
    }
    // 当下一个消息（不是推荐问或者文档）插入到currentMeassageViewInfo时，上一条currentMeassageViewInfo 被判定为执行过程··
    // if (message.type !== MessageType.DOCUMENTS) {
    //   lastMeassageViewInfo.isProgress = true;
    // }
    // currentMeassageViewInfo.value.push({
    //   isExpanded: true,
    //   isDocumentGroup: message.type === MessageType.DOCUMENTS,
    //   thinkState: message.type === MessageType.THINKING ? 'loading' : undefined,
    //   messageGroupInfo: [mergingMessage(message)]
    // });
  }
  return { currentMeassageViewInfo, recommendations, end, handleData, uploadHeartInfo, humanConfirmMessage, taskListMessage, progressShow };
}