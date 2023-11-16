import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { TotalList } from "telegram/Helpers";
import env from "../../common/utils/env";

const API_ID = Number(env.apiId) ?? 0;
const API_HASH = String(env.apiHash);

export class Client {
  private sessionString: StringSession;
  private client: TelegramClient;
  constructor(session: StringSession) {
    this.sessionString = session;
    this.client = new TelegramClient(this.sessionString, API_ID, API_HASH, {
      connectionRetries: 5,
    });
  }

  public async connectClient(): Promise<void> {
    await this.client.connect();
  }

  public async getUserMessagesByNickname(
    nickname: string,
    chatId: number
  ): Promise<TotalList<Api.Message>> {
    const messages = await this.client.getMessages(chatId, {
      fromUser: nickname,
    });
    return messages;
  }

  public async getUserMessagesByUserId(
    id: number,
    chatId: number
  ): Promise<TotalList<Api.Message>> {
    const messages = await this.client.getMessages(chatId, {
      fromUser: id,
      reverse: true,
    });

    return messages;
  }

  public async getUsers(chatId: number): Promise<TotalList<Api.User>> {
    const users = await this.client.getParticipants(chatId);
    return users.filter((user) => !user.bot);
  }

  public getUserById(
    users: TotalList<Api.User>,
    id: number
  ): Api.User | undefined {
    return users.find((user) => Number(user.id) === id);
  }

  public async getMessages(
    chatId: number,
    startDate: Date
  ): Promise<TotalList<Api.Message>> {
    const [firstMessage] = await this.client.getMessages(chatId, {
      reverse: true,
      offsetDate: startDate.getTime() / 1000,
    });
    if (!firstMessage) return [];

    const messages = await this.client.getMessages(chatId, {
      reverse: true,
      minId: firstMessage.id - 1,
    });
    return messages;
  }
}
