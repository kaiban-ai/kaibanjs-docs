---
title: Exporting Traces with OpenTelemetry
description: Learn how to enable distributed tracing and observability in KaibanJS using the @kaibanjs/opentelemetry package.
---

# Exporting Traces with OpenTelemetry

This guide explains how to export KaibanJS workflow traces using the **@kaibanjs/opentelemetry** package. With this integration, you can visualize, debug, and monitor your AI agents’ workflows in real time through OpenTelemetry-compatible observability tools like **SigNoz**, **Langfuse**, **Phoenix**, or **Braintrust**.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt).  
Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## Introduction

The **@kaibanjs/opentelemetry** package bridges **KaibanJS** with **OpenTelemetry**, automatically mapping your agent and task executions to OpenTelemetry **spans**.  
This allows for a detailed, visual representation of how your agents think, act, and collaborate within complex workflows.

### Key Features

- 🔍 **Automatic Trace Mapping** — KaibanJS tasks and agents are represented as OpenTelemetry spans.
- 📈 **Built-in Metrics** — Duration, token usage, cost, and performance are automatically captured.
- 🌐 **Multi-Service Export** — Export traces to SigNoz, Langfuse, Phoenix, Braintrust, Dash0, and any OTLP-compatible service.
- ⚙️ **Smart Sampling** — Supports configurable sampling strategies.
- 🧩 **Zero Breaking Changes** — Works without modifying your existing KaibanJS logic.

---

## Installation

```bash
npm install @kaibanjs/opentelemetry
```

---

## Quick Start

Here’s a minimal setup to get started with OpenTelemetry tracing in your KaibanJS project:

```typescript
import { Team, Agent, Task } from 'kaibanjs';
import { enableOpenTelemetry } from '@kaibanjs/opentelemetry';

const team = new Team({
  name: 'My Observability Team',
  agents: [...],
  tasks: [...]
});

const config = {
  enabled: true,
  sampling: { rate: 1.0, strategy: 'always' },
  attributes: {
    includeSensitiveData: false,
    customAttributes: {
      'service.name': 'kaiban-observability-demo',
      'service.version': '1.0.0'
    }
  },
  exporters: {
    console: true,
    otlp: {
      endpoint: 'https://ingest.us.signoz.cloud:443',
      protocol: 'grpc',
      headers: { 'signoz-access-token': 'your-token' },
      serviceName: 'kaibanjs-service'
    }
  }
};

enableOpenTelemetry(team, config);
await team.start({ input: 'data' });
```

---

## Configuration Options

### `OpenTelemetryConfig` Interface

```typescript
interface OpenTelemetryConfig {
  enabled: boolean;
  sampling: {
    rate: number;
    strategy: 'always' | 'probabilistic' | 'rate_limiting';
  };
  attributes: {
    includeSensitiveData: boolean;
    customAttributes: Record<string, string>;
  };
  exporters?: {
    console?: boolean;
    otlp?: OTLPConfig | OTLPConfig[];
  };
}
```

### Sampling Strategies

| Strategy        | Description                                        |
| --------------- | -------------------------------------------------- |
| `always`        | Records all traces — recommended for development   |
| `probabilistic` | Samples a percentage of traces (0.0 to 1.0)        |
| `rate_limiting` | Limits trace rate for high-load production systems |

---

## Trace Structure

The package creates simplified traces with the following structure:

```
Task Span (CLIENT) - DOING → DONE
├── Agent Thinking Span (CLIENT) - THINKING → THINKING_END
├── Agent Thinking Span (CLIENT) - THINKING → THINKING_END
└── Agent Thinking Span (CLIENT) - THINKING → THINKING_END
```

### Span Hierarchy

- **Task Spans**: Individual task execution spans
- **Agent Thinking Spans**: Nested spans for agent LLM interactions

### Span Kinds

The package automatically determines span kinds based on span names:

- **CLIENT** (2): Task and Agent spans - represent client operations
- **INTERNAL** (0): Default for other spans - internal operations

## Event Mapping

The package automatically maps KaibanJS workflow events to OpenTelemetry spans:

### Task Events

| KaibanJS Event        | OpenTelemetry Span | Description                     |
| --------------------- | ------------------ | ------------------------------- |
| `TaskStatusUpdate`    | Task Span          | Task execution lifecycle events |
| `DOING`               | Task Span Start    | Task execution started          |
| `DONE`                | Task Span End      | Task completed successfully     |
| `AWAITING_VALIDATION` | Task Span          | Task awaiting validation        |
| `VALIDATED`           | Task Span          | Task validated successfully     |
| `ERRORED`             | Task Span Error    | Task failed with error          |
| `ABORTED`             | Task Span Abort    | Task aborted                    |

### Agent Events

| KaibanJS Event      | OpenTelemetry Span        | Description                         |
| ------------------- | ------------------------- | ----------------------------------- |
| `AgentStatusUpdate` | Agent Thinking Span       | Agent thinking and execution events |
| `THINKING`          | Agent Thinking Span Start | Agent begins thinking process       |
| `THINKING_END`      | Agent Thinking Span End   | Agent completes thinking process    |

## KaibanJS Semantic Conventions

The package uses KaibanJS-specific semantic conventions for LLM attributes that are automatically recognized by observability services:

### LLM Request Attributes (`kaiban.llm.request.*`)

- `kaiban.llm.request.messages` - Input messages to the LLM
- `kaiban.llm.request.model` - Model name used for the request
- `kaiban.llm.request.provider` - Provider of the model (openai, anthropic, google, etc.)
- `kaiban.llm.request.iteration` - Iteration number for the thinking process
- `kaiban.llm.request.start_time` - When the thinking process started
- `kaiban.llm.request.status` - Status of the request (started, interrupted, completed)
- `kaiban.llm.request.input_length` - Length of the input messages
- `kaiban.llm.request.has_metadata` - Whether metadata is available
- `kaiban.llm.request.metadata_keys` - Available metadata keys

### LLM Usage Attributes (`kaiban.llm.usage.*`)

- `kaiban.llm.usage.input_tokens` - Number of input tokens
- `kaiban.llm.usage.output_tokens` - Number of output tokens
- `kaiban.llm.usage.total_tokens` - Total tokens used
- `kaiban.llm.usage.prompt_tokens` - Prompt tokens
- `kaiban.llm.usage.completion_tokens` - Completion tokens
- `kaiban.llm.usage.cost` - Cost in USD

### LLM Response Attributes (`kaiban.llm.response.*`)

- `kaiban.llm.response.messages` - Output messages from the LLM
- `kaiban.llm.response.duration` - Duration of the response
- `kaiban.llm.response.end_time` - When the response ended
- `kaiban.llm.response.status` - Status of the response (completed, error, etc.)
- `kaiban.llm.response.output_length` - Length of the output messages

### Task Attributes (`task.*`)

- `task.id` - Unique task identifier
- `task.name` - Task title
- `task.description` - Task description
- `task.status` - Task status (started, completed, errored, aborted)
- `task.start_time` - When task execution started
- `task.end_time` - When task execution ended
- `task.duration_ms` - Task execution duration in milliseconds
- `task.iterations` - Number of iterations performed
- `task.total_cost` - Total cost for the task
- `task.total_tokens_input` - Total input tokens used
- `task.total_tokens_output` - Total output tokens generated
- `task.has_metadata` - Whether task has metadata
- `task.metadata_keys` - Available metadata keys

### Agent Attributes (`agent.*`)

- `agent.id` - Unique agent identifier
- `agent.name` - Agent name
- `agent.role` - Agent role description

### Error Attributes (`error.*`)

- `error.message` - Error message
- `error.type` - Error type
- `error.stack` - Error stack trace

### Span Types

- `task.execute` - Task execution spans
- `kaiban.agent.thinking` - Agent thinking spans (nested under task spans)

These conventions ensure that observability services like Langfuse, Phoenix, and others can automatically recognize and properly display LLM-related data in their dashboards.

## Span Context Management

The package uses a `KaibanSpanContext` to manage span relationships and correlation across workflows:

### Context Structure

```typescript
interface KaibanSpanContext {
  teamName: string;
  workflowId: string;
  rootSpan?: Span;
  taskSpans: Map<string, Span>;
  agentSpans: Map<string, Span>;
}
```

### Context Methods

- **Root Span Management**:

  - `setRootSpan(span: Span)` - Set the workflow root span
  - `getRootSpan()` - Get the current root span

- **Task Span Management**:

  - `setTaskSpan(taskId: string, span: Span)` - Associate a span with a task
  - `getTaskSpan(taskId: string)` - Retrieve task span
  - `removeTaskSpan(taskId: string)` - Remove task span from context

- **Agent Span Management**:
  - `setAgentSpan(agentId: string, span: Span)` - Associate a span with an agent
  - `getAgentSpan(agentId: string)` - Retrieve agent span
  - `removeAgentSpan(agentId: string)` - Remove agent span from context

### Context Lifecycle

1. **Task Execution**: Task spans are created
2. **Agent Thinking**: Agent thinking spans are nested under task spans
3. **Task Completion**: All spans are completed and context is cleared

### Span Correlation

The context ensures proper parent-child relationships between spans:

- Task spans are parents of agent thinking spans
- All spans maintain proper trace context for distributed tracing

---

## Exporting Traces

### Console Exporter (for Development)

```typescript
exporters: {
  console: true;
}
```

### OTLP Exporter (for Production)

You can export traces to any OTLP-compatible service.

#### Example: Single Service

```typescript
exporters: {
  otlp: {
    endpoint: 'https://cloud.langfuse.com/api/public/otel',
    protocol: 'http',
    headers: {
      Authorization: 'Basic ' + Buffer.from('pk-lf-xxx:sk-lf-xxx').toString('base64')
    },
    serviceName: 'kaibanjs-langfuse'
  }
}
```

#### Example: Multiple Services

```typescript
exporters: {
  otlp: [
    {
      endpoint: 'https://ingest.us.signoz.cloud:443',
      protocol: 'grpc',
      headers: { 'signoz-access-token': 'your-token' },
      serviceName: 'kaibanjs-signoz'
    },
    {
      endpoint: 'https://cloud.langfuse.com/api/public/otel',
      protocol: 'http',
      headers: {
        Authorization:
          'Basic ' + Buffer.from('pk-lf-xxx:sk-lf-xxx').toString('base64')
      },
      serviceName: 'kaibanjs-langfuse'
    }
  ];
}
```

---

### Environment Variable Configuration

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="https://your-service.com"
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer your-token"
export OTEL_EXPORTER_OTLP_PROTOCOL="http"
```

Then in your code:

```typescript
exporters: {
  otlp: {
    serviceName: 'kaibanjs-service';
  }
}
```

---

## Monitoring Metrics

- Workflow and task **duration**
- **Cost** and **token usage**
- **Iteration count**
- **Error rates**
- **Resource consumption**

---

## Advanced Usage

```typescript
import { createOpenTelemetryIntegration } from '@kaibanjs/opentelemetry';

const integration = createOpenTelemetryIntegration(config);
integration.integrateWithTeam(team);

await team.start({ input: 'data' });
await integration.shutdown();
```

---

## Best Practices

1. Use **probabilistic sampling** in production.
2. Avoid including **sensitive data** in traces.
3. Validate exporter endpoints and authentication tokens.
4. Use the **console exporter** for local debugging.
5. Monitor memory and performance when scaling agents.

---

## Troubleshooting

| Issue                 | Possible Cause        | Solution                                      |
| --------------------- | --------------------- | --------------------------------------------- |
| Connection refused    | Wrong endpoint        | Verify OTLP URL and protocol                  |
| Authentication failed | Invalid API token     | Double-check headers or environment variables |
| Timeout errors        | Network latency       | Increase `timeout` in OTLP config             |
| No traces visible     | Sampling rate too low | Use `strategy: 'always'` temporarily          |

---

## Conclusion

By integrating OpenTelemetry with KaibanJS, you gain deep visibility into your agents’ behavior and task performance.  
This observability layer empowers you to diagnose issues faster, optimize execution flows, and scale AI systems confidently.

:::tip[We Love Feedback!]
Found this guide useful or have suggestions?  
Help us improve by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues).
:::
