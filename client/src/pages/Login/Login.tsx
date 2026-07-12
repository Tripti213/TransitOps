import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { ROLES, ROLE_LABELS, type RoleName } from "../../constants/roles";

const fieldClasses =
  "w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text-h)] outline-none focus:border-[var(--accent)]";

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
    <div className="flex h-screen w-full">
      {/* LEFT PANEL — minimal, clear photo, light hover focus */}
      <div className="group relative hidden w-1/2 overflow-hidden bg-[var(--border)] lg:block">
        {/* background photo — barely blurred, sharpens fully on hover */}
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center blur-[3px] transition-all duration-500 ease-out group-hover:scale-100 group-hover:blur-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1400&auto=format&fit=crop')",
          }}
        />
        {/* gradient only where text sits, so the photo stays visible up top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          {/* logo mark */}
          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-white/25 bg-white/10 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none">
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

          {/* bold, minimal asymmetric wordmark */}
          <div>
            <h1 className="font-medium leading-[0.85] text-white">
              <span className="block text-[4rem]">Transit</span>
              <span className="ml-12 block text-[4.75rem] italic text-[var(--accent)]">Ops</span>
            </h1>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Fleet, trips, and cost — coordinated in one place.
            </p>

            <ul className="mt-10 space-y-2.5 text-sm text-white/80">
              {Object.values(ROLES).map((r) => (
                <li key={r} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                  {ROLE_LABELS[r]}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/40">TransitOps © 2026</p>
        </div>
      </div>

      {/* RIGHT PANEL — form (unchanged) */}
      <div className="flex w-full items-center justify-center bg-[var(--bg)] p-8 lg:w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="mb-1 text-lg font-normal text-[var(--text-h)]">Sign in to your account</h2>
          <p className="mb-6 text-sm text-[var(--text)]/70">Enter your credentials to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-[var(--text)]">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClasses}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[var(--text)]">Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldClasses}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[var(--text)]">Role</label>
              <select
                required
                value={role}
                onChange={(e) => setRole(e.target.value as RoleName)}
                className={fieldClasses}
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
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-[var(--accent)] py-2 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}