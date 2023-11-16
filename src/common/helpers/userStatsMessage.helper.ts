import { UserStatistics } from "../types/userStatsTypes";

export const getUserStatsMessage = (resOBJ: Array<UserStatistics>): string => {
  let res = "";
  resOBJ.forEach((val) => {
    res += `${val.username}\n\t\t\tSent: ${val.Sent}\n\t\t\tSubmitted: ${val.Submitted}\n\t\t\tPositive: ${val.Positive}\n\t\t\tNegative: ${val.Negative}\n\n`;
  });
  return res;
};
