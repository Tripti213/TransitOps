import type { ComponentType } from "react";
import {
  FiGrid,
  FiTruck,
  FiUsers,
  FiMap,
  FiTool,
  FiDroplet,
  FiFileText,
  FiBarChart2,
} from "react-icons/fi";
import { ROLES, type RoleName } from "./roles";

export interface NavItem {
  key: string;
  to: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
}

// The tabs a fleet manager can configure per-role visibility for in Settings.
// "Settings" itself is deliberately excluded — it's always Fleet Manager only,
// so a role can't accidentally lock everyone out of the settings page.
export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { key: "vehicles", to: "/vehicles", label: "Vehicles", icon: FiTruck },
  { key: "drivers", to: "/drivers", label: "Drivers", icon: FiUsers },
  { key: "trips", to: "/trips", label: "Trips", icon: FiMap },
  { key: "maintenance", to: "/maintenance", label: "Maintenance", icon: FiTool },
  { key: "fuel", to: "/fuel", label: "Fuel Logs", icon: FiDroplet },
  { key: "expenses", to: "/expenses", label: "Expenses", icon: FiFileText },
  { key: "reports", to: "/reports", label: "Reports", icon: FiBarChart2 },
];

export type RolePermissions = Record<RoleName, string[]>;

const ALL_TAB_KEYS = NAV_ITEMS.map((item) => item.key);

// Mirrors the access rules that existed before this settings page: every tab
// visible to every role, except Reports which was Fleet Manager / Financial
// Analyst only.
export const DEFAULT_PERMISSIONS: RolePermissions = {
  [ROLES.FLEET_MANAGER]: [...ALL_TAB_KEYS],
  [ROLES.DRIVER]: ALL_TAB_KEYS.filter((key) => key !== "reports"),
  [ROLES.SAFETY_OFFICER]: ALL_TAB_KEYS.filter((key) => key !== "reports"),
  [ROLES.FINANCIAL_ANALYST]: [...ALL_TAB_KEYS],
};
