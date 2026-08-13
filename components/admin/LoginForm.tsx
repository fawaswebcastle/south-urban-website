"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "Sign in failed.");
        return;
      }
      router.replace(params.get("next") || "/admin");
      router.refresh();
    } catch {
      setError("Sign in failed. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-xl border border-rule bg-card p-6 shadow-sm"
    >
      <div>
        <label htmlFor="email" className="block text-[13px] font-semibold text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-1.5 w-full rounded-lg border border-rule bg-paper/50 px-3 py-2.5 text-base text-ink outline-none transition-colors focus:border-green focus:bg-card sm:text-[14.5px]"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-[13px] font-semibold text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 w-full rounded-lg border border-rule bg-paper/50 px-3 py-2.5 text-base text-ink outline-none transition-colors focus:border-green focus:bg-card sm:text-[14.5px]"
        />
      </div>

      {error && (
        <p className="flex items-start gap-1.5 text-[12.5px] leading-relaxed text-red-600">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-green-deep disabled:opacity-60"
      >
        {busy && <Loader2 size={15} className="animate-spin" />}
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
