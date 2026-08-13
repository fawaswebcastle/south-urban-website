import { LoginForm } from "@/components/admin/LoginForm";
import { hasDatabase } from "@/lib/db";
import { isAuthConfigured } from "@/lib/auth";

export default function LoginPage() {
  const ready = hasDatabase && isAuthConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            South Urban admin
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-soft">Sign in to edit the site.</p>
        </div>

        {ready ? (
          <LoginForm />
        ) : (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-[13px] leading-relaxed text-amber-900">
            <p className="font-semibold">The admin is not configured yet.</p>
            <p className="mt-2">Set these in your environment, then restart:</p>
            <ul className="mt-2 space-y-1 font-mono text-[12px]">
              {!hasDatabase && <li>DATABASE_URL</li>}
              {!isAuthConfigured() && <li>ADMIN_SESSION_SECRET</li>}
            </ul>
            <p className="mt-3">
              Then run <code className="font-mono">npm run db:migrate</code>,{" "}
              <code className="font-mono">npm run seed</code> and{" "}
              <code className="font-mono">npm run admin:create</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
