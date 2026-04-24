---
title: ExternalCodingAgent
description: Agent that delegates tasks to local coding CLIs (Claude Code, OpenCode) or a mock backend, using the same Team and Task lifecycle as other agents.
---

## What is an ExternalCodingAgent?

> An **ExternalCodingAgent** delegates each assigned task to an **external coding tool** running on your machine: [Claude Code](https://docs.anthropic.com/en/docs/claude-code/headless) (`claude`), [OpenCode](https://opencode.ai/docs/cli/) (`opencode run`), or an in-process **`mock`** backend that echoes the composed prompt (useful for tests and wiring checks).

It is **not** an LLM-backed `ReactChampionAgent`. KaibanJS still drives **tasks, stores, errors, and results** the same way: one task maps to **one CLI invocation** (single iteration, forced final answer). The agent builds a text prompt from the task description (with interpolation), optional workflow context, `expectedOutput`, and—on feedback—reviewer comments.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Runtime: Node.js

`ExternalCodingAgent` uses Node’s `child_process.spawn` with **no shell**. It is intended for **Node.js** runtimes. Bundles that target the browser are not a supported environment for this agent type.

## Backends

| `codingBackend` | Behavior |
| ----------------- | -------- |
| `claude-code`     | Runs `claude` with `-p`, `--output-format json`, optional [`--bare`](https://docs.anthropic.com/en/docs/claude-code/headless), tool and permission flags. Parses JSON stdout (`result`, optional `structured_output`). |
| `opencode`        | Runs `opencode run --format json` with the prompt. Parses stdout (tolerant of NDJSON; last JSON object wins). |
| `mock`            | No subprocess; returns a short string derived from the prompt (no API keys or CLIs required). |

Non-zero CLI exit codes surface as task errors (task can move to **BLOCKED** per store rules). Missing binaries (`ENOENT`) produce a clear error suggesting `PATH` or `cliPath`.

## How prompts are built

For each run, the agent composes a markdown-style prompt with:

1. **Task** — interpolated description (`{inputKey}`, `{taskResult:task1}`, etc.; see [Task result passing](./09-Task-Orchestration.md) and [Using task results in descriptions](../how-to/10-Task-Result-Passing.md)).
2. **Prior output / context** — workflow context string when present.
3. **Expected output** — the task’s `expectedOutput` text.

On **feedback**, the same base prompt is extended with a `## Reviewer feedback` section before re-invoking the backend.

## When to use it

- You already use **Claude Code** or **OpenCode** locally and want a **Team** to orchestrate **who** runs **which task** in order.
- You want **deterministic “one shot per task”** behavior instead of an internal ReAct loop.
- You need a **mock** agent to validate team wiring without calling a CLI.

Use **ReactChampionAgent** when you want in-process LLM tool use. Use **WorkflowDrivenAgent** for `@kaibanjs/workflow` graphs. **ExternalCodingAgent** is for **delegating the heavy lifting to an external CLI** you trust in that environment.

## Team compatibility

`ExternalCodingAgent` is a normal `Agent` with `type: 'ExternalCodingAgent'`. It participates in teams, task ordering, interpolation, and store callbacks like other agents.

```typescript
import { Agent, Task, Team } from 'kaibanjs';

const worker = new Agent({
  type: 'ExternalCodingAgent',
  name: 'RepoWorker',
  role: 'Repository assistant',
  goal: 'Answer using the configured external CLI',
  background: 'Runs in the team’s Node process',
  codingBackend: 'mock',
  workspaceRoot: process.cwd(),
});

const team = new Team({
  name: 'Mixed team',
  agents: [
    worker,
    new Agent({
      name: 'Analyst',
      role: 'Analyst',
      goal: 'Refine answers',
      background: 'LLM-based review',
    }),
  ],
  tasks: [
    new Task({
      description: 'Summarize the repo README for: {topic}',
      expectedOutput: 'Short plain-text summary',
      agent: worker,
    }),
    new Task({
      description: 'Improve the summary: {taskResult:task1}',
      expectedOutput: 'Polished summary',
      agent: 'Analyst',
    }),
  ],
  inputs: { topic: 'installation' },
});
```

## Sample project

The KaibanJS repository includes a runnable playground: [`playground/external-coding-agents`](https://github.com/kaiban-ai/KaibanJS/tree/main/playground/external-coding-agents) (two agents, chained tasks, env-based backend selection).

## Next steps

For configuration fields (`claude`, `opencode`, `timeoutMs`, `cliPath`), environment merging, safety notes, and concrete Claude/OpenCode setup, see [Using ExternalCodingAgent](../how-to/19-Using-ExternalCodingAgent.md).

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
