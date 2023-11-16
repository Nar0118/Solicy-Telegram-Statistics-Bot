import { DateRange } from "../src/common/helpers/DateRange.helper";

jest
  .useFakeTimers()
  .setSystemTime(
    new Date("Thu Oct 20 2020 19:00:00 GMT+0400 (Armenia Standard Time)")
  );

const setFakeSystemTime = (fakeDate: Date) => {
  jest.useFakeTimers();
  jest.setSystemTime(fakeDate);
};

describe("Test the dateRange class method work", () => {
  it("Check the range getter for the current day", () => {
    const dateRange = new DateRange("today");

    expect(dateRange.get_date_range()).toEqual([
      new Date("Thu Oct 20 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
      new Date(),
    ]);
  });

  it("Check the range getter for yesterday", () => {
    const dateRange = new DateRange("yesterday");
    expect(dateRange.get_date_range()).toEqual([
      new Date("Thu Oct 19 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
      new Date("Thu Oct 20 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
    ]);
  });

  it("Check the range getter for custom date", () => {
    const dateRange = new DateRange("custom", "10-18-2020");
    expect(dateRange.get_date_range()).toEqual([
      new Date("Thu Oct 18 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
      new Date("Thu Oct 19 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
    ]);
  });

  it("Check the range getter for custom week", () => {
    const dateRange = new DateRange("custom_week", "10-22-2020");

    expect(dateRange.get_date_range()).toEqual([
      new Date("Thu Oct 19 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
      new Date("Thu Oct 25 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
    ]);
  });

  it("Check the range getter for current week", () => {
    const dateRange = new DateRange("current_week");

    expect(dateRange.get_date_range()).toEqual([
      new Date("Thu Oct 19 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
      new Date(),
    ]);
  });

  it("Check the range getter for last week", () => {
    const dateRange = new DateRange("last_week");

    expect(dateRange.get_date_range()).toEqual([
      new Date("Thu Oct 12 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
      new Date("Thu Oct 18 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
    ]);
  });

  it("Check the range getter for custom month", () => {
    const dateRange = new DateRange("custom_month", "10-22-2020");

    expect(dateRange.get_date_range()).toEqual([
      new Date("Thu Oct 01 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
      new Date("Thu Oct 31 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
    ]);
  });

  it("Check the range getter for current month", () => {
    const dateRange = new DateRange("current_month");

    expect(dateRange.get_date_range()).toEqual([
      new Date("Thu Oct 01 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
      new Date(),
    ]);
  });

  it("Check the range getter for last month", () => {
    const dateRange = new DateRange("last_month");

    expect(dateRange.get_date_range()).toEqual([
      new Date("Thu Sep 01 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
      new Date("Thu Sep 30 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
    ]);
  });

  it("Check the range getter for default case", () => {
    const dateRange = new DateRange("default");

    expect(dateRange.get_date_range()).toEqual([
      new Date("Thu Oct 20 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
      new Date(),
    ]);
  });

  it("Check the wrong function call case (custom)", () => {
    const dateRange = new DateRange("custom");
    expect.assertions(1);
    try {
      dateRange.get_date_range();
    } catch (e: any) {
      expect(e.message).toEqual("Invalide command");
    }
  });

  it("Check the wrong function call case (custom week)", () => {
    const dateRange = new DateRange("custom_week");
    expect.assertions(1);
    try {
      dateRange.get_date_range();
    } catch (e: any) {
      expect(e.message).toEqual("Invalide command");
    }
  });

  it("Check the wrong function call case (custom month)", () => {
    const dateRange = new DateRange("custom_month");
    expect.assertions(1);
    try {
      dateRange.get_date_range();
    } catch (e: any) {
      expect(e.message).toEqual("Invalide command");
    }
  });

  it("Check the range getter for the current day with specific hour", () => {
    setFakeSystemTime(
      new Date("Thu Oct 21 2020 00:05:00 GMT+0400 (Armenia Standard Time)")
    );
    const dateRange = new DateRange("today");

    expect(dateRange.get_date_range()).toEqual([
      new Date("Thu Oct 20 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
      new Date(),
    ]);
  });

  it("Check the range getter for yesterday with specific hour", () => {
    setFakeSystemTime(
      new Date("Thu Oct 21 2020 00:05:00 GMT+0400 (Armenia Standard Time)")
    );
    const dateRange = new DateRange("yesterday");
    expect(dateRange.get_date_range()).toEqual([
      new Date("Thu Oct 19 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
      new Date("Thu Oct 20 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
    ]);
  });

  it("Check the range getter for current week with specific date and hour", () => {
    setFakeSystemTime(
      new Date("Thu Oct 25 2020 00:01:00 GMT+0400 (Armenia Standard Time)")
    );
    const dateRange = new DateRange("current_week");

    expect(dateRange.get_date_range()).toEqual([
      new Date("Thu Oct 18 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
      new Date("Thu Oct 25 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
    ]);
  });

  it("Check the range getter for current month with specific date and hour", () => {
    setFakeSystemTime(
      new Date("Thu Oct 01 2020 00:01:00 GMT+0400 (Armenia Standard Time)")
    );
    const dateRange = new DateRange("current_month");

    expect(dateRange.get_date_range()).toEqual([
      new Date("Thu Sep 01 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
      new Date("Thu Sep 30 2020 02:00:00 GMT+0400 (Armenia Standard Time)"),
    ]);
  });
});
