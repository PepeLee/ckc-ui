import { type Message } from "./message";
import type { Component } from 'vue';

export interface CkcAnswerProps {
    messages?: Message[];
    historyMessages?: Message[];
    customHtmlTags?: string[];
    renderCustomId?: string;
    useSource?: string; // 使用来源默认pc，移动端mobile
    markdownComponent?: Component; // 接收外部的 Markdown 渲染组件
    showFileSave?: boolean; // 使用方控制文件卡片是否展示「保存到个人知识库」，默认 true
}