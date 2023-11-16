import { IDayliMessage } from "../types/dailyMessageProps";
import { Dates, DateTexts } from "../enums/dates";
import { MONTHS } from "../utils/constants";
import { DateRange } from "./DateRange.helper";
import env from "../utils/env";

const START_TIME = env.startTime;

export function getStatsMessageByDay({
  chatTitle,
  dailyData,
  date,
  custom,
}: IDayliMessage): string {
  const isCustom = date === Dates.CUSTOM;
  const dateRange = new DateRange(date, custom);
  const [start, end] = dateRange.get_date_range();
  const startDate = start.getDate();
  const endDate = end.getDate();
  const startMonth = MONTHS[start.getMonth()];
  const endMonth = MONTHS[end.getMonth()];

  const range = isCustom
    ? `${startDate} ${startMonth}`
    : DateTexts[date as keyof typeof DateTexts]
    ? DateTexts[date as keyof typeof DateTexts]
    : `From ${startDate} ${startMonth} to ${endDate} ${endMonth}`;

  let result = `Chat: ${chatTitle}\n\nSending ${range} messages ${`starting from ${START_TIME}:00`}\nFirst message: ${
    dailyData.firstMessage ?? "-"
  }\n${
    end.getTime() < Date.now()
      ? `Last Message: ${dailyData.lastMessage ?? "-"}\n`
      : ""
  } \nTotal: ${dailyData.dailyReactions.Total}\nNon Reacted: ${
    dailyData.nonReactedCount
  }\nPositive: ${dailyData.dailyReactions.Positive}\n\n`;

  for (const voter of dailyData.dailyReactions.Voters) {
    result += `${voter.fullName}: ${voter.Total}/${voter.positiveCount} :: Submitted: ${voter.submitted}\n`;
  }

  return result;
}
