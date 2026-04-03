---
title: OpenClaw Native Plugin (@kaibanjs/kaibanjs-plugin)
description: Register a KaibanJS Team as the OpenClaw tool kaiban_run_team so the Gateway’s main agent can delegate multi-agent workflows without a separate HTTP adapter.
---

> Run any KaibanJS **Team** inside **OpenClaw** as a **native tool** — `kaiban_run_team` — so the main orchestrator decides when to invoke your workflow while KaibanJS handles tasks, agents, and tools. No Express server or OpenResponses surface is required for this path.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Introduction

**OpenClaw** is a messaging gateway that connects agents to WhatsApp, Telegram, Discord, and other channels. It loads **plugins** at startup and exposes **tools** to the primary LLM. The official package **`@kaibanjs/kaibanjs-plugin`** (source: [`packages/openclaw-plugin`](https://github.com/kaiban-ai/KaibanJS/tree/main/packages/openclaw-plugin) in the KaibanJS monorepo) registers exactly one tool — **`kaiban_run_team`** — backed by your TypeScript module that exports metadata and a `createTeam` factory.

This complements the [**OpenResponses adapter**](./17-OpenClaw-Integration.md): use the **plugin** when KaibanJS should be **one capability among many tools**; use **OpenResponses** when the **entire conversational turn** should be handled by your backend as if it were a custom model provider.

:::info[Two ways to integrate with OpenClaw]
| Approach | What it is | Best when |
| -------- | ---------- | --------- |
| **Native plugin** (`@kaibanjs/kaibanjs-plugin`) | Single tool `kaiban_run_team`; the main agent **calls** your Team with structured `inputs`. | You want the orchestrator to choose **when** to run a multi-agent workflow alongside other tools. |
| **OpenResponses adapter** | Your Team is exposed as **`POST /v1/responses`**; OpenClaw uses it as a **custom model**. | You want each user message to be handled **entirely** by your Team behind one HTTP endpoint. |

See the [OpenResponses integration guide](./17-OpenClaw-Integration.md) for the HTTP-based pattern and the [OpenClaw OpenResponses playground](https://github.com/kaiban-ai/KaibanJS/tree/main/playground/openclaw-openresponses).
:::

:::warning[Gateway host only]
The plugin runs in the **OpenClaw Gateway** process. Your Team module is loaded with Node’s dynamic `import()`. Keep secrets in the Gateway environment; do not assume a browser runtime.
:::

## Understanding the integration

### Why the native plugin?

- **No separate HTTP service**: OpenClaw already manages sessions and channels; the plugin wires KaibanJS into the existing tool layer.
- **Structured delegation**: The main model sees `kaiban_run_team` with a schema derived from your `teamMetadata.inputs`, so arguments stay aligned with `createTeam`.
- **Composable stacks**: Your Team can use LangChain-compatible tools (for example Tavily), the same patterns as in other KaibanJS projects.
- **Same Team code elsewhere**: The module you point at with `modulePath` is ordinary KaibanJS; you can reuse it from CLI, tests, or other hosts.

### Architecture overview

```
User (channel) → OpenClaw Gateway → main agent LLM
  → tool call kaiban_run_team({ inputs })
  → dynamic import of your Team module
  → createTeam({ inputs, ctx }) → Team
  → team.start()
  → tool result (text + workflow details) → conversation
```

At startup, OpenClaw loads the plugin entrypoint and calls `register(api)`. The runtime:

1. Reads `plugins.entries.kaibanjs-plugin.config.team` (validated by [`openclaw.plugin.json`](https://github.com/kaiban-ai/KaibanJS/blob/main/packages/openclaw-plugin/openclaw.plugin.json)).
2. Resolves `team.modulePath` (absolute paths are most reliable on the Gateway host) and imports the file via a `file:` URL (with optional `api.resolvePath`).
3. Loads **`teamMetadata`**: `description` becomes the tool description; optional **`inputs`** is merged into the tool schema for the `inputs` argument object.
4. Loads **`createTeam`**, registers **`kaiban_run_team`** with parameters `{ inputs: … }`.
5. On execute: merges `config.team.defaults` with the tool’s `inputs`, calls `createTeam({ inputs, ctx })`, then `team.start()`. User-visible text is derived from the workflow result (a string `result` field is preferred when present). Structured output is also attached under `details.workflowResult`.

## Implementation guide

### Step 1: Get the plugin

The package lives at **`packages/openclaw-plugin`** in the [KaibanJS repository](https://github.com/kaiban-ai/KaibanJS). You do **not** need to publish to npm: install the folder from disk into OpenClaw (next step).

If you only need that directory:

```bash
npx --yes degit kaiban-ai/KaibanJS/packages/openclaw-plugin openclaw-plugin
```

Alternatively, use a **sparse Git checkout** of `packages/openclaw-plugin`, or clone the full monorepo for development.

### Step 2: Install the plugin into OpenClaw

On the machine that runs the Gateway:

```bash
openclaw plugins install /absolute/path/to/KaibanJS/packages/openclaw-plugin
openclaw stop
openclaw start
```

The manifest **`id`** in `openclaw.plugin.json` is **`kaibanjs-plugin`**. Your `openclaw.json` entry key **must** match: `plugins.entries.kaibanjs-plugin`.

### Step 3: Install dependencies your Team needs

The bundled [example Team](https://github.com/kaiban-ai/KaibanJS/blob/main/packages/openclaw-plugin/examples/example.ts) uses Tavily:

```bash
npm install @langchain/tavily
```

Install packages in the **environment where OpenClaw resolves modules** for your `modulePath` (often the Gateway working directory or a linked project). **`kaibanjs`** must be resolvable when your module loads.

### Step 4: Configure environment variables

Set any secrets your Team expects — for example `OPENAI_API_KEY`, `TAVILY_API_KEY` — in the **OpenClaw Gateway** process environment, same as for other server-side tools.

### Step 5: Enable the plugin in `openclaw.json`

Point `team.modulePath` at **your** module (absolute path recommended). JSON5 is supported.

```json5
{
  plugins: {
    enabled: true,
    entries: {
      'kaibanjs-plugin': {
        enabled: true,
        config: {
          team: {
            modulePath: '/absolute/path/to/your/team.ts',
            exportName: 'createTeam',
            metadataExportName: 'teamMetadata',
            defaults: {},
          },
        },
      },
    },
  },
}
```

| Field | Description |
| ----- | ----------- |
| `modulePath` | File that exports `teamMetadata` and `createTeam` (or your custom names). **Required.** |
| `exportName` | Factory function name (default: `createTeam`). |
| `metadataExportName` | Metadata object name (default: `teamMetadata`). |
| `defaults` | Object merged into tool `inputs` before `createTeam` (optional). |

**Allow the tool** for agents that should invoke KaibanJS:

```json5
{
  agents: {
    list: [
      {
        id: 'default',
        tools: {
          allow: ['kaiban_run_team'],
        },
      },
    ],
  },
}
```

Restart the Gateway after changes.

For OpenClaw’s plugin manifest format, see [OpenClaw plugins / manifest](https://docs.openclaw.ai/plugins/manifest).

### Step 6: Team module contract

Export the following from `modulePath` (names configurable via `exportName` / `metadataExportName`).

#### `teamMetadata`

- **`description`** (string, **required**) — Tells the main LLM **when** to call `kaiban_run_team`.
- **`inputs`** (optional but **recommended**) — JSON Schema for the **`inputs`** object: `type: "object"`, explicit `properties`, and `additionalProperties: false` so tool arguments match `createTeam`.

If you omit `inputs`, the plugin falls back to a loose object schema; defining `inputs` with at least one property is required for strict, documented parameters (the implementation validates non-empty `properties` when `inputs` is present).

#### `createTeam`

Signature shape:

```typescript
({ inputs, ctx }) => Team | Promise<Team>
```

- **`inputs`**: `Record<string, unknown>` after merging `defaults` with the tool call.
- **`ctx`**: Optional context (for example session or channel identifiers) when the Gateway supplies it; reserve this for forward-compatible use.

Return a KaibanJS **`Team`**. The plugin calls **`team.start()`** with no arguments after the factory resolves.

Reference implementation: [`packages/openclaw-plugin/examples/example.ts`](https://github.com/kaiban-ai/KaibanJS/blob/main/packages/openclaw-plugin/examples/example.ts) (Tavily search + briefing team).

## Tool surface

| Field | Value |
| ----- | ----- |
| Tool name | `kaiban_run_team` |
| Arguments | `{ inputs: { … } }` — shape from `teamMetadata.inputs` or a generic object if omitted |
| Return | Tool result with text content and `details.workflowResult` for the full workflow output |

## Key integration points

### 1. Plugin id and config path

The OpenClaw entry key **`kaibanjs-plugin`** must align with `"id": "kaibanjs-plugin"` in [`openclaw.plugin.json`](https://github.com/kaiban-ai/KaibanJS/blob/main/packages/openclaw-plugin/openclaw.plugin.json). A mismatch prevents the plugin from loading correctly.

### 2. Dynamic import and paths

The module is loaded with `import(fileUrl)`. Prefer **absolute** `modulePath` values on the Gateway host. If OpenClaw provides `api.resolvePath`, it is applied before import.

### 3. Mapping workflow result to text

The plugin prefers a string **`result`** on the workflow output; otherwise it stringifies the value. This keeps the tool’s primary text field predictable for the main agent.

### 4. Strict `inputs` schema

Use `teamMetadata.inputs.properties` and `additionalProperties: false` so the orchestrator sends exactly the keys your `createTeam` reads (for example `topic`).

## Best practices

1. **Timeouts**: Multi-agent runs can be slow; configure generous agent timeouts in OpenClaw if your Gateway supports them.
2. **Secrets**: Never embed API keys in the Team module; read from `process.env` and set variables on the Gateway.
3. **Single module**: Keep `teamMetadata` and `createTeam` in one file you own; iterate on workflow logic without forking the plugin.
4. **Dependencies**: Document required npm packages next to your `modulePath` so production Gateways install them.

## Troubleshooting

| Issue | Likely cause | Action |
| ----- | ------------- | ------ |
| Plugin id mismatch | Entry key ≠ manifest id | Use `plugins.entries.kaibanjs-plugin` and keep manifest `id` as `kaibanjs-plugin`. |
| Load-time error | Missing `config.team` or invalid exports | Ensure `modulePath`, non-empty `teamMetadata.description`, and a function at `exportName`. |
| Wrong tool arguments | Schema too loose or misaligned | Define `teamMetadata.inputs` with explicit `properties` and `additionalProperties: false`. |
| Missing Tavily / LLM errors | Dependencies or env | Install `@langchain/tavily` (if used) and set `OPENAI_API_KEY` / provider keys on the Gateway. |
| Tool never called | Not allowed on agent | Add `kaiban_run_team` to `agents.list[].tools.allow` for the relevant agent. |

## Conclusion

The **`@kaibanjs/kaibanjs-plugin`** package registers your KaibanJS **Team** as **`kaiban_run_team`**, with parameters driven by **`teamMetadata`** and execution via **`createTeam`**. It is the right integration shape when OpenClaw’s main agent should **delegate** structured work to a full workflow, while the [**OpenResponses guide**](./17-OpenClaw-Integration.md) remains the right choice when your Team should **replace** the model backend behind `POST /v1/responses`.

For source, manifest schema, and the Tavily example, see the [openclaw-plugin folder on GitHub](https://github.com/kaiban-ai/KaibanJS/tree/main/packages/openclaw-plugin). Community context: [Run KaibanJS multi-agent teams inside OpenClaw as a native tool](https://huggingface.co/blog/darielnoel/kaibanjs-openclaw-native-tool) (Hugging Face).

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
