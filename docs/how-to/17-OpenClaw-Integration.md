---
title: OpenClaw Integration via OpenResponses API
description: Learn how to expose a KaibanJS multi-agent team as an OpenClaw agent backend using the OpenResponses API specification for WhatsApp, Telegram, Discord, and other messaging channels.
---

> Expose any KaibanJS multi-agent team as an **OpenClaw** agent backend using the **OpenResponses API specification** — delivering the full power of KaibanJS orchestration directly to WhatsApp, Telegram, Discord, and every messaging channel OpenClaw supports.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Introduction

**OpenClaw** is a messaging gateway that connects AI agents to the channels where users already live — WhatsApp, Telegram, Discord, and more — through a single, unified interface. Rather than building a separate bot for each platform, you configure OpenClaw once and let it handle channel-specific complexity: webhooks, auth, message formatting, and rate limits.

OpenClaw natively speaks the **OpenResponses API specification** — an open standard modeled after the OpenAI Responses API — making it straightforward to swap the AI backend behind any agent. This is where KaibanJS fits in: instead of a single LLM call, you can plug in a full **multi-agent pipeline** that researches, writes, reviews, and delivers structured outputs — all transparently, from the user's perspective on any channel.

If you prefer **tool-based delegation** (the main OpenClaw agent calls a single tool that runs your Team) instead of exposing an HTTP **model** endpoint, use the [**OpenClaw native plugin**](./18-OpenClaw-Native-Plugin.md) (`@kaibanjs/kaibanjs-plugin` / `kaiban_run_team`).

:::tip[Try the Demo!]
See the OpenClaw integration in action with the playground implementation. [View the example](https://www.kaibanjs.com/examples/kaibanjs-team-openclaw-openresponses) and [explore the source code](https://github.com/kaiban-ai/KaibanJS/tree/main/playground/openclaw-openresponses) on GitHub.
:::

:::warning[Server-Side Only]
The OpenClaw–KaibanJS adapter must run server-side (Node.js) to implement the OpenResponses HTTP API, handle authentication, and execute the KaibanJS team. It is not intended for browser environments.
:::

## Understanding the Integration

### Why OpenClaw + KaibanJS?

- **Reach**: WhatsApp, Telegram, and Discord have billions of users combined. OpenClaw makes every KaibanJS team accessible on these platforms without per-channel code.
- **Orchestration as backend**: The OpenResponses spec was designed for single models. The adapter proves that a full multi-agent workflow can satisfy the same contract — KaibanJS becomes a drop-in replacement for any OpenAI-compatible backend.
- **Protocol interoperability**: Alongside A2A and MCP, OpenResponses is another open standard that KaibanJS can speak, fitting into the ecosystem of interoperable AI tools.
- **Swappable teams**: The adapter is decoupled from the team definition. Change your pipeline in one file; the gateway adapter stays the same.

### Architecture Overview

```
User (WhatsApp / Telegram / Discord)
  → OpenClaw Gateway
  → POST http://<adapter>:3100/v1/responses
  → KaibanJS Team.start({ inputs: { topic: userMessage } })
  → OpenResponses JSON or SSE response
  → OpenClaw forwards the response to the user
```

The adapter is a lightweight **Express.js server** that implements `POST /v1/responses` following the OpenResponses specification. OpenClaw treats it as a custom model provider — routing user messages from any channel into a KaibanJS `team.start()` call and returning the result in the correct format.

## Implementation Guide

### Step 1: Clone and Install

Use the playground from the main KaibanJS repo or replicate its structure in your own project:

```bash
git clone https://github.com/kaiban-ai/KaibanJS.git
cd KaibanJS/playground/openclaw-openresponses
npm install
```

Dependencies include `express`, `dotenv`, and `kaibanjs`. The playground uses TypeScript with `tsx` for development.

### Step 2: Configure Environment

Copy the example environment file and set the required variables:

```bash
cp .env.example .env
```

Configure the following:

| Variable | Description |
| -------- | ----------- |
| `PORT` | Server port (default: `3100`) |
| `KAIBAN_OPENRESPONSES_SECRET` | Shared secret for Bearer token auth (generate with `openssl rand -base64 32`) |
| `OPENAI_API_KEY` | API key for the default Content Creation Team (or your team's LLM provider) |

Leave `KAIBAN_OPENRESPONSES_SECRET` empty only for local testing; the adapter will skip authentication.

### Step 3: Adapter Server and Endpoints

The server exposes two endpoints:

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/health` | Health check (no auth) |
| `POST` | `/v1/responses` | OpenResponses API (Bearer token auth) |

Request handling flow:

1. **Normalize body**: OpenClaw may send the payload wrapped in a `.body` property; the adapter unwraps it to get the standard OpenResponses payload.
2. **Extract user message**: The `input` field can be a string or an array of message items; the adapter takes the last user message and extracts text from `input_text` parts.
3. **Create team**: A factory (e.g. `createTeam({ topic: userMessage })`) creates a fresh KaibanJS Team instance.
4. **Execute**: The adapter calls `team.start({ inputs: { topic: userMessage } })` and maps the result to OpenResponses JSON or SSE.

Example server setup (conceptually aligned with the playground):

```typescript
import express from 'express';
import { handleOpenResponses } from './adapter.js';

const PORT = Number(process.env.PORT) || 3100;
const SECRET = process.env.KAIBAN_OPENRESPONSES_SECRET ?? '';

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'kaiban-openresponses-adapter' });
});

// Bearer token auth when SECRET is set
function authMiddleware(req, res, next) {
  if (!SECRET) return next();
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { message: 'Missing or invalid Authorization header', type: 'authentication_error' },
    });
  }
  if (auth.slice(7).trim() !== SECRET) {
    return res.status(401).json({
      error: { message: 'Invalid token', type: 'authentication_error' },
    });
  }
  next();
}

app.post('/v1/responses', authMiddleware, (req, res) => {
  void handleOpenResponses(req, res);
});

app.listen(PORT, () => {
  console.log(`Adapter: http://localhost:${PORT}/v1/responses`);
});
```

### Step 4: Request Normalization and Message Extraction

The adapter supports both plain string input and structured message arrays as per the OpenResponses spec:

```typescript
// Plain string
{ "input": "Write a short paragraph about TypeScript." }

// Message array: last user message, text from input_text parts
{
  "input": [
    { "type": "message", "role": "user", "content": [{ "type": "input_text", "text": "Hello" }] }
  ]
}
```

The handler validates that a non-empty user message exists and returns `400` with a clear error if not.

### Step 5: Default Team — Content Creation

The playground ships with a **Content Creation Team** in `src/team/index.ts`: a sequential pipeline of ResearchBot → WriterBot → ReviewBot. The user message is passed as the `topic` input.

```typescript
import { Agent, Task, Team } from 'kaibanjs';

export function createTeam({ topic }: { topic: string }): Team {
  const researcher = new Agent({
    name: 'ResearchBot',
    role: 'Research Specialist',
    goal: 'Gather and analyze information',
    background: 'Expert in data collection and analysis',
  });

  const writer = new Agent({
    name: 'WriterBot',
    role: 'Content Writer',
    goal: 'Create engaging content from research',
    background: 'Professional content creator and editor',
  });

  const reviewer = new Agent({
    name: 'ReviewBot',
    role: 'Quality Reviewer',
    goal: 'Ensure content meets quality standards',
    background: 'Quality assurance specialist',
  });

  const researchTask = new Task({
    title: 'Research Topic',
    description: 'Research the given {topic} and extract key information',
    expectedOutput: 'Structured research data',
    agent: researcher,
  });

  const writingTask = new Task({
    title: 'Create Content',
    description: 'Transform research into engaging content',
    expectedOutput: 'Draft content',
    agent: writer,
  });

  const reviewTask = new Task({
    title: 'Review Content',
    description: 'Review and polish the content',
    expectedOutput: 'Final polished content',
    agent: reviewer,
  });

  return new Team({
    name: 'Content Creation Team',
    agents: [researcher, writer, reviewer],
    tasks: [researchTask, writingTask, reviewTask],
    inputs: { topic },
    env: { OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '' },
  });
}
```

You can replace this file with any KaibanJS Team factory. Ensure the team accepts the inputs you inject from the user message (e.g. `topic`). If you need different input shapes, update the extraction and `createTeam` call in the adapter accordingly.

### Step 6: Response Format and Errors

- **Success (non-streaming)**: The adapter returns a JSON object with `object: 'response'`, `status: 'completed'`, an `output` array of message items (each with `type: 'output_text'` and the result text), and `usage` (input/output token counts when available from the team).
- **Streaming**: When `stream: true` is sent, the adapter emits the full OpenResponses SSE sequence: `response.created` → `response.in_progress` → `response.output_item.added` → `response.content_part.added` → `response.output_text.delta` / `response.output_text.done` → `response.output_item.done` → `response.completed`, then `[DONE]`.
- **Workflow blocked**: If the team finishes with status `BLOCKED`, the adapter returns `422` and an error message derived from the workflow logs.
- **Workflow error**: If the team throws or ends in an error state, the adapter returns `500` and an appropriate error payload; in streaming mode it sends `response.failed` before closing.

### Step 7: OpenClaw Configuration

Register the adapter as a custom model provider in OpenClaw's config file: **`~/.openclaw/openclaw.json`** (JSON5 is supported).

**Important:** Do **not** put `provider`, `endpoint`, or `auth` inside `agents.list`. The backend is defined only under `models.providers`; agents reference the model as `providerId/modelId`.

#### Add the custom provider

Under `models.providers`, add:

```json5
{
  models: {
    mode: 'merge',
    providers: {
      'kaiban-adapter': {
        baseUrl: 'http://localhost:3100/v1',
        apiKey: '${KAIBAN_OPENRESPONSES_SECRET}',
        api: 'openai-responses',
        models: [
          {
            id: 'kaiban',
            name: 'KaibanJS Team',
            reasoning: false,
            input: ['text'],
            cost: { input: 0, output: 0 },
            contextWindow: 128000,
            maxTokens: 32000,
          },
        ],
      },
    },
  },
}
```

- `baseUrl` must include `/v1`; OpenClaw appends `/responses`.
- `apiKey` must match the adapter's `KAIBAN_OPENRESPONSES_SECRET` (env substitution is supported).

#### Configure the agent

Reference the model in your agent and set a generous timeout (multi-agent runs can be slow):

```json5
{
  agents: {
    list: [
      {
        id: 'kaiban-team',
        default: true,
        model: 'kaiban-adapter/kaiban',
      },
    ],
    defaults: {
      model: { primary: 'kaiban-adapter/kaiban' },
      timeoutSeconds: 600,
    },
  },
}
```

After editing the config, restart the OpenClaw daemon so channel integrations pick up the new provider and agent.

## Testing the Integration

### Health check (no auth)

```bash
curl -s http://localhost:3100/health
```

### Non-streaming request

```bash
curl -s -X POST http://localhost:3100/v1/responses \
  -H "Authorization: Bearer YOUR_KAIBAN_OPENRESPONSES_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"model":"kaiban","input":"Write a short paragraph about TypeScript."}'
```

### Streaming request

```bash
curl -N -X POST http://localhost:3100/v1/responses \
  -H "Authorization: Bearer YOUR_KAIBAN_OPENRESPONSES_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"model":"kaiban","stream":true,"input":"Write one sentence about AI."}'
```

Then send a message on an OpenClaw-connected channel (e.g. Telegram) to the agent that uses `kaiban-adapter/kaiban`. The reply should be the Content Creation Team's response.

## Key Integration Points

### 1. Request normalization

OpenClaw may wrap the request body in a `.body` property. The adapter's `normalizeBody` function unwraps it so the rest of the code sees the standard OpenResponses payload.

### 2. Extracting the user message

`extractUserMessage` supports:

- `input` as a non-empty string.
- `input` as an array of message items: it finds the last item with `role: 'user'` and concatenates text from content parts with `type: 'input_text'` and a `text` field.

### 3. Mapping workflow result to output text

The adapter converts the team's workflow result to a single string for `output_text`: if the result is an object with a `result` property, it uses that; otherwise it stringifies the value. This keeps the OpenResponses `output` array simple (one assistant message with one text part).

### 4. Error messages from workflow logs

When the workflow ends in `BLOCKED` or `ERRORED`, the adapter inspects the team's `workflowLogs` for a matching status update and uses the associated error metadata when present, so OpenClaw and the user see a meaningful message instead of a generic one.

### 5. SSE streaming

When `stream: true` is set, the adapter subscribes to team changes, runs `team.start()`, then emits the full OpenResponses SSE event sequence and ends with `data: [DONE]\n\n`. This enables real-time token delivery on supporting clients.

## Environment Configuration

Example `.env` for the adapter:

```env
PORT=3100
KAIBAN_OPENRESPONSES_SECRET=<generated-with-openssl-rand-base64-32>
OPENAI_API_KEY=sk-...
```

Generate the secret once and set it in both the adapter's `.env` and OpenClaw's `models.providers["kaiban-adapter"].apiKey`.

## Best Practices

1. **Security**: Do not expose the adapter to the public internet. Run it on localhost or a private network. Use a strong random value for `KAIBAN_OPENRESPONSES_SECRET`.
2. **Timeouts**: Set `agents.defaults.timeoutSeconds` to at least 300–600 in OpenClaw so multi-agent runs are not cut off.
3. **Swapping teams**: Keep the team definition in a single module (e.g. `src/team/index.ts`). Change the exported team factory to deploy a different workflow without touching the adapter logic.
4. **Error handling**: Rely on the adapter's BLOCKED (422) and ERRORED (500) behavior and on extracting messages from workflow logs so debugging and user feedback are clear.

## Troubleshooting

| Issue | Likely cause | Action |
| ----- | ------------- | ------ |
| `401` | Token mismatch | Ensure `apiKey` in OpenClaw matches `KAIBAN_OPENRESPONSES_SECRET` in the adapter. |
| Request timeout | Pipeline runs too long | Increase `agents.defaults.timeoutSeconds` in OpenClaw. |
| "Unrecognized keys" in OpenClaw | Invalid agent config | Remove `provider`, `endpoint`, or `auth` from `agents.list`; use only `model: "kaiban-adapter/kaiban"`. |
| No reply on channel | OpenClaw not using new model | Restart the OpenClaw daemon after editing `openclaw.json`. |

Test the adapter with `curl` against `POST /v1/responses` before debugging channel behavior.

## Conclusion

The OpenClaw integration lets you expose any KaibanJS team as an OpenResponses-compatible backend. A single Express server implements `POST /v1/responses` with optional SSE streaming, request normalization, and Bearer token auth. You register the adapter as a custom OpenClaw provider and point an agent at `kaiban-adapter/kaiban`. Your multi-agent pipeline then powers conversations on WhatsApp, Telegram, Discord, and other OpenClaw-supported channels without per-platform code.

For the **native plugin** path (`kaiban_run_team` without this HTTP adapter), see [OpenClaw Native Plugin](./18-OpenClaw-Native-Plugin.md).

For a ready-to-run implementation, use the [OpenClaw OpenResponses playground](https://github.com/kaiban-ai/KaibanJS/tree/main/playground/openclaw-openresponses) and the [example page](https://www.kaibanjs.com/examples/kaibanjs-team-openclaw-openresponses) on the KaibanJS site.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
