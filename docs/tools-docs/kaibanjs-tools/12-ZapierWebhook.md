---
title: Zapier Webhook
description: Zapier Webhook is a tool that enables seamless integration with Zapier's automation platform, allowing you to trigger workflows and connect with thousands of apps.
---

# Zapier Webhook Tool

## Description

[Zapier](https://zapier.com/) is a powerful automation platform that connects thousands of apps and services. The Zapier Webhook tool enables AI agents to trigger workflows and automate tasks across various applications using Zapier's webhook functionality.

![Zapier Webhook Tool](https://res.cloudinary.com/dnno8pxyy/image/upload/v1734696064/Zapier_dwmusd.png)

Enhance your agents with:
- **Multi-App Integration**: Connect with thousands of apps and services
- **Flexible Automation**: Trigger complex workflows with a single webhook
- **Structured Data**: Send formatted data using Zod schema validation
- **Secure Communication**: Built-in security features and environment variable support

## Installation

First, install the KaibanJS tools package:

```bash
npm install @kaibanjs/tools
```

## Webhook URL
Before using the tool, ensure that you have created a webhook trigger in Zapier and obtained the webhook URL. This URL will be used to send data to your Zap.

## Example

Here's how to use the Zapier Webhook tool to send notifications and trigger automations:

```javascript
import { ZapierWebhook } from '@kaibanjs/tools';
import { z } from 'zod';

const webhookTool = new ZapierWebhook({
    url: 'YOUR_ZAPIER_WEBHOOK_URL',
    schema: z.object({
        message: z.string().describe('Message content'),
        channel: z.string().describe('Target channel'),
        priority: z.enum(['high', 'medium', 'low']).describe('Message priority')
    })
});

const notificationAgent = new Agent({
    name: 'NotifyBot',
    role: 'Notification Manager',
    goal: 'Send timely and relevant notifications through various channels',
    background: 'Communication Specialist',
    tools: [webhookTool]
});
```

## Parameters

- `url` **Required**. The webhook URL from your Zapier trigger. Store this in an environment variable for security.
- `schema` **Required**. A Zod schema that defines the structure of the data you'll send to Zapier.

## Common Use Cases

1. **Notifications**
   - Send email alerts
   - Post to chat platforms
   - Push mobile notifications

2. **Data Integration**
   - Update spreadsheets
   - Create tasks
   - Log events

3. **Workflow Automation**
   - Trigger multi-step Zaps
   - Start automated processes
   - Connect multiple services

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