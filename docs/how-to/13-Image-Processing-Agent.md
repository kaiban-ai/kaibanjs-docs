---
title: Image Processing Agent
description: Learn how to create an AI agent that can analyze and process images using multimodal language models in KaibanJS.
---

> Create powerful image processing agents with KaibanJS using multimodal language models. These agents can analyze images, extract text, identify objects, and generate comprehensive reports about visual content.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

:::tip[Try it Out in the Playground!]
Curious about how image processing agents work? Explore a complete example interactively in our playground. [Try it now!](https://github.com/kaiban-ai/KaibanJS/blob/main/playground/react/)
:::

## Introduction

Image processing agents in KaibanJS leverage multimodal language models to understand and analyze visual content. These agents can perform a wide range of tasks including object detection, text extraction (OCR), image description, document analysis, and content moderation.

## Supported Multimodal Models

KaibanJS supports several multimodal models that can process both text and images:

### OpenAI Models

- **GPT-4o**: Advanced multimodal capabilities with excellent image understanding
- **GPT-4o-mini**: Cost-effective option with solid image processing features

### Anthropic Models

- **Claude 3.5 Sonnet**: Superior image analysis with detailed visual understanding
- **Claude 3 Opus**: Most advanced vision capabilities for complex image tasks

### Google Models

- **Gemini 1.5 Pro**: Excellent multimodal performance with strong image comprehension
- **Gemini 1.5 Flash**: Fast and efficient for basic image processing tasks

:::tip[Model Selection]
For the best image processing results, we recommend using **Claude 3.5 Sonnet** or **GPT-4o** as they provide the most comprehensive visual understanding capabilities.
:::

## Implementation Guide

### Step 1: Define Specialized Agents

Create agents with specific roles for image analysis and content formatting:

```javascript
import { Agent, Task, Team } from 'kaibanjs';

// Vision analysis agent
const visionAnalyst = new Agent({
  name: 'Vision Scout',
  role: 'Image Analyzer',
  goal: 'Analyze images comprehensively and extract detailed information including objects, text, colors, style, and document-specific details.',
  background:
    'Computer vision specialist with expertise in image analysis, OCR, and visual content interpretation',
  tools: [],
  llmConfig: {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20240620' // Excellent for image analysis
  }
});

// Content formatting agent
const contentFormatter = new Agent({
  name: 'Report Writer',
  role: 'Content Formatter',
  goal: 'Format the image analysis results into a well-structured markdown report with embedded image.',
  background: 'Technical writing and content formatting specialist',
  tools: [],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini' // Cost-effective for formatting tasks
  }
});
```

### Step 2: Create Analysis Tasks

Define tasks that process images and format the results:

```javascript
// Image analysis task
const imageAnalysisTask = new Task({
  description: `Analyze the provided image URL: {imageUrl}
  
  Please provide a comprehensive analysis including:
  - General description of the image content
  - Objects, people, animals, or items visible
  - Text content (if any) - read all visible text
  - Colors and visual style
  - For documents (passports, IDs, etc.): extract all visible fields, numbers, dates, names
  - Composition and layout
  - Any special features or notable elements
  - Quality and clarity of the image`,
  expectedOutput:
    'Detailed analysis of the image with all requested information extracted',
  agent: visionAnalyst
});

// Report formatting task
const markdownReportTask = new Task({
  description: `Create a comprehensive markdown report based on the image analysis results.
  
  The report should include:
  - The original image displayed using markdown image syntax. Image url: {imageUrl}
  - A well-structured analysis with clear sections
  - Proper formatting for readability
  - All extracted information organized logically`,
  expectedOutput:
    'Complete markdown report with embedded image and detailed analysis',
  agent: contentFormatter
});
```

### Step 3: Configure the Team

Set up the team with proper environment variables and inputs:

```javascript
// Create the image processing team
const team = new Team({
  name: 'Image Analysis Team',
  agents: [visionAnalyst, contentFormatter],
  tasks: [imageAnalysisTask, markdownReportTask],
  inputs: {
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face'
  },
  env: {
    OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
    ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY
  }
});

export default team;
```

## Complete Example

Here's a complete implementation of an image processing agent:

```javascript
import { Agent, Task, Team } from 'kaibanjs';

// Define agents
const visionAnalyst = new Agent({
  name: 'Vision Scout',
  role: 'Image Analyzer',
  goal: 'Analyze images comprehensively and extract detailed information including objects, text, colors, style, and document-specific details.',
  background:
    'Computer vision specialist with expertise in image analysis, OCR, and visual content interpretation',
  tools: [],
  llmConfig: {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20240620'
  }
});

const contentFormatter = new Agent({
  name: 'Report Writer',
  role: 'Content Formatter',
  goal: 'Format the image analysis results into a well-structured markdown report with embedded image.',
  background: 'Technical writing and content formatting specialist',
  tools: [],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4o-mini'
  }
});

// Define tasks
const imageAnalysisTask = new Task({
  description: `Analyze the provided image URL: {imageUrl}
  
  Please provide a comprehensive analysis including:
  - General description of the image content
  - Objects, people, animals, or items visible
  - Text content (if any) - read all visible text
  - Colors and visual style
  - For documents (passports, IDs, etc.): extract all visible fields, numbers, dates, names
  - Composition and layout
  - Any special features or notable elements
  - Quality and clarity of the image`,
  expectedOutput:
    'Detailed analysis of the image with all requested information extracted',
  agent: visionAnalyst
});

const markdownReportTask = new Task({
  description: `Create a comprehensive markdown report based on the image analysis results.
  
  The report should include:
  - The original image displayed using markdown image syntax. Image url: {imageUrl}
  - A well-structured analysis with clear sections
  - Proper formatting for readability
  - All extracted information organized logically`,
  expectedOutput:
    'Complete markdown report with embedded image and detailed analysis',
  agent: contentFormatter
});

// Create a team
const team = new Team({
  name: 'Image Analysis Team',
  agents: [visionAnalyst, contentFormatter],
  tasks: [imageAnalysisTask, markdownReportTask],
  inputs: {
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face'
  },
  env: {
    OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
    ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY
  }
});

export default team;
```

## Use Cases

Image processing agents can be used for various applications:

### Document Analysis

- Extract text from documents, forms, and certificates
- Analyze ID cards, passports, and official documents
- Process invoices and receipts

### Content Moderation

- Detect inappropriate content in images
- Identify objects and scenes for content categorization
- Analyze product images for e-commerce

### Medical Imaging

- Analyze X-rays, MRIs, and other medical scans
- Extract information from medical reports
- Process lab results and charts

### Social Media Analysis

- Analyze user-generated content
- Extract metadata from images
- Process profile pictures and cover photos

## Best Practices

### 1. Model Selection

- Use **Claude 3.5 Sonnet** or **GPT-4o** for complex image analysis
- Use **GPT-4o-mini** or **Gemini 1.5 Flash** for simple tasks to reduce costs
- Consider **Gemini 1.5 Pro** for balanced performance and cost

### 2. Task Design

- Be specific about what information you want extracted
- Include examples in your task descriptions
- Break complex analyses into multiple tasks

### 3. Error Handling

- Handle cases where images cannot be accessed
- Provide fallback behavior for unsupported image formats
- Implement retry logic for API failures

### 4. Performance Optimization

- Cache analysis results for repeated images
- Use appropriate image sizes (not too large, not too small)
- Consider using different models for different complexity levels

## Advanced Features

### Image URL Requirements

When working with image processing agents, it's important to understand the different ways images can be provided to multimodal models:

#### Public URLs (Recommended)

Most multimodal models work best with publicly accessible image URLs:

```javascript
const team = new Team({
  name: 'Image Analysis Team',
  agents: [visionAnalyst, contentFormatter],
  tasks: [imageAnalysisTask, markdownReportTask],
  inputs: {
    imageUrl: 'https://example.com/public-image.jpg' // Must be publicly accessible
  },
  env: {
    OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
    ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY
  }
});
```

#### Base64 Encoding (Limited Support)

Some models support base64-encoded images, but this approach has limitations:

- **File Size**: Base64 encoding increases file size by ~33%, making it inefficient for large images
- **Token Limits**: Large base64 strings consume significant tokens, reducing available context
- **Model Support**: Not all models support base64 input reliably

#### API Upload Services

Many providers offer dedicated image upload APIs that return public URLs:

- **OpenAI**: Provides image upload endpoints for GPT-4 Vision
- **Anthropic**: Supports image uploads with URL generation
- **Google**: Offers image processing through their AI services

### Custom Tools for Image Processing

Create custom tools to handle different image input methods:

```javascript
import { Tool } from 'kaibanjs';

// Custom tool for uploading images to a provider's API
const imageUploadTool = new Tool({
  name: 'upload_image',
  description: 'Upload an image to get a public URL for analysis',
  parameters: {
    type: 'object',
    properties: {
      imageData: {
        type: 'string',
        description: 'Base64 encoded image data'
      },
      provider: {
        type: 'string',
        description: 'Provider to upload to (openai, anthropic, google)'
      }
    },
    required: ['imageData', 'provider']
  },
  execute: async ({ imageData, provider }) => {
    // Implementation to upload image and return public URL
    // This would integrate with the provider's upload API
    return { publicUrl: 'https://provider-api.com/uploaded-image.jpg' };
  }
});

const enhancedVisionAnalyst = new Agent({
  name: 'Enhanced Vision Scout',
  role: 'Image Analyzer with Upload Capabilities',
  goal: 'Analyze images from various sources including uploads',
  background: 'Computer vision specialist with image processing expertise',
  tools: [imageUploadTool],
  llmConfig: {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20240620'
  }
});
```

### Integration with Web Tools

Combine image processing with web tools for enhanced functionality:

```javascript
import { TavilySearch, Firecrawl } from '@kaibanjs/tools';

const webImageAnalyst = new Agent({
  name: 'Web Image Analyst',
  role: 'Image Analyzer with Web Context',
  goal: 'Analyze images found through web search or web scraping',
  background: 'Computer vision specialist with web research capabilities',
  tools: [TavilySearch, Firecrawl],
  llmConfig: {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20240620'
  }
});
```

**Use Cases:**

- **TavilySearch**: When search results return images, analyze them for context and relevance
- **Firecrawl**: Extract and analyze images from web pages, including screenshots of websites
- **Combined Workflow**: Search for images, then analyze the found images for detailed insights

## Troubleshooting

### Common Issues

1. **Image Access Errors**: Ensure image URLs are publicly accessible
2. **API Rate Limits**: Implement proper rate limiting and retry logic
3. **Large Image Processing**: Consider resizing images before processing
4. **Unsupported Formats**: Check that your chosen model supports the image format

### Debug Tips

- Test with simple images first
- Use console logging to track image processing steps
- Verify API keys and model availability
- Check image URL accessibility

## Conclusion

Image processing agents in KaibanJS provide powerful capabilities for analyzing and understanding visual content. By leveraging multimodal language models and following best practices, you can create sophisticated image analysis systems that extract valuable insights from visual data.

Whether you're building document processing systems, content moderation tools, or medical imaging applications, KaibanJS makes it easy to implement robust image processing workflows with AI agents.

:::tip[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
:::
