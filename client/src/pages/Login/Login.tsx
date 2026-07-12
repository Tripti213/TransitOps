import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setSubmitting(true);
    try {
      await login(email, password);
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
        <h1 className="mb-6 text-2xl font-medium text-[var(--text-h)]">TransitOps</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-[var(--text)]">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text-h)] outline-none focus:border-[var(--accent)]"
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
              className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--text-h)] outline-none focus:border-[var(--accent)]"
            />
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
