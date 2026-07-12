export const ROLES = {
  FLEET_MANAGER: "FleetManager",
  DRIVER: "Driver",
  SAFETY_OFFICER: "SafetyOfficer",
  FINANCIAL_ANALYST: "FinancialAnalyst",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<RoleName, string> = {
  [ROLES.FLEET_MANAGER]: "Fleet Manager",
  [ROLES.DRIVER]: "Driver",
  [ROLES.SAFETY_OFFICER]: "Safety Officer",
  [ROLES.FINANCIAL_ANALYST]: "Financial Analyst",
};
