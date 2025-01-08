---
title: Custom Agent Prompts
description: Learn how to customize agent prompts in KaibanJS to tailor AI agent behavior and responses for specific use cases.
---

## Introduction

KaibanJS now supports custom agent prompts, allowing developers to fine-tune the behavior and responses of AI agents. This feature enables you to adapt agents to specific use cases or requirements, enhancing the flexibility and power of your multi-agent AI systems.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

## How to Implement Custom Prompts

To use custom prompts, you need to provide a `promptTemplates` object when initializing an agent. This object can contain one or more prompt types that you wish to customize.

### Basic Usage

Here's a simple example of how to create an agent with custom prompts:

```javascript
import { Agent } from 'kaibanjs';

const customPrompts = {
    SYSTEM_MESSAGE: ({ agent, task }) => `You are ${agent.name}, an AI assistant specialized in ${agent.role}. Your task is: ${task.description}`,
    INITIAL_MESSAGE: ({ agent, task }) => `Hello ${agent.name}, please complete this task: ${task.description}`,
};

const agent = new Agent({
    name: 'CustomAgent',
    role: 'Specialized Assistant',
    goal: 'Provide tailored responses',
    promptTemplates: customPrompts
});
```

### Available Prompt Types

You can customize the following prompt types:

- `SYSTEM_MESSAGE`: Sets up the initial context and instructions for the agent.
- `INITIAL_MESSAGE`: Provides the task description to the agent.
- `INVALID_JSON_FEEDBACK`: Feedback when the agent's response is not in valid JSON format.
- `THOUGHT_WITH_SELF_QUESTION_FEEDBACK`: Feedback for a thought that includes a self-question.
- `THOUGHT_FEEDBACK`: Feedback for a general thought from the agent.
- `SELF_QUESTION_FEEDBACK`: Feedback for a self-question from the agent.
- `TOOL_RESULT_FEEDBACK`: Feedback after a tool has been used.
- `TOOL_ERROR_FEEDBACK`: Feedback when an error occurs while using a tool.
- `TOOL_NOT_EXIST_FEEDBACK`: Feedback when the agent tries to use a non-existent tool.
- `OBSERVATION_FEEDBACK`: Feedback for an observation made by the agent.
- `WEIRD_OUTPUT_FEEDBACK`: Feedback when the agent's output doesn't match the expected format.
- `FORCE_FINAL_ANSWER_FEEDBACK`: Forces the agent to return the final answer.
- `WORK_ON_FEEDBACK_FEEDBACK`: Provides feedback to the agent based on received feedback.

Take a look at the code of the prompts in the [src/utils/prompts.js](https://github.com/kaiban-ai/KaibanJS/blob/main/src/utils/prompts.js#L18) file.

### Advanced Usage

For more complex scenarios, you can create dynamic prompts that utilize the full context of the agent and task:

```javascript
const advancedCustomPrompts = {
    SYSTEM_MESSAGE: ({ agent, task }) => `
        You are ${agent.name}, a ${agent.role} with the following background: ${agent.background}.
        Your main goal is: ${agent.goal}.
        You have access to these tools: ${agent.tools.map(tool => tool.name).join(', ')}.
        Please complete the following task: ${task.description}
        Expected output: ${task.expectedOutput}
    `,
    TOOL_ERROR_FEEDBACK: ({ agent, task, toolName, error }) => `
        An error occurred while using the tool ${toolName}. 
        Error message: ${error}
        Please try an alternative approach to complete your task: ${task.description}
    `,
};

const advancedAgent = new Agent({
    name: 'AdvancedAgent',
    role: 'Multi-tool Specialist',
    background: 'Extensive experience in data analysis and problem-solving',
    goal: 'Provide comprehensive solutions using available tools',
    tools: [/* list of tools */],
    promptTemplates: advancedCustomPrompts
});
```

## Best Practices

1. **Maintain Consistency**: Ensure your custom prompts align with the overall goals and context of your AI system.
2. **Use Dynamic Content**: Leverage the provided context (`agent`, `task`, etc.) to create more relevant and adaptive prompts.
3. **Balance Flexibility and Structure**: While customizing, maintain a structure that guides the agent towards completing tasks effectively.
4. **Test Thoroughly**: After implementing custom prompts, test your agents in various scenarios to ensure they behave as expected.

## Conclusion

Custom agent prompts in KaibanJS offer a powerful way to tailor your AI agents' behavior and responses. By carefully crafting these prompts, you can create more specialized and effective multi-agent systems that are perfectly suited to your specific use cases.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::