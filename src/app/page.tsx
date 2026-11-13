import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { AVAILABLE_MODELS } from '@/lib/router';
import { 
  Activity, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  Cpu, 
  Globe2, 
  Key, 
  Layers, 
  Lock, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles, 
  Zap 
} from 'lucide-react';

export default function DashboardPage() {
  const providers = [
    { name: 'Google Gemini', id: 'gemini', tier: 'Free & Paid', badge: 'Ultra Fast', color: 'from-blue-500/20 to-cyan-500/10' },
    { name: 'Groq Cloud', id: 'groq', tier: 'Fastest Llama 3.3', badge: 'Sub-200ms', color: 'from-orange-500/20 to-amber-500/10' },
    { name: 'DeepSeek', id: 'deepseek', tier: 'Reasoning & V3', badge: 'Cost Efficient', color: 'from-sky-500/20 to-blue-500/10' },
    { name: 'OpenAI', id: 'openai', tier: 'GPT-4o & Mini', badge: 'Standard', color: 'from-emerald-500/20 to-teal-500/10' },
    { name: 'Anthropic', id: 'anthropic', tier: 'Claude 3.7 / 3.5', badge: 'Reasoning & Coding', color: 'from-purple-500/20 to-pink-500/10' },
    { name: 'OpenRouter', id: 'openrouter', tier: 'Universal 300+ models', badge: 'Global Pool', color: 'from-indigo-500/20 to-violet-500/10' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800/80 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vercel Cloud Deployment Active</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Unified Multi-Model <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI Gateway</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Your private OmniRouter instance is live. Seamlessly route requests across Gemini, Groq, DeepSeek, Claude, and OpenAI with automatic error recovery and zero rate-limit downtime.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/playground"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Open Playground</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/providers"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-all cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>Configure API Keys</span>
              </Link>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none hidden lg:block" />
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Gateway Status</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Online & Ready
            </p>
            <p className="mt-1 text-xs text-slate-500">Listening on Vercel Serverless</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Available Models</span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              {AVAILABLE_MODELS.length} Models
            </p>
            <p className="mt-1 text-xs text-slate-500">4 virtual auto-combos enabled</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Auto Fallback</span>
              <RefreshCw className="w-4 h-4 text-purple-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">Self-Healing</p>
            <p className="mt-1 text-xs text-slate-500">Auto reroute on 429 & timeout</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Auth Access</span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">Admin Only</p>
            <p className="mt-1 text-xs text-slate-500">Zero public registration</p>
          </div>
        </div>

        {/* Integration Endpoint Info */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">
                OpenAI-Compatible Drop-In Proxy
              </h2>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium">
              API Active
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400">
            You can point any tool (Cursor, Claude Code, Cline, OpenAI Python SDK, LangChain) directly to your live Vercel endpoint:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1">
              <span className="text-slate-500">Base URL:</span>
              <p className="text-indigo-300 font-semibold truncate select-all">
                https://your-omnirouter.vercel.app/api/v1
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1">
              <span className="text-slate-500">Model ID:</span>
              <p className="text-purple-300 font-semibold truncate select-all">
                auto (or auto/fast, auto/coding, gemini-2.0-flash)
              </p>
            </div>
          </div>
        </div>

        {/* Supported AI Providers Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Connected Providers & Pools
            </h2>
            <Link href="/providers" className="text-xs text-indigo-400 hover:text-indigo-300">
              Manage Keys &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((p) => (
              <div
                key={p.id}
                className={`glass-card rounded-2xl p-5 border border-slate-800/80 bg-gradient-to-br ${p.color}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white text-sm">{p.name}</h3>
                  <span className="text-[10px] font-medium bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                    {p.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{p.tier}</p>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Available
                  </span>
                  <Link
                    href="/providers"
                    className="hover:text-white transition-colors"
                  >
                    Setup Key &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

