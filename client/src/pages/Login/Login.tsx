import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { ROLES, ROLE_LABELS, type RoleName } from "../../constants/roles";
import ThemeToggle from "../../components/common/ThemeToggle";
import { FiMail, FiLock, FiChevronDown, FiMapPin, FiTruck, FiShield } from "react-icons/fi";

const fieldClasses =
  "w-full rounded-md border border-[var(--border)] bg-[var(--canvas)]/40 py-2.5 pl-10 pr-3 text-sm text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:bg-transparent";

const FEATURES = [
  {
    icon: FiTruck,
    title: "Fleet at a glance",
    desc: "Live status on every vehicle — available, on trip, in the shop, or retired.",
  },
  {
    icon: FiMapPin,
    title: "Smart dispatch",
    desc: "Cargo, license, and status checks run automatically before a trip goes out.",
  },
  {
    icon: FiShield,
    title: "Compliance built in",
    desc: "Expiring licenses and safety scores surface before they become a problem.",
  },
];

// Demo accounts seeded by server/seed/seed.js — handy for a quick walkthrough.
const DEMO_ACCOUNTS: { role: RoleName; email: string }[] = [
  { role: ROLES.FLEET_MANAGER, email: "fleetmanager@transitops.com" },
  { role: ROLES.DRIVER, email: "driver@transitops.com" },
  { role: ROLES.SAFETY_OFFICER, email: "safety@transitops.com" },
  { role: ROLES.FINANCIAL_ANALYST, email: "finance@transitops.com" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleName | "">("");
  const [submitting, setSubmitting] = useState(false);

  const errorMessage = (err: unknown, fallback: string) => {
    if (typeof err === "object" && err !== null && "response" in err) {
      const response = (err as { response?: { data?: { message?: string } } }).response;
      if (response?.data?.message) return response.data.message;
    }
    return fallback;
  };

  const fillDemo = (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setEmail(account.email);
    setPassword("Passw0rd!");
    setRole(account.role);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setSubmitting(true);
    try {
      await login(email, password, role);
      navigate("/dashboard");
    } catch (err) {
      toast.error(errorMessage(err, "Invalid email or password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[var(--bg)]">
      {/* LEFT — small "homepage" panel: brand, tagline, feature highlights */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[var(--canvas)] p-12 lg:flex">
        {/* decorative route line + waypoints, echoes the sidebar motif */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
          viewBox="0 0 600 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M -40 640 C 140 560, 160 440, 320 420 S 560 260, 520 120"
            fill="none"
            stroke="var(--border)"
            strokeWidth="2"
            strokeDasharray="2 10"
            strokeLinecap="round"
          />
          <circle cx="-40" cy="640" r="5" fill="var(--status-info)" />
          <circle cx="320" cy="420" r="5" fill="var(--accent)" />
          <circle cx="520" cy="120" r="5" fill="var(--status-available)" />
        </svg>

        {/* soft warm glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--accent)" }}
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--accent)]" fill="none">
              <path d="M3 16V6a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path
                d="M14 10h4.3a1 1 0 0 1 .86.49l2.34 3.9a1 1 0 0 1 .14.51V16a1 1 0 0 1-1 1H14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <circle cx="7" cy="17.5" r="1.75" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="17.5" cy="17.5" r="1.75" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </div>
          <span className="text-lg tracking-tight text-[var(--text-h)]" style={{ fontFamily: "var(--heading)" }}>
            TransitOps
          </span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1
            className="text-[2.75rem] font-medium leading-[1.05] text-[var(--text-h)]"
            style={{ fontFamily: "var(--heading)" }}
          >
            Run your fleet without the spreadsheets.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text)]">
            Vehicles, drivers, trips, maintenance, and cost — one operations platform,
            built to enforce the rules that keep a fleet moving safely.
          </p>

          <div className="mt-10 space-y-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-bg)] text-[var(--accent)]">
                  <Icon size={17} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-h)]">{title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--text)]/80">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-[var(--text)]/50">TransitOps © 2026</p>
      </div>

      {/* RIGHT — sign in */}
      <div className="relative flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          <span
            className="text-lg tracking-tight text-[var(--text-h)] lg:hidden"
            style={{ fontFamily: "var(--heading)" }}
          >
            TransitOps
          </span>

          <h2 className="mt-6 text-2xl font-medium text-[var(--text-h)] lg:mt-0" style={{ fontFamily: "var(--heading)" }}>
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm text-[var(--text)]/70">Sign in to your operations dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-[var(--text)]">Email</label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)]/50" size={15} />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@transitops.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClasses}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-[var(--text)]">Password</label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text)]/50" size={15} />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldClasses}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-[var(--text)]">Role</label>
              <div className="relative">
                <select
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value as RoleName)}
                  className={`${fieldClasses} appearance-none pl-3 pr-9`}
                >
                  <option value="" disabled>
                    Select your role...
                  </option>
                  {Object.values(ROLES).map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text)]/50"
                  size={15}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-[var(--accent)] py-2.5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-7 border-t border-[var(--border)] pt-5">
            <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-[var(--text)]/50">
              Quick demo access
            </p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => fillDemo(account)}
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text)] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
                >
                  {ROLE_LABELS[account.role]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}