import { RiskLevel } from "./types";

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
