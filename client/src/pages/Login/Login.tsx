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
      <div className="hidden w-1/2 flex-col justify-between bg-[var(--border)] p-12 lg:flex">
        <div>
          <div className="mb-6 h-14 w-14 overflow-hidden rounded-md border border-[var(--accent-border)] bg-[var(--accent-bg)]">
            <img
              src="https://images.unsplash.com/photo-1676748219774-8d53453b30e7?q=80&w=200&h=200&fit=crop&auto=format"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <h1
            className="font-medium tracking-tight text-[var(--text-h)]"
            style={{ fontSize: "3.75rem", lineHeight: 1 }}
          >
            TransitOps
          </h1>
          <p className="mt-3 text-sm text-[var(--text)]/70">Smart Transport Operations Platform</p>
        </div>

        <div>
          <p className="mb-8 text-sm leading-relaxed text-[var(--text)]/80">
            TransitOps helps fleet managers, drivers, safety officers, and financial analysts
            coordinate vehicles, trips, maintenance, and costs from one connected platform.
          </p>
          <h2 className="mb-4 text-lg text-[var(--text-h)]">One login, four roles</h2>
          <ul className="space-y-3 text-sm text-[var(--text)]">
            {Object.values(ROLES).map((r) => (
              <li key={r} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                {ROLE_LABELS[r]}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-[var(--text)]/50">TransitOps © 2026</p>
      </div>

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
