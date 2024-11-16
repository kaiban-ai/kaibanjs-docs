---
title: Wolfram Alpha
description: Wolfram Alpha is a computational knowledge engine that provides precise calculations and scientific data analysis.
---

# Wolfram Alpha Tool

## Description

[Wolfram Alpha](https://www.wolframalpha.com/) is a powerful computational knowledge engine that provides precise calculations, mathematical analysis, and scientific data processing capabilities.

Enhance your agents with:
- **Mathematical Computations**: Solve complex mathematical problems
- **Scientific Analysis**: Process scientific queries and calculations
- **Data Visualization**: Access visual representations of data
- **Formula Processing**: Work with mathematical and scientific formulas

## Installation

First, install the KaibanJS tools package:

```bash
npm install @kaibanjs/tools
```

## API Key
Before using the tool, ensure that you have created an App ID at [Wolfram Alpha Developer Portal](https://developer.wolframalpha.com/) to enable computational functionality.

## Example

Here's how to use the Wolfram Alpha tool to create a scientific computing team:

```javascript
import { WolframAlphaTool } from '@kaibanjs/tools';

// Configure Wolfram tool
const wolframTool = new WolframAlphaTool({
  appId: 'your-wolfram-app-id'
});

// Create computation agent
const mathScientist = new Agent({
  name: 'Euler',
  role: 'Mathematical and Scientific Analyst',
  goal: 'Solve complex mathematical and scientific problems',
  background: 'Advanced Mathematics and Scientific Computing',
  tools: [wolframTool]
});

// Create a team
const team = new Team({
  name: 'Scientific Computing Team',
  agents: [mathScientist],
  tasks: [/* your tasks */],
  inputs: {
    query: 'Calculate the orbital period of Mars around the Sun'
  }
});
```

## Parameters

- `appId` **Required**. The App ID generated from [Wolfram Alpha Developer Portal](https://developer.wolframalpha.com/). Provide your App ID directly as a string.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::