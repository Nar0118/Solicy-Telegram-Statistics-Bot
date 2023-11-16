import { Api } from "telegram";
import { TotalList } from "telegram/Helpers";
import "dotenv/config";

import { DateRange } from "../../common/helpers/DateRange.helper";
import {
  IDailyReaction,
  IDaily,
  IVoter,
} from "../../common/types/reactionTypes";
import { Client } from "./client.service";
import { checkTimeRange } from "../../common/helpers/checkTimeRange.helper";
import { isReacted } from "../../common/helpers/isReacted.helper";
import { DISLIKE, LIKE, POSITIVE_REACTIONS } from "../../common/utils/messages";
import env from "../../common/utils/env";

const TIMEDELTA_HOURS = env.timeDeltaHours;

export class DailyReaction {
  private client: Client;
  private chatId: number;
  private date: string;
  private startDate: Date;
  private endDate: Date;
  private dailyData: IDaily;

  constructor(
    client: Client,
    chatId: number,
    date: string,
    customDate?: string
  ) {
    this.client = client;
    this.chatId = chatId;
    this.date = date;
    [this.startDate, this.endDate] = new DateRange(
      date,
      customDate
    ).get_date_range();

    this.dailyData = {
      dailyReactions: {
        Positive: 0,
        Negative: 0,
        Voters: [],
        Total: 0,
        date: this.startDate,
      },
      firstMessage: null,
      lastMessage: null,
      messageTotalEachUser: [],
      nonReactedCount: 0,
    };
  }

  public async getStatistics(): Promise<IDaily> {
    const messages = await this.client.getMessages(this.chatId, this.startDate);

    const users = await this.client.getUsers(this.chatId);
    
    this.dailyData.dailyReactions.Voters = users.map((user) => {
      return {
        fullName: user.firstName ?? user.username ?? "",
        negativeCount: 0,
        positiveCount: 0,
        submitted: 0,
        successRate: 0,
        Total: 0,
        voterId: Number(user.id),
      };
    });

    this.getDailyInfo(messages, users);

    this.getSuccessRate();

    this.dailyData.dailyReactions.Positive = this.getTotalPositive();

    return this.dailyData;
  }

  private getDailyInfo(
    messages: TotalList<Api.Message>,
    users: TotalList<Api.User>
  ): void {
    messages.forEach((msg) => {
      const messageDate = new Date(
        msg.date * 1000 + Number(TIMEDELTA_HOURS) * 3600 * 1000
      );

      const isInRange = checkTimeRange(
        this.date,
        this.startDate.getTime(),
        this.endDate.getTime(),
        messageDate.getTime()
      );

      if (isInRange) {
        const messageUserId =
          msg?.fromId?.className === "PeerUser"
            ? Number(msg?.fromId?.userId)
            : 0;
        const user = this.client.getUserById(users, messageUserId);

        user && this.getMessagesInfo(user, msg);
      }
    });
  }

  private getSubmitted(message: Api.Message, voter: IVoter): void {
    const reaction = message.reactions?.recentReactions;
    if (!reaction) return;

    const myReactions = reaction.filter((react) => {
      if (react.peerId.className === "PeerUser") {
        return Number(react.peerId.userId) === Number(voter.voterId);
      }
    });

    if (
      myReactions.some((item) => {
        if (item.reaction.className === "ReactionEmoji") {
          return ["👏", "🔥"].includes(item.reaction.emoticon);
        }
      })
    )
      voter.submitted++;
  }

  private getMessagesInfo(user: Api.User, msg: Api.Message): void {
    if (msg?.message && !msg.message.startsWith("/")) {
      if (!this.dailyData.firstMessage) {
        this.dailyData.firstMessage = msg.message;
      }
      this.dailyData.lastMessage = msg.message;
      this.dailyData.nonReactedCount += isReacted(msg) ? 0 : 1;
      this.getVoters(msg, user, this.dailyData.dailyReactions);
    }
  }

  private getSuccessRate(): void {
    this.dailyData.dailyReactions.Voters.map((voter: IVoter) => {
      voter.successRate =
        voter.Total !== 0 ? (voter.positiveCount / voter.Total).toFixed(2) : 0;
    });
  }

  private getVoters(
    message: Api.Message,
    user: Api.User,
    dailyReactions: IDailyReaction
  ): void {
    dailyReactions.Total++;
    const ind = dailyReactions.Voters.findIndex(
      (vorter) => vorter.voterId === Number(user.id)
    );
    if (ind !== -1) {
      this.getUserReactions(dailyReactions.Voters[ind], message);
    } else {
      dailyReactions.Voters.push(
        this.getUserReactions(
          {
            fullName: user.firstName ?? user.username ?? "",
            negativeCount: 0,
            positiveCount: 0,
            submitted: 0,
            successRate: "",
            voterId: Number(user.id),
            Total: 0,
          },
          message
        )
      );
    }
    this.dailyData.dailyReactions.Voters.forEach((voter) => {
      this.getSubmitted(message, voter);
    });
  }

  private getTotalPositive(): number {
    return this.dailyData.dailyReactions.Voters.reduce(
      (acc: Number, val: IVoter) => {
        return val.positiveCount + Number(acc);
      },
      0
    );
  }

  private getUserReactions(voterInfo: IVoter, message: Api.Message): IVoter {
    let isPositive = false;
    let likedCount = 0;
    const users: number[] = [];
    const reaction = message?.reactions?.recentReactions;
    if (reaction) {
      reaction.forEach((res) => {
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
    }

    voterInfo.positiveCount += isPositive || likedCount > 0 ? 1 : 0;
    voterInfo.negativeCount += isPositive && likedCount > 0 ? 0 : 1;
    voterInfo.Total++;
    return voterInfo;
  }
}
