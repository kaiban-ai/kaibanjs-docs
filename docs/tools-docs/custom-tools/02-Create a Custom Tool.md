---
title: Create a Custom Tool
description: Learn how to create and integrate custom tools for Kaiban agents, extending their capabilities with external APIs, services, or npm utilities.
---

# Create a Custom Tool

This tutorial will guide you through the process of creating a custom tool for use with Kaiban agents. Custom tools allow you to extend the capabilities of your AI agents by integrating external APIs, services, or npm utilities.

## Introduction

Custom tools in Kaiban are based on the LangChain `Tool` class and allow you to define specific functionalities that your agents can use. By creating custom tools, you can give your agents access to a wide range of capabilities, from web searches to complex computations.

## How Tools Work with Agents and LLMs

Understanding the interaction between tools, agents, and Language Models (LLMs) is crucial:

1. The agent, guided by the LLM, identifies a need for specific information or action.
2. The agent selects the appropriate tool based on its description and the current task.
3. The LLM generates the necessary input for the tool.
4. The agent calls the tool's `_call` method with this input.
5. The tool processes the input, performs its specific function (e.g., API call, computation), and returns the result.
6. The agent receives the tool's output and passes it back to the LLM.
7. The LLM interprets the result and decides on the next action or provides a response.

This process allows agents to leverage specialized functionalities while the LLM handles the high-level reasoning and decision-making.

## Prerequisites

Before you begin, make sure you have:

1. A basic understanding of JavaScript and async/await syntax.
2. Kaiban and LangChain libraries installed in your project.
3. Access to the API or service you want to integrate (if applicable).

## Step-by-Step Guide

### Step 1: Import Required Dependencies

Start by importing the necessary classes and libraries:

```javascript
import { Tool } from "@langchain/core/tools";
import { z } from "zod";
```

The `Tool` class from LangChain provides a standardized interface for creating custom tools. It ensures that your tool can be seamlessly integrated with Kaiban agents and LLMs. The `Tool` class handles the interaction between the agent and your custom functionality, making it easier to extend your agents' capabilities.

`Zod` is a TypeScript-first schema declaration and validation library. In the context of custom tools, Zod is used to:

1. Define the expected structure of the input that your tool will receive.
2. Validate the input at runtime, ensuring that your tool receives correctly formatted data.
3. Provide clear error messages if the input doesn't match the expected schema.

Using Zod enhances the reliability and ease of use of your custom tools.

### Step 2: Define Your Custom Tool Class

Create a new class that extends the `Tool` class:

```javascript
export class CustomTool extends Tool {
    constructor(fields) {
        super(fields);
        // Initialize any required fields
        this.apiKey = fields.apiKey;
        
        // Set the tool's name and description
        this.name = "custom_tool";
        this.description = `Describe what your tool does and how it should be used.`;
        
        // Define the input schema using zod
        this.schema = z.object({
            query: z.string().describe("Describe the expected input"),
        });
    }

    async _call(input) {
        // Implement the core functionality of your tool here
        // This method will be called when the agent uses the tool
        // Process the input and return the result
    }
}
```

### Step 3: Implement the `_call` Method

The `_call` method is where you implement the main functionality of your tool. This method should:

1. Process the input
2. Make any necessary API calls or perform computations
3. Return the result

Here's an example:

```javascript
async _call(input) {
    const url = 'https://api.example.com/endpoint';
    const body = JSON.stringify({ query: input.query });
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
        },
        body: body
    });
    return res.json();
}
```

### Step 4: Use Your Custom Tool with a Kaiban Agent

Once you've created your custom tool, you can use it with a Kaiban agent:

```javascript
import { Agent } from 'kaibanjs';
import { CustomTool } from './CustomTool';

const customTool = new CustomTool({
  apiKey: "YOUR_API_KEY",
});

const agent = new Agent({
    name: 'CustomAgent', 
    role: 'Specialized Task Performer', 
    goal: 'Utilize the custom tool to perform specific tasks.',
    background: 'Expert in using specialized tools for task completion',
    tools: [customTool]
});

// Use the agent in your Kaiban workflow
```

:::important
The key to creating a highly reliable tool is to minimize its responsibilities and provide a clear, concise description for the LLM. This approach allows the LLM to understand the tool's purpose and use it effectively.
:::

## Ideas for Custom Tools

You can create a wide variety of custom tools using npm packages or external APIs. Here are some ideas:

1. **Web Scraping Tool** (using Puppeteer):
   - Scrape dynamic web content or take screenshots of web pages.
   ```javascript
   import puppeteer from 'puppeteer';

   class WebScraperTool extends Tool {
     async _call(input) {
       const browser = await puppeteer.launch();
       const page = await browser.newPage();
       await page.goto(input.url);
       const content = await page.content();
       await browser.close();
       return content;
     }
   }
   ```

2. **PDF Processing Tool** (using pdf-parse):
   - Extract text from PDF files.
   ```javascript
   import pdf from 'pdf-parse';

   class PDFExtractorTool extends Tool {
     async _call(input) {
       const dataBuffer = await fs.promises.readFile(input.filePath);
       const data = await pdf(dataBuffer);
       return data.text;
     }
   }
   ```

3. **Image Analysis Tool** (using sharp):
   - Analyze or manipulate images.
   ```javascript
   import sharp from 'sharp';

   class ImageAnalyzerTool extends Tool {
     async _call(input) {
       const metadata = await sharp(input.imagePath).metadata();
       return metadata;
     }
   }
   ```

4. **Natural Language Processing Tool** (using natural):
   - Perform NLP tasks like tokenization or sentiment analysis.
   ```javascript
   import natural from 'natural';

   class NLPTool extends Tool {
     async _call(input) {
       const tokenizer = new natural.WordTokenizer();
       return tokenizer.tokenize(input.text);
     }
   }
   ```

5. **Database Query Tool** (using a database driver):
   - Execute database queries and return results.
   ```javascript
   import { MongoClient } from 'mongodb';

   class DatabaseQueryTool extends Tool {
     async _call(input) {
       const client = new MongoClient(this.dbUrl);
       await client.connect();
       const db = client.db(this.dbName);
       const result = await db.collection(input.collection).find(input.query).toArray();
       await client.close();
       return result;
     }
   }
   ```

These are just a few examples. The possibilities for custom tools are virtually limitless, allowing you to extend your agents' capabilities to suit your specific needs.

## Best Practices

1. **Clear Description**: Provide a clear and concise description of your tool's functionality to help the LLM understand when and how to use it.

2. **Input Validation**: Use zod to define a clear schema for your tool's input, ensuring that it receives the correct data types.

3. **Error Handling**: Implement robust error handling in your `_call` method to gracefully manage API errors or unexpected inputs.

4. **Modularity**: Design your tool to have a single, well-defined responsibility. This makes it easier to use and maintain.

5. **Documentation**: Comment your code and provide usage examples to make it easier for others (or yourself in the future) to understand and use your custom tool.

## Conclusion

Creating custom tools allows you to significantly extend the capabilities of your Kaiban agents. By following this tutorial and exploring various npm packages and APIs, you can create a wide range of specialized tools, enabling your agents to perform complex and diverse tasks.

:::info[We Love Feedback!]
Is there something unclear or quirky in this tutorial? Have a suggestion or spotted an issue? Help us improve by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). Your input is valuable!
:::