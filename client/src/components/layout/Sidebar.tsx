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
      <div className="mb-7 px-2">
        <span
          className="text-xl tracking-tight text-[var(--text-h)]"
          style={{ fontFamily: "var(--heading)" }}
        >
          TransitOps
        </span>
      </div>

      {/* Route line: a continuous dashed thread runs behind every stop,
          the active stop gets a filled waypoint dot. */}
      <nav className="relative flex flex-1 flex-col gap-1 pl-2">
        <div
          aria-hidden
          className="absolute top-2 bottom-2 left-[15px] w-px"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, var(--border) 0 4px, transparent 4px 9px)",
          }}
        />
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "text-[var(--accent)] font-medium"
                  : "text-[var(--text)] hover:bg-[var(--canvas)]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="relative z-10 flex h-3 w-3 shrink-0 items-center justify-center rounded-full transition-colors"
                  style={{
                    background: isActive ? "var(--accent)" : "var(--bg)",
                    border: `1.5px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                  }}
                />
                <Icon size={16} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
