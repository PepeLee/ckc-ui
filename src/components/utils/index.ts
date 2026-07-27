import { MessageType, type MessageViewInfo } from '../types/message';

export function formatTimeConsuming(value: string | number | undefined): string {
  if (value === undefined || value === null || value === '') {
    return '0分钟0秒';
  }

  const totalMilliseconds = Number(value);
  if (!Number.isFinite(totalMilliseconds) || totalMilliseconds < 0) {
    return '0分钟0秒';
  }

  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}秒`;
  }

  return `${minutes}分钟${seconds}秒`;
}

/**
 * 查找数组中最后一个 messageGroupInfo 里包含 ANSWER 类型消息的 MessageViewInfo
 * @param currentMessageViewInfo - 消息视图信息数组
 * @returns 找到的 MessageViewInfo 或 undefined
 */
export function findLastAnswerMessageViewInfo(currentMessageViewInfo: MessageViewInfo[]): MessageViewInfo | undefined {
  // 从后往前遍历数组
  for (let i = currentMessageViewInfo.length - 1; i >= 0; i--) {
    const messageViewInfo = currentMessageViewInfo[i];
    // 检查当前 MessageViewInfo 的 messageGroupInfo 中是否包含 ANSWER 类型的消息
    const hasAnswerMessage = messageViewInfo.messageGroupInfo.some(
      message => message.type === MessageType.ANSWER
    );

    if (hasAnswerMessage) {
      return messageViewInfo;
    }
  }

  return undefined;
}