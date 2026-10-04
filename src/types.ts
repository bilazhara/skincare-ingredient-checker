export type RiskLevel = "safe" | "caution" | "avoid";

export interface Ingredient {
  readonly id: string;
  name: string;
  function: string;
  risk: RiskLevel;
  note?: string;
}
