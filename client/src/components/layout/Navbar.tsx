import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_LABELS } from "../../constants/roles";
import { FiLogOut, FiUser } from "react-icons/fi";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/vehicles": "Vehicle Registry",
  "/drivers": "Driver Management",
  "/trips": "Trip Management",
  "/maintenance": "Maintenance",
  "/fuel": "Fuel Logs",
  "/expenses": "Expenses",
  "/reports": "Reports & Analytics",
  "/profile": "Profile",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const title = PAGE_TITLES[location.pathname] ?? "TransitOps";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--bg)] px-6">
      <h1 className="text-xl font-medium text-[var(--text-h)]">{title}</h1>

      <div className="flex items-center gap-4">
        {user && (
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-[var(--text)] hover:bg-[var(--code-bg)]"
          >
            <FiUser size={16} />
            <span>{user.name}</span>
            <span className="text-xs text-[var(--text)] opacity-70">
              ({ROLE_LABELS[user.role]})
            </span>
          </button>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-[var(--text)] hover:bg-[var(--code-bg)]"
        >
          <FiLogOut size={16} />
          Log out
        </button>
      </div>
    </header>
  );
}
