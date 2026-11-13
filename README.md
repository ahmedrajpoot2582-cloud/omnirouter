# ⚡ OmniRouter — Intelligent Multi-Model AI Gateway

A high-performance, resilient AI router and gateway optimized for **Vercel Serverless**. Seamlessly routes chat requests across **Google Gemini, Groq, DeepSeek, OpenAI, Anthropic Claude, and OpenRouter** with automatic self-healing fallback and sub-millisecond route decisions.

---

## 🔒 Private & Secure: Single Admin Access Only

OmniRouter is configured for **strict private administration**:
- **Zero Public Registration:** No signup page or public accounts.
- **Single-User Admin Gateway:** Access is guarded by protected session tokens and secure HTTP-only cookies.
- **Preconfigured Master Credentials:**
  - **Username / Email:** `admin@omnirouter.ai` (or `admin` / `ahmed`)
  - **Default Password:** `omnirouter2026` *(change in your Vercel Environment Variables)*

---

## 🚀 Features

- **🌐 Multi-Provider Auto-Routing:**
  - `auto`: Balanced routing with automatic failover across healthy providers.
  - `auto/fast`: Prioritizes ultra-low-latency models (Groq Llama 3.3, Gemini 2.0 Flash).
  - `auto/coding`: Prioritizes reasoning and code synthesis (Claude 3.7 Sonnet, DeepSeek V3, GPT-4o).
  - `auto/cheap`: Prioritizes free and ultra-low-cost tiers.
- **🛡️ Auto Fallback & Self-Healing:** If a provider hits a rate limit (HTTP 429) or is unavailable, the router automatically fails over to the next eligible provider in the chain.
- **🔌 OpenAI-Compatible API Proxy:**
  - `POST /api/v1/chat/completions`
  - `GET /api/v1/models`
  - Drop-in replacement for Cursor, Claude Code, Cline, OpenAI Python SDK, and LangChain.
- **💻 Sleek Dark Dashboard & Playground:** Live trace telemetry, latency meters, token estimation, and provider key manager.

---

## ⚙️ Environment Variables (Vercel)

Set these in your **Vercel Project Dashboard** (`Settings` → `Environment Variables`):

| Variable | Description | Default / Example |
|---|---|---|
| `ADMIN_EMAIL` | Master administrator login email | `admin@omnirouter.ai` |
| `ADMIN_PASSWORD` | Master administrator login password | `omnirouter2026` |
| `JWT_SECRET` | Secret key for signing admin sessions | *(random string)* |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `GROQ_API_KEY` | Groq Cloud API key (Free Llama 3.3) | `gsk_...` |
| `DEEPSEEK_API_KEY` | DeepSeek API key | `sk-...` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-...` |
| `ANTHROPIC_API_KEY`| Anthropic Claude API key | `sk-ant-...` |
| `OMNIROUTER_API_KEY`| Optional API key to lock `/api/v1` | *(optional)* |

---

## 🤖 Using with Coding IDEs & CLIs

### 1. Cursor / Cline / Roo Code
- **OpenAI Base URL:** `https://your-omnirouter.vercel.app/api/v1`
- **Model Name:** `auto` (or `auto/coding`, `gemini-2.0-flash`, `gpt-4o`)
- **API Key:** Any string (or your `OMNIROUTER_API_KEY` if set)

### 2. Python OpenAI SDK
```python
from openai import OpenAI

client = OpenAI(
    base_url="https://your-omnirouter.vercel.app/api/v1",
    api_key="omnirouter-key"
)

response = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Hello OmniRouter!"}]
)

print(response.choices[0].message.content)
```

---

## 🛠️ Local Development

```bash
git clone https://github.com/ahmedrajpoot2582-cloud/omnirouter.git
cd omnirouter
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

