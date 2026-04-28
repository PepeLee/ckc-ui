
// 消息类型
export const MessageType = {
    EXCEPTION: 'exception',
    THINKING: 'thinking',
    ANSWER: 'answer',
    DOCUMENTS: 'documents',
    RECOMMENDATIONS: 'recommendations',
    TOOL_USE: 'tool_use',
    TOOL_USE_SILENT: 'tool_use_silent',
    TOOL_RESULT: 'tool_result',
    PING: 'ping',
    END: 'end',
    HEART: 'heart'
} as const;
// 每条消息的原始结构
export interface Message {
    type: typeof MessageType[keyof typeof MessageType];
    traceId: string;
    sessionId: string;
    content: string;
}

export interface MessageForView extends Message {
    thinkingIsExpanded?: boolean; // 仅针对 type 为 THINKING 的消息，控制其内容的展开折叠状态
    // todo 增加显示需要的字段
}

export interface MessageViewInfo {
    isExpanded: boolean; // 是否展开:控制当前消息组的折叠显示状态
    messageGroupInfo: MessageForView[]; // 消息组信息
}