import { eachDayOfInterval, isWeekend } from "date-fns";

export function getHolidayDays({
  startingDate,
  startingPeriod,
  endingDate,
  endingPeriod,
}) {
  if (!startingDate) return 0;

  const weekDays = eachDayOfInterval({
    start: new Date(startingDate),
    end: new Date(endingDate),
  }).filter((date) => !isWeekend(date)).length;
  return startingPeriod === "Afternoon" || endingPeriod === "Lunchtime"
    ? weekDays - 0.5
    : weekDays;
}
