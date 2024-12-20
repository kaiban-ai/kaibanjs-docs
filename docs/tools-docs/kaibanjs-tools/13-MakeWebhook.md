---
title: Make Webhook
description: Make Webhook is a tool that enables seamless integration with Make's automation platform (formerly Integromat), allowing you to trigger scenarios and connect with thousands of apps.
---

# Make Webhook Tool

## Description

[Make](https://www.make.com/) (formerly Integromat) is a powerful automation platform that connects thousands of apps and services. The Make Webhook tool enables AI agents to trigger scenarios and automate tasks across various applications using Make's webhook functionality.

![Make Webhook Tool](https://res.cloudinary.com/dnno8pxyy/image/upload/v1734696064/Make_cgad8u.png)

Enhance your agents with:
- **Multi-App Integration**: Connect with thousands of apps and services
- **Scenario Automation**: Trigger complex scenarios with a single webhook
- **Structured Data**: Send formatted data using Zod schema validation
- **Secure Communication**: Built-in security features and environment variable support

## Installation

First, install the KaibanJS tools package:

```bash
npm install @kaibanjs/tools
```

## Webhook URL
Before using the tool, ensure that you have created a webhook trigger in Make and obtained the webhook URL. This URL will be used to send data to your scenario.

## Example

Here's how to use the Make Webhook tool to send data and trigger automations:

```javascript
import { MakeWebhook } from '@kaibanjs/tools';
import { z } from 'zod';

const webhookTool = new MakeWebhook({
    url: 'YOUR_MAKE_WEBHOOK_URL',
    schema: z.object({
        event: z.string().describe('Event type'),
        data: z.object({
            id: z.string(),
            timestamp: z.string(),
            details: z.record(z.any())
        }).describe('Event data'),
        source: z.string().describe('Event source')
    })
});

const automationAgent = new Agent({
    name: 'AutoBot',
    role: 'Automation Manager',
    goal: 'Trigger and manage automated workflows across various systems',
    background: 'System Integration Specialist',
    tools: [webhookTool]
});
```

## Parameters

- `url` **Required**. The webhook URL from your Make trigger. Store this in an environment variable for security.
- `schema` **Required**. A Zod schema that defines the structure of the data you'll send to Make.

## Common Use Cases

1. **Data Processing**
   - Transform data formats
   - Filter and route information
   - Aggregate multiple sources

2. **System Integration**
   - Connect applications
   - Sync data between systems
   - Automate workflows

3. **Event Processing**
   - Handle real-time events
   - Process webhooks
   - Trigger automated responses

## Best Practices

1. **Security**
   - Store webhook URLs in environment variables
   - Use HTTPS endpoints only
   - Never expose URLs in client-side code

2. **Data Validation**
   - Define clear schemas
   - Validate input types
   - Handle edge cases

3. **Error Handling**
   - Implement proper error handling
   - Monitor webhook responses
   - Handle rate limits

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
::: 