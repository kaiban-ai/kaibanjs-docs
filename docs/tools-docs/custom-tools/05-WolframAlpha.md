---
title: WolframAlpha Tool Example
description: Learn how to create a powerful computational tool using the WolframAlpha API that supports complex queries and scientific computations, enhancing your Kaiban agents' capabilities, and how to use it in the Kaiban Board.
---

# Custom WolframAlpha Tool Example

This guide will show you how to create a custom WolframAlpha tool that can be used with Kaiban agents. [WolframAlpha](https://www.wolframalpha.com/) is a powerful computational knowledge engine that provides detailed and accurate answers to complex queries across various scientific and mathematical domains.

By creating this custom tool, you can:
- Enable **Advanced Computational Capabilities** for your agents, supporting complex mathematical and scientific calculations.
- Implement **Data Analysis and Retrieval** from WolframAlpha's vast knowledge base.
- Ensure **Scientific Accuracy** in your agents' responses across various domains.

:::tip[See It in Action!]
Want to see the WolframAlpha tool in action before diving into the code? We've got you covered! Click the link below to access a live demo of the tool running on the Kaiban Board.

[Try the WolframAlpha tool on the Kaiban Board](https://www.kaibanjs.com/share/VyfPFnQHiKxtr2BUkY9F)
:::

## Prerequisites

1. Sign up at the [WolframAlpha Developer Portal](https://developer.wolframalpha.com/) to obtain an App ID.
2. Ensure you have the necessary dependencies installed in your project.

## Creating the Custom WolframAlpha Tool

Here's how you can create a custom WolframAlpha tool for your Kaiban agents:

```javascript
import { Tool } from "@langchain/core/tools";
import { z } from "zod";

export class WolframAlphaTool extends Tool {
    constructor(fields) {
        super(fields);
        this.appId = fields.appId;
        this.name = "wolfram_alpha";
        this.description = `This tool leverages the computational intelligence of WolframAlpha to provide robust and detailed answers to complex queries. It allows users to perform advanced computations, data analysis, and retrieve scientifically accurate information across a wide range of domains, including mathematics, physics, engineering, astronomy, and more.`;
        this.schema = z.object({
            query: z.string().describe("the query to send to WolframAlpha"),
        });
    }
    async _call(input) {
        const url = '/proxy/wolframalpha';
        const body = JSON.stringify({ query: input.query });
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-APP-ID': this.appId,
            },
            body: body
        });
        return res.json();
    }
}
```

### Explanation of the Code

1. **LangChain Tool Specs**:
   - We are using the `Tool` class from LangChain to create our custom tool. LangChain provides a framework for building tools that can be called by AI models. You can read more about LangChain Tool specifications [here](https://js.langchain.com/v0.2/docs/how_to/custom_tools/).

2. **Importing `zod`**:
   - `import { z } from "zod";`
   - `zod` is a TypeScript-first schema declaration and validation library. We use it to define and validate the input schema for our tool. This ensures that the input provided to the tool is in the correct format.

3. **Constructor**:
   - The constructor initializes the tool with the provided App ID, sets the tool's name and description, and defines the input schema.

4. **_call Method**:
   - The `_call` method is the core function that performs the query. It sends a POST request to the WolframAlpha API proxy with the query and returns the JSON response.

:::important
The WolframAlphaTool is designed with a single, clear responsibility: performing complex computations and retrieving scientific data. Its concise description allows the LLM to understand its purpose and use it effectively within the context of the agent's tasks.
:::

### How the Agent Uses the Tool

- When the agent needs to perform a computation or retrieve scientific data, it will call the `_call` method of the `WolframAlphaTool` with the query provided by the language model (LLM).
- The `_call` method processes the input, sends the request to the WolframAlpha API, and returns the response.
- The agent then uses this response to provide accurate computational results, scientific information, or take further actions based on the retrieved data.

## Using the Custom WolframAlpha Tool with Kaiban Agents

After creating the custom WolframAlpha tool, you can use it with your Kaiban agents as follows:

```javascript
import { Agent } from 'kaibanjs';
import { WolframAlphaTool } from './WolframAlphaTool';  // Import your custom tool

// Create an instance of the WolframAlphaTool
const wolframTool = new WolframAlphaTool({
  appId: "YOUR_WOLFRAM_APP_ID",
});

// Create a Kaiban agent with the WolframAlpha tool
const scientificAnalyst = new Agent({
    name: 'Eve', 
    role: 'Scientific Analyst', 
    goal: 'Perform complex computations and provide accurate scientific data for research and educational purposes.',
    background: 'Research Scientist with expertise in various scientific domains',
    tools: [wolframTool]
});

// Use the agent in your Kaiban workflow
// ... (rest of your Kaiban setup)
```

## Using the WolframAlpha Tool in Kaiban Board

The WolframAlpha tool is also available for use directly in the [Kaiban Board](https://www.kaibanjs.com/playground), our interactive playground for building and testing AI workflows. Here's how you can use it:

1. Access the Kaiban Board at [https://www.kaibanjs.com/playground](https://www.kaibanjs.com/playground).
2. In the code editor, you can create an instance of the WolframAlphaTool without importing it:

```javascript
const tool = new WolframAlphaTool({
  appId: "ENV_WOLFRAM_APP_ID",
});

const scientificAnalyst = new Agent({
    name: 'Eve', 
    role: 'Scientific Analyst', 
    goal: 'Perform complex computations and provide accurate scientific data for research and educational purposes.',
    background: 'Research Scientist with expertise in various scientific domains',
    tools: [tool]
});
```

3. Use this agent in your Kaiban Board workflow, allowing it to perform complex computations and retrieve scientific data as part of your AI process.

## Conclusion

By creating and using this custom WolframAlpha tool, you've significantly enhanced your Kaiban agents' ability to perform advanced computations and retrieve accurate scientific data across various domains. Whether you're using it in your own code or in the Kaiban Board, this tool provides a powerful way to integrate computational intelligence into your AI workflows.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::