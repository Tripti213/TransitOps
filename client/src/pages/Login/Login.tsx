// PLACEHOLDER — replace with real login form + OAuth flow.
// Wire submit to useAuth().login(email, password) from hooks/useAuth,
// then navigate("/dashboard") on success.
export default function Login() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--code-bg)]/30">
      <div className="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] p-8">
        <h1 className="mb-6 text-2xl font-medium text-[var(--text-h)]">TransitOps</h1>
        <p className="text-sm text-[var(--text)]">TODO: build login form here.</p>
      </div>
    </div>
  );
}
