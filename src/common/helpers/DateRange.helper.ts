import { Dates } from "../enums/dates";
import env from "../utils/env";

const START_TIME = Number(env.startTime);
const TIMEDELTA = Number(env.timeDeltaHours);

export class DateRange {
  private value: Dates;
  private custom_date: string;

  constructor(value: string, customDate?: string) {
    this.value = value as Dates;
    this.custom_date = customDate ?? "";
  }
  get_date_range(): Date[] {
    this.catchCustomDateIssue();
    const [yesterdayStart, todayStart, localNow] =
      this.dayComplianceWithOurStandards();
    switch (this.value) {
      case Dates.TODAY:
        return [todayStart, localNow];
      case Dates.YESTERDAY:
        return [yesterdayStart, todayStart];
      case Dates.CUSTOM:
        return this.get_custom_date();
      case Dates.WEEK_CUSTOM:
        return this.get_custom_week();
      case Dates.CURRENT_WEEK:
        return this.get_current_week();
      case Dates.LAST_WEEK:
        return this.get_last_week();
      case Dates.MONTH_CUSTOM:
        return this.get_custom_month();
      case Dates.CURRENT_MONTH:
        return this.get_current_month();
      case Dates.LAST_MONTH:
        return this.get_last_month();
      default:
        return [todayStart, localNow];
    }
  }
  private catchCustomDateIssue(): void {
    if (
      [Dates.CUSTOM, Dates.WEEK_CUSTOM, Dates.MONTH_CUSTOM].includes(
        this.value
      ) &&
      !this.custom_date
    ) {
      throw Error("Invalide command");
    }
  }
  private get_current_week(): Date[] {
    const startOfWeek = new Date();
    const endOfWeek = new Date(Date.now() + TIMEDELTA * 3600 * 1000);

    if (startOfWeek.getDay() === 0) {
      startOfWeek.setDate(startOfWeek.getDate() - 7);
      endOfWeek.setDate(startOfWeek.getDate() + 7);
      endOfWeek.setHours(START_TIME, 0, 0, 0);
    } else {
      startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() - 1));
    }
    startOfWeek.setHours(START_TIME, 0, 0, 0);

    return [startOfWeek, endOfWeek];
  }

  private get_current_month(): Date[] {
    const startOfMonth = new Date();
    const endOfMonth = new Date();
    if (
      startOfMonth.getHours() >= 0 &&
      startOfMonth.getHours() < 2 &&
      startOfMonth.getDate() === 1
    ) {
      startOfMonth.setMonth(startOfMonth.getMonth() - 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(START_TIME, 0, 0, 0);
    }
    startOfMonth.setHours(START_TIME, 0, 0, 0);
    startOfMonth.setDate(1);

    return [startOfMonth, endOfMonth];
  }

  private get_last_week(): Date[] {
    const lastWeekStart = new Date();
    if (lastWeekStart.getDay() === 0)
      lastWeekStart.setDate(lastWeekStart.getDate() - 1);
    lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 6);
    lastWeekStart.setHours(START_TIME, 0, 0, 0);
    const lastWeekEnd = new Date(lastWeekStart.getTime());
    lastWeekEnd.setDate(lastWeekEnd.getDate() + 6);
    lastWeekEnd.setHours(START_TIME, 0, 0, 0);

    return [lastWeekStart, lastWeekEnd];
  }

  private get_last_month(): Date[] {
    const lastMonthStart = new Date();
    lastMonthStart.setDate(1);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setHours(START_TIME, 0, 0, 0);
    const lastMonthEnd = new Date();
    lastMonthEnd.setDate(0);
    lastMonthEnd.setHours(START_TIME, 0, 0, 0);

    return [lastMonthStart, lastMonthEnd];
  }

  private get_custom_date(): Date[] {
    const customStart = new Date(this.custom_date);
    customStart.setHours(START_TIME, 0, 0, 0);
    const customEnd = new Date(customStart);
    customEnd.setDate(customStart.getDate() + 1);

    return [customStart, customEnd];
  }

  private get_custom_week(): Date[] {
    const customStart = new Date(this.custom_date);
    customStart.setHours(START_TIME, 0, 0, 0);
    customStart.setDate(customStart.getDate() - customStart.getDay() + 1);
    const customEnd = new Date(customStart);
    customEnd.setDate(customStart.getDate() + 6);

    return [customStart, customEnd];
  }

  private get_custom_month(): Date[] {
    const customStart = new Date(this.custom_date);
    customStart.setHours(START_TIME, 0, 0, 0);
    customStart.setDate(1);
    const customEnd = new Date(customStart);
    customEnd.setMonth(customEnd.getMonth() + 1);
    customEnd.setDate(0);
    customEnd.setHours(START_TIME, 0, 0, 0);

    return [customStart, customEnd];
  }

  private dayComplianceWithOurStandards(): Date[] {
    const localNow = new Date(Date.now() + TIMEDELTA * 3600 * 1000);
    const todayStart = new Date(Date.now() + TIMEDELTA * 3600 * 1000);
    if (localNow.getHours() >= 0 && localNow.getHours() < 2) {
      todayStart.setDate(todayStart.getDate() - 1);
    }
    todayStart.setHours(START_TIME, 0, 0, 0);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);

    return [yesterdayStart, todayStart, localNow];
  }
}
