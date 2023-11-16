import { Api } from "telegram";
import { UserStatistics } from "../../common/types/userStatsTypes";
import { Client } from "./client.service";
import { DISLIKE, LIKE, POSITIVE_REACTIONS } from "../../common/utils/messages";

export class UserStats {
  private chatId: number;
  private client: Client;

  constructor(chatId: number, client: Client) {
    this.chatId = chatId;
    this.client = client;
  }

  public async getUserInfo(username: string): Promise<UserStatistics[]> {
    const users = await this.client.getUsers(this.chatId);
    const user = users.find((user) => user.username === username);
    const messages = await this.getAllUsersMessages(users);
    const myMessages = messages.find(
      (msg) => msg.username === username
    )?.messages;
    if (!user || !myMessages) throw new Error("Invalid username");

    const res: UserStatistics = {
      Negative: 0,
      Positive: 0,
      Sent: 0,
      Submitted: 0,
      username: username,
    };
    const reactions = this.getReactionsCount(myMessages);

    res.Sent = myMessages.length;
    res.Positive = reactions.positive;
    res.Negative = reactions.negative;
    res.Submitted = this.getSubmitted(
      messages.reduce((acc: any[], val) => [...acc, ...val.messages], []),
      Number(user.id)
    );

    return [res];
  }

  public async getUsersInfo(): Promise<UserStatistics[]> {
    const result: Array<UserStatistics> = [];
    const users = await this.client.getUsers(this.chatId);
    const messages = await this.getAllUsersMessages(users);
    messages.forEach((obj) => {
      const user = users.find((user) => user.username === obj.username);
      if (!user) return;
      const res: UserStatistics = {
        Negative: 0,
        Positive: 0,
        Sent: 0,
        Submitted: 0,
        username: obj.username ?? "",
      };
      const validMessages = this.getValidMessages(obj.messages);
      const reactions = this.getReactionsCount(validMessages);
      res.Sent = validMessages.length;
      res.Positive = reactions.positive;
      res.Negative = reactions.negative;
      res.Submitted = this.getSubmitted(
        messages.reduce((acc: any[], val) => [...acc, ...val.messages], []),
        Number(user.id)
      );
      result.push(res);
    });

    return result;
  }

  private getValidMessages(messages: Array<Api.Message>): Array<Api.Message> {
    return messages.filter((msg: Api.Message) => {
      return msg.text && !msg.text.startsWith("/");
    }, 0);
  }

  private getReactionsCount(messages: Array<Api.Message>): {
    positive: number;
    negative: number;
  } {
    let positive = 0;
    let negative = 0;
    messages.forEach((msg: Api.Message) => {
      let isPositive = false;
      let likedCount = 0;
      const users: number[] = [];
      const reactions = msg?.reactions?.recentReactions;
      if (reactions) {
        reactions.forEach((res) => {
          if (
            res.reaction.className === "ReactionEmoji" &&
            res.peerId.className === "PeerUser"
          ) {
            if (!users.includes(Number(res.peerId.userId))) {
              if (POSITIVE_REACTIONS.includes(res.reaction.emoticon)) {
                isPositive = true;
              } else if (res.reaction.emoticon === LIKE) {
                likedCount++;
              } else if (res.reaction.emoticon === DISLIKE) {
                likedCount--;
              }
              users.push(Number(res.peerId.userId));
            }
          }
        });
        positive += isPositive || likedCount > 0 ? 1 : 0;
        negative += isPositive && likedCount > 0 ? 0 : 1;
      }
    }, 0);
    return { positive, negative };
  }

  private getSubmitted(messages: Array<Api.Message>, userId: number): number {
    let submitted = 0;
    const submitReactions = ["👏", "🔥"];
    for (let i = 0; i < messages.length; ++i) {
      const reaction = messages[i].reactions?.recentReactions;
      if (!reaction) {
        continue;
      }
      const myReactions = reaction.filter((react) => {
        if (react.peerId.className === "PeerUser") {
          return Number(react.peerId.userId) === Number(userId);
        }
      });

      if (
        myReactions.some((item) => {
          if (item.reaction.className === "ReactionEmoji") {
            return submitReactions.includes(item.reaction.emoticon);
          }
        })
      )
        submitted++;
    }
    return submitted;
  }

  private async getAllUsersMessages(users: Array<Api.User>): Promise<
    {
      username?: string;
      messages: Array<Api.Message>;
    }[]
  > {
    const usersInfoPromise = users.map(async (user) => {
      const messages = await this.client.getUserMessagesByUserId(
        Number(user.id),
        this.chatId
      );
      return {
        username: user.username,
        messages,
      };
    });

    return await Promise.all(usersInfoPromise);
  }
}
