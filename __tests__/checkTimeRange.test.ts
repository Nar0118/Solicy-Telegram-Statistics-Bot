import { checkTimeRange } from "../src/common/helpers/checkTimeRange.helper";

const mockGetRange = jest.fn(() => {
  const startDate = new Date();
  startDate.setHours(2);
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);
  const endDate = new Date();
  endDate.setHours(2);
  endDate.setMinutes(0);
  endDate.setSeconds(0);
  endDate.setMilliseconds(0);
  endDate.setDate(endDate.getDate() + 1);

  return [startDate, endDate];
});

describe("Check Time range funciton work", () => {
  jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

  it("Check for today to be true", () => {
    const [start, end] = mockGetRange();
    const correctDate = start;
    correctDate.setHours(correctDate.getHours() + 2);
    expect(
      checkTimeRange(
        "today",
        start.getTime(),
        end.getTime(),
        correctDate.getTime()
      )
    ).toBe(true);
  });

  it("Check for today to be false", () => {
    const [start, end] = mockGetRange();
    const wrongDate = new Date(start);
    wrongDate.setHours(start.getHours() - 1);

    expect(
      checkTimeRange(
        "today",
        start.getTime(),
        end.getTime(),
        wrongDate.getTime()
      )
    ).toBe(false);
  });

  it("Check for Custom range to be true", () => {
    const [start, end] = mockGetRange();
    const correctDate = new Date(start);
    correctDate.setHours(correctDate.getHours() + 4);
    expect(
      checkTimeRange(
        "custom",
        start.getTime(),
        end.getTime(),
        correctDate.getTime()
      )
    ).toBe(true);
  });

  it("Check for Custom range to be false", () => {
    const [start, end] = mockGetRange();
    const correctDate = new Date(end);
    correctDate.setHours(correctDate.getHours() + 4);
    expect(
      checkTimeRange(
        "custom",
        start.getTime(),
        end.getTime(),
        correctDate.getTime()
      )
    ).toBe(false);
  });
});
