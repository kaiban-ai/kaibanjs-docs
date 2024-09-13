---
title: Custom LLM Integrations
description: Guide to integrating custom Language Models in KaibanJS.
---

KaibanJS allows for custom LLM integrations, enabling you to use models beyond the built-in options. 

To integrate a custom LLM:

1. Implement the LLM interface provided by KaibanJS.
2. Configure your agent to use the custom LLM:

```js
const customLLM = new YourCustomLLM();

const agent = new Agent({
    name: 'Custom Agent',
    llmConfig: {
        provider: 'custom',
        model: customLLM,
    }
});
```

For detailed integration steps and best practices, refer to our full documentation.

