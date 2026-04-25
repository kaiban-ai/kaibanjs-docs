---
title: Using ExternalCodingAgent
description: Configure ExternalCodingAgent with Claude Code, OpenCode, or mock backends, wire Teams and Tasks, and run the official playground.
---

## Introduction

`ExternalCodingAgent` lets a KaibanJS **Team** assign **Tasks** to **local developer CLIs** (or a **mock**) while keeping the same lifecycle as other agents: task description interpolation, context, completion handlers, and errors on failed runs.

For concepts and comparisons, see [ExternalCodingAgent](../core-concepts/11-ExternalCodingAgent.md).

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Requirements

- **Node.js** (the agent spawns subprocesses; browser-only bundles are not supported).
- **`kaibanjs`** package version that exports `ExternalCodingAgent` / `type: 'ExternalCodingAgent'` (see [KaibanJS releases](https://github.com/kaiban-ai/KaibanJS/releases)).

## Creating an agent

Use the same `Agent` constructor with `type: 'ExternalCodingAgent'` and the fields below.

```typescript
import { Agent } from 'kaibanjs';

const agent = new Agent({
  type: 'ExternalCodingAgent',
  name: 'Coder',
  role: 'Implementation assistant',
  goal: 'Use the external CLI to satisfy each task',
  background: 'Runs in Node against workspaceRoot',
  codingBackend: 'claude-code', // 'opencode' | 'mock'
  workspaceRoot: '/absolute/path/to/repo',
  timeoutMs: 600_000,
  cliPath: '/optional/path/to/claude', // default: 'claude' or 'opencode'
  claude: {
    useBare: true,
    allowedTools: 'Read',
    permissionMode: undefined,
    maxTurns: undefined,
    maxBudgetUsd: undefined,
    extraArgs: [],
  },
  opencode: {
    model: undefined,
    agentName: undefined,
    attachUrl: undefined,
    extraArgs: [],
  },
});
```

### Parameter reference

| Field | Required | Description |
| ----- | -------- | ----------- |
| `type` | Yes | Must be `'ExternalCodingAgent'`. |
| `name`, `role`, `goal`, `background` | Yes | Same as other agents; used for identity and logging. |
| `codingBackend` | Yes | `'claude-code'`, `'opencode'`, or `'mock'`. |
| `workspaceRoot` | Yes | Working directory for the CLI (usually repository root). |
| `cliPath` | No | Executable name or absolute path. Defaults: `claude`, `opencode`. Ignored for `mock`. |
| `timeoutMs` | No | Subprocess timeout in ms (default **600000**). |
| `claude` | No | `useBare` (default `true`), `allowedTools`, `permissionMode`, `maxTurns`, `maxBudgetUsd`, `extraArgs`. |
| `opencode` | No | `model`, `agentName` (OpenCode `--agent`), `attachUrl` (`--attach`), `extraArgs`. |

The agent does **not** use KaibanJS `tools` arrays for CLI execution; tool access is governed by the **external** CLI (for example Claude’s `--allowedTools`).

### Environment variables

The subprocess inherits **`process.env`** merged with the agent’s `env` object (from `Team` / `Agent` initialization, same pattern as other agents). Set provider keys as required by each CLI (for example **`ANTHROPIC_API_KEY`** for headless Claude Code).

## Claude Code

1. Install and authenticate [Claude Code](https://docs.anthropic.com/en/docs/claude-code/setup); verify `which claude`.
2. For scripted runs, follow [Run Claude Code programmatically](https://docs.anthropic.com/en/docs/claude-code/headless) (the library uses JSON output mode and optional `--bare`).
3. Prefer **narrow tool allowlists** and explicit **`permissionMode`** in production; defaults are your responsibility at the CLI.

## OpenCode

1. Install the [OpenCode CLI](https://opencode.ai/docs/cli/); verify `which opencode`.
2. The driver runs `opencode run --format json` with your prompt. If the binary is missing, you get an actionable error: fix `PATH` or set `cliPath` to the full executable.

## Mock backend

Set `codingBackend: 'mock'` for CI-style checks: no subprocess, no keys. The result is a deterministic string prefix derived from the composed prompt.

## Task chaining

Pass prior task text into later tasks with interpolation, for example `{taskResult:task1}` for the **first** task in the team’s task list. See [Task result passing](../how-to/10-Task-Result-Passing.md).

Each task triggers **one** CLI run (or one mock response). Feedback flows append **reviewer feedback** and invoke the backend again.

## Official playground

The KaibanJS repo includes **`playground/external-coding-agents`**:

- Two `ExternalCodingAgent` instances and two chained tasks.
- Backend switch: edit `PLAYGROUND_DEFAULT_BACKEND` in `index.ts` or set **`KAIBAN_CODING_BACKEND`** (`mock` \| `claude-code` \| `opencode`) in `.env`.
- Optional CLI paths: **`KAIBAN_CLAUDE_CLI`** / **`CLAUDE_CLI`**, **`KAIBAN_OPENCODE_CLI`** / **`OPENCODE_CLI`**.

Clone [KaibanJS](https://github.com/kaiban-ai/KaibanJS), build the package, then:

```bash
cd playground/external-coding-agents
npm install
npm start
```

Details match the playground [README](https://github.com/kaiban-ai/KaibanJS/blob/main/playground/external-coding-agents/README.md).

## Task results: string vs structured

- **Claude Code**: If the JSON response includes `structured_output`, the stored `TaskResult` can be that structured value; otherwise the text `result` is used.
- **OpenCode**: Parsed JSON may expose both text-like fields and a structured object depending on the CLI output.

## Limitations and safety

- **Trust boundary**: The agent runs **arbitrary CLIs** with the prompt as arguments; do not pass unsanitized user-controlled strings into flags or `extraArgs`.
- **Platform serialization** (for example Kaiban.io boards) for this agent type may lag the open-source library; treat board export as product-specific when available.
- Very large stdout/stderr is not specially truncated in the library today; long runs may use significant memory.

## Related

- [Agents](../core-concepts/01-Agents.md) — general agent model.
- [WorkflowDrivenAgent](../core-concepts/10-WorkflowDrivenAgent.md) — deterministic workflows inside KaibanJS.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
