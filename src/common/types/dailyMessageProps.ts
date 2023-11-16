import { IDaily } from "./reactionTypes";

export interface IDayliMessage {
  chatTitle: string;
  dailyData: IDaily;
  date: string;
  custom?: string
}
