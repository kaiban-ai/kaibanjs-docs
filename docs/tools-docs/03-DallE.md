---
title: Dall-E Tool
description: Dall-E by OpenAI is an advanced AI model that generates images from textual descriptions.
---

# Dall-E Tool

## Description

[DALL-E](https://openai.com/index/dall-e-3/) by OpenAI is an advanced AI model that generates images from textual descriptions. This tool allows you to integrate DALL-E's capabilities into your applications, enabling the creation of unique and creative visual content based on specified prompts.

Enhance your agents with:
- **AI-Generated Imagery**: Create custom images based on textual input using state-of-the-art AI technology.
- **Creative Flexibility**: Use specific prompts to guide the generation of visuals, tailored to your needs.

## Installation

Before using the tool, ensure you have created an API Key at [OpenAI](https://openai.com/) to enable image generation functionality.

## Example

Utilize the DallEAPIWrapper tool as follows to enable your agent to generate images based on specific prompts:

```js
import { DallEAPIWrapper } from "@langchain/openai";

const dallE = new DallEAPIWrapper({
  n: 1, // If it is not 1 it gives an error
  model: "dall-e-3", // Default
  apiKey: 'ENV_OPENAI_API_KEY',
});

const creativeDesigner = new Agent({
    name: 'Mary', 
    role: 'Creative Designer', 
    goal: 'Generate unique and creative visual content based on specific prompts and concepts.', 
    background: 'Digital Artist',
    tools: [dallE]
});
```

## Parameters

- `n` **Required**. Number of images to generate. Must be set to `1` to avoid errors.
- `model` **Required**. The model version to use. Default is `"dall-e-3"`.
- `apiKey` **Required**. The API key generated from [OpenAI](https://openai.com/). Set `'ENV_OPENAI_API_KEY'` as an environment variable or replace it directly with your API key.
