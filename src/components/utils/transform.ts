import type { Message, MessageViewInfo } from "../types/message";
import  {  MessageType } from "../types/message";

export const transformMessages = (message: Message, originalMessage: MessageViewInfo) => {
    if (message.type === MessageType.THINKING) {
        originalMessage.content += message.content;
    }
    if (message.type === MessageType.ANSWER) {
        originalMessage.content += message.content;
    }
};