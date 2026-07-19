// src/utils/riskRules.ts

export type RiskConsequence = "Trivial" | "Low" | "Medium" | "High" | "Severe";

const severityOrder = ["Trivial", "Low", "Medium", "High", "Severe"];

export interface NumericRangeRule<T> {
  lower: number;
  upper: number;
  value: T;
}

export const costConsequenceRules: NumericRangeRule<RiskConsequence>[] = [
  { lower: 0, upper: 100, value: "Trivial" },
  { lower: 100, upper: 1000, value: "Low" },
  { lower: 1000, upper: 5000, value: "Medium" },
  { lower: 5000, upper: 25000, value: "High" },
  { lower: 25000, upper: Infinity, value: "Severe" },
];

export function getCostConsequence(cost: number): RiskConsequence | "" {
  if (cost < 0 || Number.isNaN(cost)) return "";

  return (
    costConsequenceRules.find(rule => cost >= rule.lower && cost < rule.upper)?.value ?? ""
  );
}

export function getDaysBetween(start: string, end: string): number {
  return Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) /
    (1000 * 60 * 60 * 24)
  );
}

export function getScheduleConsequence(percentage: number): RiskConsequence | "" {
  if (percentage < 0 || Number.isNaN(percentage)) return "";

  return (
    scheduleConsequenceRules.find(
      rule => percentage >= rule.lower && percentage < rule.upper
    )?.value ?? ""
  );
}

export function getSchedulePercentage(
  scheduleStart: string,
  scheduledDate: string,
  scheduleEnd: string
) {
  if (!scheduleStart || !scheduledDate || !scheduleEnd)
    return {
      takenDays: null,
      actualDays: null,
      percentage: null,
    };
    if (new Date(scheduledDate) < new Date(scheduleStart))
  return {
    takenDays: null,
    actualDays: null,
    percentage: null,
  };

 const takenDays = getDaysBetween(scheduleStart, scheduleEnd);
const actualDays = getDaysBetween(scheduleStart, scheduledDate);

if (actualDays <= 0)
  return {
    takenDays,
    actualDays,
    percentage: 0,
  };

const extraDays = Math.max(0, takenDays - actualDays);

return {
  takenDays,
  actualDays,
  percentage: Number(((extraDays / actualDays) * 100).toFixed(2)),
};
}

export const scheduleConsequenceRules: NumericRangeRule<RiskConsequence>[] = [
  { lower: 0, upper: 5, value: "Trivial" },
  { lower: 5, upper: 10, value: "Low" },
  { lower: 10, upper: 25, value: "Medium" },
  { lower: 25, upper: 50, value: "High" },
  { lower: 50, upper: Infinity, value: "Severe" },
];


export const getRiskScope = (cost: string, schedule: string) =>
  severityOrder[Math.max(severityOrder.indexOf(cost), severityOrder.indexOf(schedule))] || "";