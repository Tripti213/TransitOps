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
    <div className="flex h-screen w-full items-center justify-center bg-[var(--code-bg)]/30">
      <div className="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] p-8">
        <h1 className="mb-1 text-2xl font-medium text-[var(--text-h)]">TransitOps</h1>
        <p className="mb-6 text-sm text-[var(--text)]/70">Sign in with your role to continue.</p>

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
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
