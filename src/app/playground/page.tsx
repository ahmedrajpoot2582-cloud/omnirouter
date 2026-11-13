'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { AVAILABLE_MODELS } from '@/lib/router';
import { ChatMessage } from '@/lib/types';
import { 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  Clock, 
  CornerDownLeft, 
  Cpu, 
  RefreshCw, 
  Send, 
  Sparkles, 
  Trash2, 
  User, 
  Zap 
} from 'lucide-react';

interface RouteTrace {
  selectedModel: string;
  providerUsed: string;
  latencyMs: number;
  tokens: { prompt: number; completion: number; total: number };
  attemptedChain: { provider: string; model: string; error?: string }[];
}

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am connected to your live OmniRouter. Send a prompt to test automatic multi-provider routing and fallback.',
    },
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [lastTrace, setLastTrace] = useState<RouteTrace | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Get any custom keys stored locally
      const storedKeys = localStorage.getItem('omnirouter_custom_keys');
      const customHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (storedKeys) {
        try {
          const parsed = JSON.parse(storedKeys);
          if (parsed.openai) customHeaders['x-openai-key'] = parsed.openai;
          if (parsed.anthropic) customHeaders['x-anthropic-key'] = parsed.anthropic;
          if (parsed.gemini) customHeaders['x-gemini-key'] = parsed.gemini;
          if (parsed.groq) customHeaders['x-groq-key'] = parsed.groq;
          if (parsed.deepseek) customHeaders['x-deepseek-key'] = parsed.deepseek;
          if (parsed.openrouter) customHeaders['x-openrouter-key'] = parsed.openrouter;
        } catch {}
      }

      const res = await fetch('/api/v1/chat/completions', {
        method: 'POST',
        headers: customHeaders,
        body: JSON.stringify({
          model: selectedModel,
          messages: updatedMessages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Router call failed');
      }

      const assistantContent = data.choices?.[0]?.message?.content || 'No response returned';
      setMessages([...updatedMessages, { role: 'assistant', content: assistantContent }]);

      setLastTrace({
        selectedModel: data.model,
        providerUsed: data.provider,
        latencyMs: data.routing?.latency_ms || 0,
        tokens: data.usage || { prompt: 0, completion: 0, total: 0 },
        attemptedChain: data.routing?.attempted_chain || [],
      });
    } catch (err: any) {
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: `❌ Error: ${err?.message || 'Something went wrong while routing.'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Conversation reset. Choose a model channel above and send a message.',
      },
    ]);
    setLastTrace(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left: Chat Section */}
        <div className="flex-1 flex flex-col glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl min-h-[600px]">
          {/* Header Controls */}
          <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/40">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-semibold text-white">Live Router Playground</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Model Selector */}
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                      {m.name} ({m.provider})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleClear}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((m, idx) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-3xl ${isAssistant ? '' : 'ml-auto flex-row-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-md ${
                      isAssistant
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-600'
                        : 'bg-slate-700'
                    }`}
                  >
                    {isAssistant ? <Zap className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      isAssistant
                        ? 'glass-card border border-slate-800 text-slate-200'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
                <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                <span>Evaluating fallback chain & querying best provider...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-800/80 bg-slate-900/40 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or test router fallback..."
              className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Router Telemetry & Trace Panel */}
        <div className="w-full lg:w-80 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Routing Decision
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                LKGP Active
              </span>
            </div>

            {lastTrace ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Selected Provider:</span>
                  <div className="font-semibold text-white capitalize flex items-center gap-1.5 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lastTrace.providerUsed}</span>
                    <span className="text-slate-500 text-[10px]">({lastTrace.selectedModel})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block mb-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> Latency
                    </span>
                    <span className="text-white font-mono font-semibold">{lastTrace.latencyMs} ms</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Tokens</span>
                    <span className="text-white font-mono font-semibold">{lastTrace.tokens.total}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Execution Chain:</span>
                  <div className="space-y-1.5">
                    {lastTrace.attemptedChain.map((step, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg text-[11px] border flex flex-col gap-0.5 ${
                          step.error
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono">
                          <span className="capitalize">{step.provider}</span>
                          <span className="text-[10px] text-slate-400">{step.model}</span>
                        </div>
                        {step.error && (
                          <span className="text-[10px] text-rose-400 line-clamp-1">{step.error}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                <RefreshCw className="w-6 h-6 mx-auto mb-2 text-slate-600 animate-spin" />
                <span>Send a prompt to view real-time latency and fallback execution steps.</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

