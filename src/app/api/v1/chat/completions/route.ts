import { NextRequest, NextResponse } from 'next/server';
import { executeRoute } from '@/lib/router';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model = 'auto', messages = [], temperature = 0.7 } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: { message: 'Messages array is required', type: 'invalid_request_error' } },
        { status: 400 }
      );
    }

    // Header overrides for custom API keys if sent
    const customKeys = {
      openai: request.headers.get('x-openai-key') || undefined,
      anthropic: request.headers.get('x-anthropic-key') || undefined,
      gemini: request.headers.get('x-gemini-key') || undefined,
      groq: request.headers.get('x-groq-key') || undefined,
      deepseek: request.headers.get('x-deepseek-key') || undefined,
      openrouter: request.headers.get('x-openrouter-key') || undefined,
    };

    const result = await executeRoute(model, messages, customKeys);

    return NextResponse.json({
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: result.selectedModel,
      provider: result.providerUsed,
      routing: {
        latency_ms: result.latencyMs,
        attempted_chain: result.attemptedChain,
      },
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: result.content,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: result.tokensEstimated.prompt,
        completion_tokens: result.tokensEstimated.completion,
        total_tokens: result.tokensEstimated.total,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { message: err?.message || 'Router processing error', type: 'api_error' } },
      { status: 500 }
    );
  }
}
