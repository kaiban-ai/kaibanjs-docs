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

| Strategy | Description |
|-----------|--------------|
| `always` | Records all traces — recommended for development |
| `probabilistic` | Samples a percentage of traces (0.0 to 1.0) |
| `rate_limiting` | Limits trace rate for high-load production systems |

---

## Trace Structure

Each KaibanJS task or agent execution is automatically converted into OpenTelemetry spans, with a clear parent-child hierarchy:

```
Task Span (DOING → DONE)
├── Agent Thinking Span (THINKING_END)
├── Agent Thinking Span (THINKING_END)
└── Agent Thinking Span (THINKING_END)
```

---

## Exporting Traces

### Console Exporter (for Development)

```typescript
exporters: {
  console: true
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
  ]
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
  otlp: { serviceName: 'kaibanjs-service' }
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

| Issue | Possible Cause | Solution |
|--------|----------------|-----------|
| Connection refused | Wrong endpoint | Verify OTLP URL and protocol |
| Authentication failed | Invalid API token | Double-check headers or environment variables |
| Timeout errors | Network latency | Increase `timeout` in OTLP config |
| No traces visible | Sampling rate too low | Use `strategy: 'always'` temporarily |

---

## Conclusion

By integrating OpenTelemetry with KaibanJS, you gain deep visibility into your agents’ behavior and task performance.  
This observability layer empowers you to diagnose issues faster, optimize execution flows, and scale AI systems confidently.

:::tip[We Love Feedback!]
Found this guide useful or have suggestions?  
Help us improve by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues).
:::
