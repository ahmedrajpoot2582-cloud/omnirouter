'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Check, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Key, 
  Lock, 
  Save, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

interface KeysState {
  gemini: string;
  groq: string;
  deepseek: string;
  openai: string;
  anthropic: string;
  openrouter: string;
}

export default function ProvidersPage() {
  const [keys, setKeys] = useState<KeysState>({
    gemini: '',
    groq: '',
    deepseek: '',
    openai: '',
    anthropic: '',
    openrouter: '',
  });

  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('omnirouter_custom_keys');
    if (stored) {
      try {
        setKeys(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('omnirouter_custom_keys', JSON.stringify(keys));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleVisibility = (id: string) => {
    setShowKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const providerDetails = [
    {
      id: 'gemini' as const,
      name: 'Google Gemini',
      envVar: 'GEMINI_API_KEY',
      placeholder: 'AIzaSy...',
      docsUrl: 'https://aistudio.google.com/app/apikey',
      freeTier: 'Yes — Generous Free Tier Available',
    },
    {
      id: 'groq' as const,
      name: 'Groq Cloud',
      envVar: 'GROQ_API_KEY',
      placeholder: 'gsk_...',
      docsUrl: 'https://console.groq.com/keys',
      freeTier: 'Yes — Fast Free Tier for Llama 3.3',
    },
    {
      id: 'deepseek' as const,
      name: 'DeepSeek AI',
      envVar: 'DEEPSEEK_API_KEY',
      placeholder: 'sk-...',
      docsUrl: 'https://platform.deepseek.com/api_keys',
      freeTier: 'Ultra Low-Cost V3 & R1',
    },
    {
      id: 'openai' as const,
      name: 'OpenAI',
      envVar: 'OPENAI_API_KEY',
      placeholder: 'sk-proj-...',
      docsUrl: 'https://platform.openai.com/api-keys',
      freeTier: 'Pay-as-you-go',
    },
    {
      id: 'anthropic' as const,
      name: 'Anthropic Claude',
      envVar: 'ANTHROPIC_API_KEY',
      placeholder: 'sk-ant-...',
      docsUrl: 'https://console.anthropic.com/settings/keys',
      freeTier: 'Pay-as-you-go',
    },
    {
      id: 'openrouter' as const,
      name: 'OpenRouter',
      envVar: 'OPENROUTER_API_KEY',
      placeholder: 'sk-or-v1-...',
      docsUrl: 'https://openrouter.ai/keys',
      freeTier: 'Aggregated 300+ Models',
    },
  ];

  const envTemplate = `ADMIN_EMAIL="admin@omnirouter.ai"
ADMIN_PASSWORD="omnirouter2026"
JWT_SECRET="${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}"
GEMINI_API_KEY="${keys.gemini}"
GROQ_API_KEY="${keys.groq}"
DEEPSEEK_API_KEY="${keys.deepseek}"
OPENAI_API_KEY="${keys.openai}"
ANTHROPIC_API_KEY="${keys.anthropic}"`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Key className="w-6 h-6 text-indigo-400" />
              Provider Credentials & Keys
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Add your API keys to enable seamless multi-provider routing and auto-fallback.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved Successfully!' : 'Save Keys'}</span>
          </button>
        </div>

        {/* Keys List */}
        <div className="space-y-4">
          {providerDetails.map((p) => {
            const isVisible = showKey[p.id];
            return (
              <div
                key={p.id}
                className="glass-panel rounded-2xl p-5 border border-slate-800/80 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{p.name}</span>
                    <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      {p.envVar}
                    </span>
                  </div>

                  <a
                    href={p.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                  >
                    <span>Get Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={isVisible ? 'text' : 'password'}
                    value={keys[p.id]}
                    onChange={(e) => setKeys({ ...keys, [p.id]: e.target.value })}
                    placeholder={p.placeholder}
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility(p.id)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{p.freeTier}</span>
                  {keys[p.id] ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Configured
                    </span>
                  ) : (
                    <span className="text-slate-500">Not set</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Vercel Environment Variables Card */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">
                Vercel Project Environment Variables
              </h2>
            </div>
            <button
              onClick={copyEnv}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
            >
              {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEnv ? 'Copied' : 'Copy All Env'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            For maximum security and 24/7 availability across devices, add these environment variables into your Vercel Project Settings (<span className="text-indigo-300 font-mono">Settings &rarr; Environment Variables</span>).
          </p>

          <pre className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
            {envTemplate}
          </pre>
        </div>
      </main>
    </div>
  );
}

