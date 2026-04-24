import { type Message } from "./message";
export interface CkcAnswerProps {
    messages: Message[];
    customHtmlTags?: string[];
    renderCustomId?: string;
}