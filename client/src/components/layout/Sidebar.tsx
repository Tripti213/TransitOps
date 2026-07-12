import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROLES, type RoleName } from "../../constants/roles";
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

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  allowedRoles?: RoleName[]; // omit = visible to everyone
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/vehicles", label: "Vehicles", icon: FiTruck },
  { to: "/drivers", label: "Drivers", icon: FiUsers },
  { to: "/trips", label: "Trips", icon: FiMap },
  { to: "/maintenance", label: "Maintenance", icon: FiTool },
  { to: "/fuel", label: "Fuel Logs", icon: FiDroplet },
  { to: "/expenses", label: "Expenses", icon: FiFileText },
  {
    to: "/reports",
    label: "Reports",
    icon: FiBarChart2,
    allowedRoles: [ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST],
  },
];

export default function Sidebar() {
  const { hasRole } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.allowedRoles || hasRole(...item.allowedRoles)
  );

  return (
    <aside className="flex h-full w-60 flex-col border-r border-[var(--border)] bg-[var(--bg)] px-3 py-5">
      <div className="mb-6 px-2">
        <span className="text-lg font-semibold text-[var(--text-h)]">TransitOps</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-[var(--accent-bg)] text-[var(--accent)] font-medium"
                  : "text-[var(--text)] hover:bg-[var(--code-bg)]"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
