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
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-[var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Operations platform
          </span>

          <h1
            className="mt-5 text-[2.75rem] leading-[1.08] text-[var(--text-h)]"
            style={{ fontFamily: "var(--heading)" }}
          >
            <span className="font-medium">Run your fleet</span>
            <br />
            <span className="italic font-medium text-[var(--accent)]">
              without the spreadsheets.
            </span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text)]">
            Vehicles, drivers, trips, maintenance, and cost — one operations platform,
            built to enforce the rules that keep a fleet moving safely.
          </p>

          <div className="mt-9 space-y-2">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3.5 rounded-lg border border-transparent p-2.5 transition-colors hover:border-[var(--border)] hover:bg-[var(--bg)]/60"
              >
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

          {/* mini dashboard preview — a taste of the real product */}
          <div className="mt-8 flex gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)]/80 p-3 shadow-[var(--shadow)] backdrop-blur-sm">
            {[
              { label: "Active Trips", value: "12" },
              { label: "Fleet Utilization", value: "68%" },
              { label: "Drivers On Duty", value: "9" },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 rounded-lg bg-[var(--canvas)]/60 px-3 py-2.5">
                <p
                  className="text-lg leading-none text-[var(--text-h)]"
                  style={{ fontFamily: "var(--mono)" }}
                >
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[11px] leading-tight text-[var(--text)]/70">{stat.label}</p>
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

          <h2
            className="mt-6 text-[1.9rem] font-medium leading-tight text-[var(--text-h)] lg:mt-0"
            style={{ fontFamily: "var(--heading)" }}
          >
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