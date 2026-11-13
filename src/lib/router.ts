import { ChatMessage, ModelOption, ProviderId, RouteExecutionResult, RoutingStrategy } from './types';

export const AVAILABLE_MODELS: ModelOption[] = [
  // Virtual Auto Routing Combos
  {
    id: 'auto',
    name: 'Auto-Balanced (Smart Fallback)',
    provider: 'groq',
    contextWindow: '128k',
    costPer1MInput: 0.15,
    costPer1MOutput: 0.60,
    speed: 'very fast',
    isAvailable: true,
  },
  {
    id: 'auto/fast',
    name: 'Auto-Fast (Ultra Low Latency)',
    provider: 'groq',
    contextWindow: '128k',
    costPer1MInput: 0.10,
    costPer1MOutput: 0.40,
    speed: 'very fast',
    isAvailable: true,
  },
  {
    id: 'auto/coding',
    name: 'Auto-Coding (Max Quality & Reasoning)',
    provider: 'anthropic',
    contextWindow: '200k',
    costPer1MInput: 3.00,
    costPer1MOutput: 15.00,
    speed: 'fast',
    isAvailable: true,
  },
  {
    id: 'auto/cheap',
    name: 'Auto-Cheap (Cost-Optimized / Free Tiers)',
    provider: 'gemini',
    contextWindow: '1M',
    costPer1MInput: 0.075,
    costPer1MOutput: 0.30,
    speed: 'very fast',
    isAvailable: true,
  },
  // Specific Models
  {
    id: 'gemini-2.0-flash',
    name: 'Google Gemini 2.0 Flash',
    provider: 'gemini',
    contextWindow: '1M',
    costPer1MInput: 0.10,
    costPer1MOutput: 0.40,
    speed: 'very fast',
    isAvailable: true,
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Google Gemini 1.5 Pro',
    provider: 'gemini',
    contextWindow: '2M',
    costPer1MInput: 1.25,
    costPer1MOutput: 5.00,
    speed: 'moderate',
    isAvailable: true,
  },
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Groq Llama 3.3 70B',
    provider: 'groq',
    contextWindow: '128k',
    costPer1MInput: 0.59,
    costPer1MOutput: 0.79,
    speed: 'very fast',
    isAvailable: true,
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek-V3 Chat',
    provider: 'deepseek',
    contextWindow: '64k',
    costPer1MInput: 0.14,
    costPer1MOutput: 0.28,
    speed: 'fast',
    isAvailable: true,
  },
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    provider: 'openai',
    contextWindow: '128k',
    costPer1MInput: 2.50,
    costPer1MOutput: 10.00,
    speed: 'fast',
    isAvailable: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'OpenAI GPT-4o Mini',
    provider: 'openai',
    contextWindow: '128k',
    costPer1MInput: 0.15,
    costPer1MOutput: 0.60,
    speed: 'very fast',
    isAvailable: true,
  },
  {
    id: 'claude-3-7-sonnet',
    name: 'Anthropic Claude 3.7 Sonnet',
    provider: 'anthropic',
    contextWindow: '200k',
    costPer1MInput: 3.00,
    costPer1MOutput: 15.00,
    speed: 'fast',
    isAvailable: true,
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Anthropic Claude 3.5 Haiku',
    provider: 'anthropic',
    contextWindow: '200k',
    costPer1MInput: 0.80,
    costPer1MOutput: 4.00,
    speed: 'very fast',
    isAvailable: true,
  },
];

interface ProviderCredentials {
  openai?: string;
  anthropic?: string;
  gemini?: string;
  groq?: string;
  deepseek?: string;
  openrouter?: string;
  mistral?: string;
}

export function getEffectiveKey(provider: ProviderId, customKeys?: ProviderCredentials): string | undefined {
  if (customKeys?.[provider]) {
    return customKeys[provider];
  }
  switch (provider) {
    case 'openai':
      return process.env.OPENAI_API_KEY;
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY;
    case 'gemini':
      return process.env.GEMINI_API_KEY;
    case 'groq':
      return process.env.GROQ_API_KEY;
    case 'deepseek':
      return process.env.DEEPSEEK_API_KEY;
    case 'openrouter':
      return process.env.OPENROUTER_API_KEY;
    case 'mistral':
      return process.env.MISTRAL_API_KEY;
    default:
      return undefined;
  }
}

// Fallback Chain Resolution
function resolveRoutingChain(
  requestedModel: string,
  strategy: RoutingStrategy = 'fallback'
): { provider: ProviderId; model: string }[] {
  if (requestedModel === 'auto' || requestedModel === 'auto/fast') {
    return [
      { provider: 'groq', model: 'llama-3.3-70b-versatile' },
      { provider: 'gemini', model: 'gemini-2.0-flash' },
      { provider: 'deepseek', model: 'deepseek-chat' },
      { provider: 'openai', model: 'gpt-4o-mini' },
    ];
  }

  if (requestedModel === 'auto/coding') {
    return [
      { provider: 'anthropic', model: 'claude-3-7-sonnet' },
      { provider: 'deepseek', model: 'deepseek-chat' },
      { provider: 'openai', model: 'gpt-4o' },
      { provider: 'gemini', model: 'gemini-1.5-pro' },
    ];
  }

  if (requestedModel === 'auto/cheap') {
    return [
      { provider: 'gemini', model: 'gemini-2.0-flash' },
      { provider: 'groq', model: 'llama-3.3-70b-versatile' },
      { provider: 'deepseek', model: 'deepseek-chat' },
      { provider: 'openai', model: 'gpt-4o-mini' },
    ];
  }

  // Specific model requested -> place it first, with smart fallbacks
  const target = AVAILABLE_MODELS.find((m) => m.id === requestedModel);
  if (target) {
    const chain: { provider: ProviderId; model: string }[] = [{ provider: target.provider, model: target.id }];
    // Append standard backups
    if (target.provider !== 'gemini') chain.push({ provider: 'gemini', model: 'gemini-2.0-flash' });
    if (target.provider !== 'groq') chain.push({ provider: 'groq', model: 'llama-3.3-70b-versatile' });
    if (target.provider !== 'openai') chain.push({ provider: 'openai', model: 'gpt-4o-mini' });
    return chain;
  }

  // Fallback default
  return [
    { provider: 'gemini', model: 'gemini-2.0-flash' },
    { provider: 'groq', model: 'llama-3.3-70b-versatile' },
    { provider: 'openai', model: 'gpt-4o-mini' },
  ];
}

// Callers for each Provider
async function callOpenAICompatible(
  endpoint: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  temperature = 0.7
): Promise<string> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callAnthropic(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  temperature = 0.7
): Promise<string> {
  const systemMessage = messages.find((m) => m.role === 'system')?.content || '';
  const conversationMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role, content: m.content }));

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      system: systemMessage || undefined,
      messages: conversationMessages,
      max_tokens: 4096,
      temperature,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic HTTP ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || '';
}

async function callGemini(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  temperature = 0.7
): Promise<string> {
  // Convert OpenAI chat format to Gemini contents
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const systemInstruction = messages.find((m) => m.role === 'system')?.content;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      generationConfig: { temperature },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini HTTP ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// Master Route Dispatcher
export async function executeRoute(
  requestedModel: string,
  messages: ChatMessage[],
  customKeys?: ProviderCredentials,
  strategy: RoutingStrategy = 'fallback'
): Promise<RouteExecutionResult> {
  const startTime = performance.now();
  const chain = resolveRoutingChain(requestedModel, strategy);
  const attemptedChain: { provider: ProviderId; model: string; error?: string }[] = [];

  for (const step of chain) {
    const key = getEffectiveKey(step.provider, customKeys);
    
    if (!key) {
      attemptedChain.push({
        provider: step.provider,
        model: step.model,
        error: `No API key configured for ${step.provider}`,
      });
      continue;
    }

    try {
      let content = '';

      switch (step.provider) {
        case 'openai':
          content = await callOpenAICompatible(
            'https://api.openai.com/v1/chat/completions',
            key,
            step.model,
            messages
          );
          break;
        case 'groq':
          content = await callOpenAICompatible(
            'https://api.groq.com/openai/v1/chat/completions',
            key,
            step.model,
            messages
          );
          break;
        case 'deepseek':
          content = await callOpenAICompatible(
            'https://api.deepseek.com/chat/completions',
            key,
            step.model,
            messages
          );
          break;
        case 'openrouter':
          content = await callOpenAICompatible(
            'https://openrouter.ai/api/v1/chat/completions',
            key,
            step.model,
            messages
          );
          break;
        case 'mistral':
          content = await callOpenAICompatible(
            'https://api.mistral.ai/v1/chat/completions',
            key,
            step.model,
            messages
          );
          break;
        case 'anthropic':
          content = await callAnthropic(key, step.model, messages);
          break;
        case 'gemini':
          content = await callGemini(key, step.model, messages);
          break;
      }

      attemptedChain.push({ provider: step.provider, model: step.model });

      const latencyMs = Math.round(performance.now() - startTime);
      const promptChars = messages.reduce((acc, m) => acc + m.content.length, 0);
      const completionChars = content.length;

      return {
        content,
        selectedModel: step.model,
        providerUsed: step.provider,
        attemptedChain,
        latencyMs,
        tokensEstimated: {
          prompt: Math.ceil(promptChars / 4),
          completion: Math.ceil(completionChars / 4),
          total: Math.ceil((promptChars + completionChars) / 4),
        },
      };
    } catch (err: any) {
      attemptedChain.push({
        provider: step.provider,
        model: step.model,
        error: err?.message || 'Execution failed',
      });
      // Continue to next provider in fallback chain
    }
  }

  // If all failed, provide a structured error or simulation response explaining keys needed
  const latencyMs = Math.round(performance.now() - startTime);
  const failureReasons = attemptedChain.map((c) => `${c.provider} (${c.model}): ${c.error}`).join('\n• ');

  return {
    content: `⚠️ **OmniRouter Notice: No Active Provider Responded**\n\nThe request attempted the following routing chain:\n• ${failureReasons}\n\n👉 **To fix this:** Go to the **Providers** tab in your dashboard and connect at least one provider API key (e.g. Gemini, Groq, OpenAI, or Anthropic), or add your keys in your Vercel Environment Variables.`,
    selectedModel: requestedModel,
    providerUsed: chain[0].provider,
    attemptedChain,
    latencyMs,
    tokensEstimated: { prompt: 0, completion: 0, total: 0 },
  };
}
