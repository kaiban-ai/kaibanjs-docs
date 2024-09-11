---
title: Serper Tool Example
description: Learn how to create a versatile search engine tool using Serper API that supports various search types, enhancing your Kaiban agents' capabilities, and how to use it in the Kaiban Board.
---

# Custom Serper Tool Example

This guide will show you how to create a custom Serper tool that can be used with Kaiban agents. [Serper](https://serper.dev/) is a powerful search engine API that supports a wide range of search types, including general search, image search, video search, and more.

By creating this custom tool, you can:
- Enable **Flexible Search Capabilities** for your agents, supporting various search types.
- Implement **Dynamic Query Handling** that automatically adjusts request parameters based on the specified search type.

:::tip[See It in Action!]
Want to see the Serper tool in action before diving into the code? We've got you covered! Click the link below to access a live demo of the tool running on the Kaiban Board.

[Try the Serper tool on the Kaiban Board](https://www.kaibanjs.com/share/cBjyih67gx7n7CKrsVmm)
:::

## Prerequisites

1. Sign up at [Serper](https://serper.dev/) to obtain an API key.
2. Ensure you have the necessary dependencies installed in your project.

## Creating the Custom Serper Tool

Here's how you can create a custom Serper tool for your Kaiban agents:

```javascript
import { Tool } from "@langchain/core/tools";
import { z } from "zod";

export class SerperTool extends Tool {
    constructor(fields) {
        super(fields);

        this.apiKey = fields.apiKey;
        this.params = fields.params;
        this.type = fields.type || 'search';

        this.name = "serper";
        this.description = `A powerful search engine tool for retrieving real-time information and answering questions about current events. Input should be a search query.`;

        // Set schema based on search type
        this.schema = this.type === 'webpage' 
            ? z.object({ url: z.string().describe("the URL to scrape") })
            : z.object({ query: z.string().describe("the query to search for") });
    }

    async _call(input) {
        let url = `https://google.serper.dev/${this.type}`;
        let bodyData = this.type === 'webpage'
            ? { url: input.url }
            : { q: input.query, ...this.params };

        if (this.type === 'webpage') {
            url = "https://scrape.serper.dev";
        }

        const options = {
            method: "POST",
            headers: {
                "X-API-KEY": this.apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
        };

        const res = await fetch(url, options);

        if (!res.ok) {
            throw new Error(`Got ${res.status} error from serper: ${res.statusText}`);
        }

        return await res.json();
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
   - The constructor initializes the tool with the provided fields, including the API key, parameters, and search type. It also sets the tool's name and description.
   - The schema is dynamically set based on the type of search. For example, if the type is 'webpage', the schema expects a URL; otherwise, it expects a search query.

4. **_call Method**:
   - The `_call` method is the core function that performs the search. It constructs the request URL and body based on the search type and sends a POST request to the Serper API.
   - If the response is not OK, it throws an error with the status and status text.
   - If the response is successful, it returns the JSON data.

:::important
The key to creating a highly reliable tool is to minimize its responsibilities and provide a clear, concise description for the LLM. This approach allows the LLM to understand the tool's purpose and use it effectively. In this example, the SerperTool has a single responsibility: performing searches. Its description clearly states its function, enabling the LLM to use it appropriately within the context of the agent's tasks.
:::

### How the Agent Uses the Tool

- When the agent needs to perform a search, it will call the `_call` method of the `SerperTool` with the parameters provided by the language model (LLM).
- The `_call` method processes the input, sends the request to the Serper API, and returns the response.
- The agent then uses this response to provide the necessary information or take further actions based on the search results.

## Using the Custom Serper Tool with Kaiban Agents

After creating the custom Serper tool, you can use it with your Kaiban agents as follows:

```javascript
import { Agent } from 'kaibanjs';
import { SerperTool } from './SerperTool';  // Import your custom tool

// Create an instance of the SerperTool
const serperTool = new SerperTool({
  apiKey: "YOUR_SERPER_API_KEY",
  type: "search"  // or any other supported type
});

// Create a Kaiban agent with the Serper tool
const researchAgent = new Agent({
    name: 'Alice', 
    role: 'Research Assistant', 
    goal: 'Conduct comprehensive online research on various topics.',
    background: 'Experienced web researcher with advanced search skills.',
    tools: [serperTool]
});

// Use the agent in your Kaiban workflow
// ... (rest of your Kaiban setup)
```

## Supported Search Types

The SerperTool supports various search types, which you can specify when creating an instance:

- `"search"` (default): General search queries
- `"images"`: Image search
- `"videos"`: Video search
- `"places"`: Location-based search
- `"maps"`: Map search
- `"news"`: News search
- `"shopping"`: Shopping search
- `"scholar"`: Academic publications search
- `"patents"`: Patent search
- `"webpage"`: Web page scraping (Beta)

## Using the Serper Tool in Kaiban Board

:::tip[Try it Out in the Playground!]
Before diving into the installation and coding, why not experiment directly with our interactive playground? [Try it now!](https://www.kaibanjs.com/share/cBjyih67gx7n7CKrsVmm)
:::

The Serper tool is also available for use directly in the [Kaiban Board](https://www.kaibanjs.com/playground), our interactive playground for building and testing AI workflows. Here's how you can use it:

1. Access the Kaiban Board at [https://www.kaibanjs.com/playground](https://www.kaibanjs.com/playground).
2. In the code editor, you can create an instance of the SerperTool without importing it:

```javascript
const tool = new SerperTool({
  apiKey: "ENV_SERPER_API_KEY",
  type: "search"  // or any other supported type
});

const researchAgent = new Agent({
    name: 'Alice', 
    role: 'Research Assistant', 
    goal: 'Conduct comprehensive online research on various topics.',
    background: 'Experienced web researcher with advanced search skills.',
    tools: [tool]
});
```

3. Use this agent in your Kaiban Board workflow, allowing it to perform searches and retrieve information as part of your AI process.

## Conclusion

By creating and using this custom Serper tool, you've significantly enhanced your Kaiban agents' ability to perform various types of online searches and web scraping tasks. Whether you're using it in your own code or in the Kaiban Board, this tool provides a flexible and powerful way to integrate real-time information retrieval into your AI workflows.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::


