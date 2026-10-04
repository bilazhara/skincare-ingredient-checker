export type RiskLevel = "safe" | "caution" | "avoid";

export interface Ingredient {
  readonly id: string;
  name: string;
  function: string;
  risk: RiskLevel;
  note?: string;
}

export type CombineResult = "good" | "caution" | "avoid";

export interface Combination {
  readonly id: string;
  a: string;
  b: string;
  result: CombineResult;
  note: string;
}
