import { Dates } from "../enums/dates";

export const checkTimeRange = (
  date: string,
  start: number,
  end: number,
  messageDate: number
): boolean => {
  switch (date) {
    case Dates.TODAY:
      return messageDate >= start;
    default:
      return messageDate >= start && messageDate <= end;
  }
};
