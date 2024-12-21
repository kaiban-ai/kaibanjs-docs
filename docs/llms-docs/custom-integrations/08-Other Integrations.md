---
title: Other LLM Integrations
description: Overview of additional language model integrations available through LangChain in KaibanJS
---

> KaibanJS, through its integration with LangChain, supports a wide variety of language models beyond the main providers. This section provides an overview of additional LLM integrations you can use with your KaibanJS agents.

## Available Integrations

KaibanJS supports the following additional language model integrations through LangChain:

1. [**Alibaba Tongyi**](https://js.langchain.com/docs/integrations/chat/alibaba_tongyi): Supports the Alibaba qwen family of models.
2. [**Arcjet Redact**](https://js.langchain.com/docs/integrations/chat/arcjet_redact): Allows redaction of sensitive information.
3. [**Baidu Qianfan**](https://js.langchain.com/docs/integrations/chat/baidu_qianfan): Provides access to Baidu's language models.
4. [**Deep Infra**](https://js.langchain.com/docs/integrations/chat/deep_infra): Offers hosted language models.
5. [**Fireworks**](https://js.langchain.com/docs/integrations/chat/fireworks): AI inference platform for running large language models.
6. [**Friendli**](https://js.langchain.com/docs/integrations/chat/friendli): Enhances AI application performance and optimizes cost savings.
7. [**Llama CPP**](https://js.langchain.com/docs/integrations/chat/llama_cpp): (Node.js only) Enables use of Llama models.
8. [**Minimax**](https://js.langchain.com/docs/integrations/chat/minimax): Chinese startup providing natural language processing services.
9. [**Moonshot**](https://js.langchain.com/docs/integrations/chat/moonshot): Supports the Moonshot AI family of models.
10. [**PremAI**](https://js.langchain.com/docs/integrations/chat/premai): Offers access to PremAI models.
11. [**Tencent Hunyuan**](https://js.langchain.com/docs/integrations/chat/tencent_hunyuan): Supports the Tencent Hunyuan family of models.
12. [**Together AI**](https://js.langchain.com/docs/integrations/chat/together_ai): Provides an API to query 50+ open-source models.
13. [**WebLLM**](https://js.langchain.com/docs/integrations/chat/web_llm): (Web environments only) Enables browser-based LLM usage.
14. [**YandexGPT**](https://js.langchain.com/docs/integrations/chat/yandex): Supports calling YandexGPT chat models.
15. [**ZhipuAI**](https://js.langchain.com/docs/integrations/chat/zhipu_ai): Supports the Zhipu AI family of models.

## Integration Process

The general process for integrating these models with KaibanJS is similar to other custom integrations:

1. Install the necessary LangChain package for the specific integration.
2. Import the appropriate chat model class from LangChain.
3. Configure the model with the required parameters.
4. Use the configured model instance in your KaibanJS agent.

Here's a generic example of how you might integrate one of these models:

```javascript
import { SomeSpecificChatModel } from "@langchain/some-specific-package";

const customModel = new SomeSpecificChatModel({
  // Model-specific configuration options
  apiKey: process.env.SOME_API_KEY,
  // Other necessary parameters...
});

const agent = new Agent({
  name: 'Custom Model Agent',
  role: 'Assistant',
  goal: 'Provide assistance using a custom language model.',
  background: 'AI Assistant powered by a specific LLM integration',
  llmInstance: customModel
});
```

## Features and Compatibility

Different integrations offer varying levels of support for advanced features. Here's a general overview:

- **Streaming**: Most integrations support streaming responses.
- **JSON Mode**: Some integrations support structured JSON outputs.
- **Tool Calling**: Many integrations support function/tool calling capabilities.
- **Multimodal**: Some integrations support processing multiple types of data (text, images, etc.).

Refer to the specific LangChain documentation for each integration to understand its exact capabilities and configuration options.

## Best Practices

1. **Documentation**: Always refer to the latest LangChain documentation for the most up-to-date integration instructions.
2. **API Keys**: Securely manage API keys and other sensitive information using environment variables.
3. **Error Handling**: Implement robust error handling, as different integrations may have unique error patterns.
4. **Testing**: Thoroughly test the integration, especially when using less common or region-specific models.

## Limitations

- Some integrations may have limited documentation or community support.
- Certain integrations might be region-specific or have unique licensing requirements.
- Performance and capabilities can vary significantly between different integrations.

## Further Resources

- [LangChain Chat Models Documentation](https://js.langchain.com/docs/integrations/chat/)
- [LangChain GitHub Repository](https://github.com/langchain-ai/langchainjs)

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
