export interface IDaily {
  firstMessage: string | null;
  lastMessage: string | null;
  dailyReactions: IDailyReaction;
  nonReactedCount: number;
  messageTotalEachUser: Array<{
    username: string;
    value: number;
  }>;
}

export interface IDailyReaction {
  date?: Date;
  Positive: number;
  Negative: number;
  Voters: Array<IVoter>;
  Total: number;
}

export interface IVoter {
  voterId: number;
  fullName: string;
  positiveCount: number;
  negativeCount: number;
  submitted: number;
  successRate: string | 0;
  Total: number;
}
