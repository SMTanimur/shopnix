import type { AxiosInstance } from 'axios';
import type {
  ApiResponse,
  InboxConversation,
  InboxMessage,
  SendMessageDto,
  UpdateConversationDto,
  QuickOrderFromChatDto,
  Order,
} from '@shopnix/types';

export class InboxApi {
  constructor(private readonly axios: AxiosInstance) {}

  async listConversations(params?: {
    channel?: string;
    status?: string;
  }): Promise<ApiResponse<InboxConversation[]>> {
    const { data } = await this.axios.get<ApiResponse<InboxConversation[]>>('/inbox/conversations', {
      params,
    });
    return data;
  }

  async getConversation(id: string): Promise<ApiResponse<InboxConversation>> {
    const { data } = await this.axios.get<ApiResponse<InboxConversation>>(`/inbox/conversations/${id}`);
    return data;
  }

  async updateConversation(
    id: string,
    dto: UpdateConversationDto
  ): Promise<ApiResponse<InboxConversation>> {
    const { data } = await this.axios.patch<ApiResponse<InboxConversation>>(
      `/inbox/conversations/${id}`,
      dto
    );
    return data;
  }

  async listMessages(conversationId: string): Promise<ApiResponse<InboxMessage[]>> {
    const { data } = await this.axios.get<ApiResponse<InboxMessage[]>>(
      `/inbox/conversations/${conversationId}/messages`
    );
    return data;
  }

  async sendMessage(
    conversationId: string,
    dto: SendMessageDto
  ): Promise<ApiResponse<InboxMessage>> {
    const { data } = await this.axios.post<ApiResponse<InboxMessage>>(
      `/inbox/conversations/${conversationId}/messages`,
      dto
    );
    return data;
  }

  async approveAIMessage(messageId: string): Promise<ApiResponse<InboxMessage>> {
    const { data } = await this.axios.post<ApiResponse<InboxMessage>>(
      `/inbox/messages/${messageId}/approve`
    );
    return data;
  }

  async createOrderFromChat(
    conversationId: string,
    dto: QuickOrderFromChatDto
  ): Promise<ApiResponse<Order>> {
    const { data } = await this.axios.post<ApiResponse<Order>>(
      `/inbox/conversations/${conversationId}/create-order`,
      dto
    );
    return data;
  }
}
