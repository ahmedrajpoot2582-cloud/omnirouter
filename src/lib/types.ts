export type ProviderId = 
  | 'openai' 
  | 'anthropic' 
  | 'gemini' 
  | 'groq' 
  | 'deepseek' 
  | 'openrouter' 
  | 'mistral';

export type RoutingStrategy = 'fallback' | 'cheapest' | 'fastest' | 'load_balance';

export interface ModelOption {
  id: string;
  name: string;
  provider: ProviderId;
  contextWindow: string;
  costPer1MInput: number; // in USD
  costPer1MOutput: number;
  speed: 'very fast' | 'fast' | 'moderate';
  isAvailable: boolean;
}

export interface ProviderConfig {
  id: ProviderId;
  name: string;
  baseUrl: string;
  apiKeyEnv: string;
  docsUrl: string;
  models: string[];
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface RouteExecutionResult {
  content: string;
  selectedModel: string;
  providerUsed: ProviderId;
  attemptedChain: { provider: ProviderId; model: string; error?: string }[];
  latencyMs: number;
  tokensEstimated: { prompt: number; completion: number; total: number };
}

