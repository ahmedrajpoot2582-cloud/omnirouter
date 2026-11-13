'use client';

import { useState } from 'react';
import { Lock, ShieldAlert, Sparkles, Zap, ArrowRight, Eye, EyeOff, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('omnirouter2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillDefaultPassword = () => {
    setPassword('omnirouter2026');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Incorrect password.');
      }

      // Hard redirect ensures session cookie is received and loaded immediately
      window.location.href = '/';
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#070b14]">
      {/* Background radial glow */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -bottom-40 -right-40" />

      <div className="w-full max-w-md relative z-10">
        {/* Gateway Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30 mb-3 ring-8 ring-indigo-500/10">
            <Zap className="w-7 h-7 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            OmniRouter AI
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Enter Management Password to Access Dashboard
          </p>
        </div>

        {/* Password Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800/80 bg-slate-900/70">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-800">
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Instance Security
            </span>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
              Protected Gateway
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-300 text-xs leading-relaxed animate-in fade-in duration-200">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Credential Helper */}
          <div className="mb-5 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-between">
            <div className="text-[11px] text-slate-300">
              <span className="text-slate-500">Default Password:</span>{' '}
              <span className="font-mono text-indigo-300 font-semibold">omnirouter2026</span>
            </div>
            <button
              type="button"
              onClick={fillDefaultPassword}
              className="text-[11px] font-medium text-indigo-300 hover:text-white bg-indigo-600/40 hover:bg-indigo-600 px-2.5 py-1.5 rounded-lg border border-indigo-500/30 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3 h-3" />
              <span>Auto-Fill</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Management Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="Enter management password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Unlocking Dashboard...</span>
                </>
              ) : (
                <>
                  <span>Unlock OmniRouter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              Only password required &bull; No username or email needed
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-600">
          OmniRouter &copy; 2026 &bull; Cloud Deployed on Vercel
        </p>
      </div>
    </div>
  );
}
