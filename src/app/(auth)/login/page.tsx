"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#0f2614] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#102a17] shadow-lg border border-white/10 p-6">
        <h1 className="text-2xl font-semibold mb-2 text-center">Sign in</h1>
        <p className="text-sm text-white/70 mb-6 text-center">
          Welcome back to <span className="font-semibold">Signls</span>.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-[#4CAF50]"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-[#4CAF50]"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400 bg-red-950/40 border border-red-500/40 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#1B5E20] hover:bg-[#287a2d] disabled:opacity-70 disabled:cursor-not-allowed py-2.5 text-sm font-medium shadow-sm shadow-black/40 transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-white/70">
          New here?{" "}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="font-medium text-[#81C784] hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}

