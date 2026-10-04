import { Combination, RiskLevel } from "./types";

export const riskColor = (risk: RiskLevel): string => {
  switch (risk) {
    case "safe":
      return "#2E7D32";

    case "caution":
      return "#F57C00";

    case "avoid":
      return "#D32F2F";

    default:
      return "#777777";
  }
};

export const checkCombination = (
  list: Combination[],
  x: string,
  y: string
): Combination | undefined => {
  return list.find(
    (item) =>
      (item.a === x && item.b === y) ||
      (item.a === y && item.b === x)
  );
};