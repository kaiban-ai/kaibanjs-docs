---
title: Kaiban Distributed
description: A community-maintained distributed runtime for KaibanJS—multi-node workers, BullMQ or Kafka, JSON-RPC gateway, and live Kaiban Board sync.
slug: /ecosystem/kaiban-distributed
sidebar_position: 2
---

# Kaiban Distributed

**Kaiban Distributed** is a community project that wraps KaibanJS in a **production-oriented, multi-process runtime**: workers consume tasks from queues, a gateway exposes HTTP APIs, and state can stream to browsers for a live board experience.

- **Repository:** [github.com/andreibesleaga/kaiban-distributed](https://github.com/andreibesleaga/kaiban-distributed)  
- **Author:** [@andreibesleaga](https://github.com/andreibesleaga)  
- **Integration guide (upstream):** [KAIBANJS_INTEGRATION.md](https://github.com/andreibesleaga/kaiban-distributed/blob/main/KAIBANJS_INTEGRATION.md)

:::info[Relationship to KaibanJS]

**KaibanJS** provides agents, teams, tasks, tools, and the Kanban-style state model. **Kaiban Distributed** adds scalable execution across nodes (e.g. **BullMQ** on **Redis** or **Kafka**), retries and dead-letter handling, a gateway with **JSON-RPC 2.0** task APIs, optional **MCP** federation, security hooks (firewall, circuit breaker, JIT tokens, TLS), and **OpenTelemetry** hooks. Use it when a single Node process is not enough.

:::

## When to consider it

- You want **several worker processes or containers**, each running KaibanJS agents, coordinated by messages.  
- You need **durable queues**, retries, and failure visibility (e.g. completion / DLQ topics).  
- You want a **central HTTP API** to submit work and optional **real-time board** updates over **Socket.io** with Redis pub/sub.  
- You are aligning with patterns described in our docs for **[A2A](/how-to/A2A-Protocol-Integration)**, **[MCP](/how-to/MCP-Adapter-Integration)**, **[Kaiban Board](/get-started/The%20Kaiban%20Board)**, and **[telemetry](/get-started/Telemetry)**—Kaiban Distributed is a separate codebase that implements its own gateway and observability hooks.

## Integration modes (summary)

The upstream guide describes two main patterns:

1. **Distributed agent bridge** — `createKaibanTaskHandler` turns a KaibanJS `Agent` into a queue-backed handler run by an `AgentActor` (one agent per worker role).  
2. **Team bridge** — `KaibanTeamBridge` runs a full KaibanJS `Team` in one process and publishes Zustand state deltas for remote viewers.

For message schemas, Docker examples (including a multi-agent blog pipeline), **HITL** orchestration patterns, **WorkflowDrivenAgent** on workers, and environment variables, follow **[KAIBANJS_INTEGRATION.md](https://github.com/andreibesleaga/kaiban-distributed/blob/main/KAIBANJS_INTEGRATION.md)**—that document is the canonical reference.

## Related KaibanJS documentation

- [Deploying Your Kaiban Board](/how-to/Deployment%20Options) — static board hosting; Kaiban Distributed adds a distributed live-view pattern.  
- [A2A Protocol Integration](/how-to/A2A-Protocol-Integration) — Google A2A patterns in KaibanJS; Kaiban Distributed exposes its own JSON-RPC gateway for cross-service task submission.  
- [MCP Adapter Integration](/how-to/MCP-Adapter-Integration) — MCP in KaibanJS; Kaiban Distributed includes MCP federation for tools at the infrastructure layer.  
- [Exporting Traces with OpenTelemetry](/how-to/Exporting-Traces-with-OpenTelemetry) — tracing concepts; Kaiban Distributed documents OTLP configuration in its integration guide.

## Support

Questions, bugs, and contributions belong in **[andreibesleaga/kaiban-distributed](https://github.com/andreibesleaga/kaiban-distributed)**. The KaibanJS team may list or link to community projects here without taking ownership of the external codebase.
