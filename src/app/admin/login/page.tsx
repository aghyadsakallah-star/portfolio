"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const ADMIN_PASSWORD = "123456";

  const handleLogin = () => {
    setLoading(true);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem("admin-auth", "true");

        router.push("/admin/videos");
      } else {
        alert("Wrong password");
      }

      setLoading(false);
    }, 700);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05050A] px-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff14,transparent_35%),radial-gradient(circle_at_80%_20%,#ffffff10,transparent_30%)]" />

      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/40 backdrop-blur-3xl md:p-8">
        <div className="mb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/35 md:text-xs">
            Secure Access
          </p>

          <h1 className="mt-3 text-3xl font-black md:text-4xl">
            Admin Login
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/45">
            Login to manage videos, categories and your cinematic portfolio.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/40">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25 focus:bg-white/[0.08]"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white px-5 py-4 text-sm font-black text-black transition duration-300 hover:scale-[1.02] hover:bg-white/90 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </div>

        <div className="mt-7 flex items-center justify-center gap-2 text-xs text-white/25">
          <div className="h-[1px] w-full bg-white/10" />
          Protected
          <div className="h-[1px] w-full bg-white/10" />
        </div>
      </div>
    </main>
  );
}