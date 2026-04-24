
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
    END: 'end'
} as const;
// 每条消息的原始结构
export interface Message {
    type: typeof MessageType[keyof typeof MessageType];
    traceId: string;
    sessionId: string;
    content: string;
}

export interface MessageViewInfo extends Message {

}