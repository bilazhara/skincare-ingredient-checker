import { RiskLevel, Combination } from "./types";

export const riskColor = (risk: RiskLevel): string => {
  switch (risk) {
    case "safe":
      return "green";
    case "caution":
      return "orange";
    case "avoid":
      return "red";
  }
};

export const checkCombination = (
  list: Combination[],
  x: string,
  y: string
): Combination | undefined =>
  list.find((c) => (c.a === x && c.b === y) || (c.a === y && c.b === x));
