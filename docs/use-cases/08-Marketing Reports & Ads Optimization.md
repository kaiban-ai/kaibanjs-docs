---
title: Marketing Reports & Ads Optimization
description: KaibanJS automates marketing report generation and ad campaign optimization. AI agents analyze content, extract keywords, and generate ready-to-use strategies, streamlining workflows and enhancing precision.
---

Creating marketing reports and optimizing ads manually can be inefficient. KaibanJS automates this process with AI agents that extract insights, identify keywords, and generate ad strategies—saving time and improving precision.

![image](https://github.com/user-attachments/assets/ccf3c265-0bc0-43df-ad35-a0f35c4cd165)

### The Challenge
Marketing teams often struggle with:

- Extracting key insights from website content.
- Identifying and structuring effective keywords.
- Creating compelling ad copies tailored to the audience.
- Managing multiple campaigns while ensuring consistency.

Manual processes can be inconsistent and time-consuming, especially for large-scale campaigns.

### The Solution with KaibanJS
KaibanJS automates marketing workflows using AI agents that extract content insights, generate keyword-focused reports, and create optimized ad templates. This ensures efficiency and consistency across multiple campaigns.

### The Agentic Solution
KaibanJS utilizes two specialized AI agents:

:::agents
- **ContentAnalyzer**:
  - **Extracts** key themes, keywords, and value propositions from website content.
  - **Identifies** tone, style, and unique selling points.
- **ReportGenerator**:
  - **Compiles** marketing insights into structured reports.
  - **Generates** keyword-focused ad templates with optimized headlines and descriptions.
  - **Recommends** ad optimization strategies, including negative keyword suggestions.
:::

### Process Overview
Here’s how KaibanJS automates marketing optimization:

:::tasks
1. **Content Analysis:** The **ContentAnalyzer** scans the provided URL to extract keywords, tone, and value propositions.
2. **Report Generation:** The **ReportGenerator** structures insights into a marketing report and generates ad templates.
3. **Optimization Suggestions:** Includes keyword improvements and performance-enhancing strategies.
4. **Output Compilation:** Delivers a complete marketing report with actionable insights and ready-to-use ad copies.
:::

### Implementation
Below is an example of how this automation is implemented using KaibanJS:

```javascript
import { Agent, Task, Team } from 'kaibanjs';
import { Tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";

// === UrlMarkdown Tool ===
export class UrlMarkdown extends Tool {
  constructor(fields) {
    super(fields);
    this.name = "url_markdown_tool";
    this.description = "Gets content in Markdown format from a URL.";
    this.schema = z.object({
      url: z
        .string()
        .url()
        .describe("The URL from which to extract content in Markdown format."),
    });
  }

  async _call(input) {
    try {
      const requestUrl = `https://r.jina.ai/${encodeURIComponent(input.url)}`;
      const response = await axios.get(requestUrl);
      return response.data;
    } catch (error) {
      return `Error getting content from URL: ${error.message}`;
    }
  }
}

// Tool instance
const urlMarkdownTool = new UrlMarkdown();

// === AGENTS ===

// Content Analysis Agent
const contentAnalyzer = new Agent({
  name: 'ContentAnalyzer',
  role: 'Content Analysis Specialist',
  goal: 'Extract and analyze relevant information from URLs',
  background: 'Expert in web content analysis and key information extraction',
  tools: [urlMarkdownTool]
});

// Report Generator Agent
const reportGenerator = new Agent({
  name: 'ReportGenerator',
  role: 'Marketing Report Specialist',
  goal: 'Generate detailed marketing reports and optimized ads',
  background: 'Specialist in digital marketing and Google Ads generation',
  tools: []
});

// === TASKS ===
const tasks = [
  // Task 1: Content Analysis
  new Task({
    description: `Analyze both the main URL: {url} and the specific landing page: {ad_destination_url} using the url_markdown_tool.

Required information to extract:
1. Website type analysis (identify if it's an ecommerce)
2. Specific analysis for {service_to_promote}:
   - Key features and benefits
   - Pricing information if available
   - Unique selling points
   - Technical specifications
   - Service guarantees or warranties

3. Landing page specific elements ({ad_destination_url}):
   - Main call to action
   - Conversion elements
   - Trust signals
   - Testimonials or social proof
   - Service-specific benefits

4. Generate keywords focused on {service_to_promote}:
   For ecommerce:
   - Transactional keywords specific to the product/service
   - Price-oriented terms for this specific service
   - Product-specific features and specs
   For non-ecommerce:
   - Service-specific benefit keywords
   - Problem-solution keywords
   - Industry-specific terms

5. Generate 10 longtail variations for {service_to_promote}:
   - Include specific features
   - Add location modifiers if relevant
   - Use buying intent modifiers
   - Include pricing terms if applicable

Language: {language}`,
    expectedOutput: `Output in markdown format with titles and lists for easy reading.
- Website Type: [Ecommerce/Non-ecommerce]
- Service Analysis for {service_to_promote}: [Key features and benefits]
- Landing Page Analysis: [Key conversion elements from {ad_destination_url}]
- Primary Keywords: [at least 10 keywords focused on {service_to_promote}]
- Longtail Keywords: [10 variations specific to {service_to_promote}]`,
    agent: contentAnalyzer,
    priority: 1
  }),

  // Task 2: Ad Generation
  new Task({
    description: `Using the analyzed information, generate optimized ads specifically for {service_to_promote}.

Make sure to:
1. Create Service-Specific Ads for {service_to_promote}:
   - Identify and address key pain points:
     * Current frustrations
     * Common challenges
     * Industry problems
     * Time-wasting issues
     * Cost-related concerns
     * Quality concerns
     * Process inefficiencies
   
   - Structure headlines as Problem > Solution:
     * "Tired of [Pain Point]? > Discover [Solution]"
     * "Struggling with [Problem]? > Get [Benefit]"
     * "Fed up with [Issue]? > Try [Solution]"
     * "[Pain Point] Problems? > We Fix That"
   
   - Use description lines to:
     * Acknowledge the pain ("We know [pain point] is frustrating")
     * Present the solution ("Our [service] eliminates [problem]")
     * Show the benefit ("Save [X] time/money")
     * Provide proof ("Join [X] satisfied customers")

   - Pain-focused CTAs:
     * "Stop [Pain Point] Today"
     * "End My [Problem] Now"
     * "Fix My [Issue] Fast"
     * "Solve My [Challenge]"
     * "Free Me From [Pain Point]"

2. Create Problem-Solution Variations:
   ### Pain Point Focus Ad
   - **Headline 1:** [Identify Pain Point]
   - **Headline 2:** [Present Solution]
   - **Description 1:** [Empathize + Solution]
   - **Description 2:** [Benefit + Proof]
   - **CTA:** [Pain Resolution Action]

   ### Solution Focus Ad
   - **Headline 1:** [Solution to Pain]
   - **Headline 2:** [Unique Benefit]
   - **Description 1:** [How We Solve It]
   - **Description 2:** [Success Proof]
   - **CTA:** [Get Solution Now]

   ### Emotional Relief Ad
   - **Headline 1:** [Emotional Pain Point]
   - **Headline 2:** [Emotional Relief]
   - **Description 1:** [Understanding + Solution]
   - **Description 2:** [Transformation Story]
   - **CTA:** [Transform Now]

3. Pain Point Keywords:
   - Include problem-specific terms
   - Use "fix", "solve", "eliminate" modifiers
   - Add "vs", "alternative to" comparisons
   - Include "prevent", "avoid", "stop" variations

4. All ads should:
   - Use headlines that validate customer pain points
   - Show immediate relief or solution
   - Include proof of problem resolution
   - Use empathetic language
   - Demonstrate understanding of the issue
   - Offer clear path to solution

5. Provide specific recommendations for:
   - Best performing ad elements from landing page
   - Keyword insertion opportunities
   - A/B testing variations based on landing page content
   - Quality Score optimization based on landing page relevance

6. Negative keywords specific to {service_to_promote}

Language: {language}`,
    agent: reportGenerator,
    priority: 2,
    expectedOutput: `
[![Nimbox Logo](https://crm.nimboxcrm.cloud/uploads/company/9e85677a40aafa432269e8b241f4ddae.png)](https://nimbox360.com)

# Ad Campaign for {service_to_promote}
*Generated by [Nimbox360](https://nimbox360.com) with KaibanJS*

## Service-Specific Ads
### Primary Ad
- **Headline 1:** [Based on {service_to_promote} USP]
- **Headline 2:** [Feature from landing page]
- **Description 1:** [Benefits from {ad_destination_url}]
- **Description 2:** [CTA matching landing page]
- **Final URL:** {ad_destination_url}

### Secondary Ad
- **Headline 1:** [Alternative {service_to_promote} USP]
- **Headline 2:** [Social proof from landing page]
- **Description 1:** [Different benefit angle]
- **Description 2:** [Alternative CTA]
- **Final URL:** {ad_destination_url}

## Brand Variation Ads
[Similar structure with brand focus]

## Optimization Recommendations
[Based on landing page analysis]`
  }),
];

// === TEAM ===
const team = new Team({
  name: 'Marketing Ads Team',
  agents: [
    contentAnalyzer,
    reportGenerator
  ],
  tasks: tasks,
  inputs: {
    url: 'https://nimbox360.com', // URL to analyze
    company_name: 'Nimbox360', // Company name
    language: 'en', // Options: 'en' for English, 'es' for Spanish
    ad_destination_url: '', // Specific landing page for the ad
    service_to_promote: '', // Specific service or product to promote in the ad
  },
  env: {
    OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY ?? (() => { throw new Error('OPENAI_API_KEY is required') })(),
    GOOGLE_API_KEY: import.meta.env.GOOGLE_API_KEY || null,
  }
});

export default team;
```

### Outcome
With KaibanJS, teams receive:

- **Marketing Reports:** Structured insights on keywords, messaging, and ad performance recommendations.
- **Optimized Ad Templates:** Ready-to-use headlines, descriptions, and calls-to-action.
- **Scalable Automation:** Repeatable workflows for multiple clients or campaigns.

### Expected Benefits
- **Time Savings:** Automates content analysis and report creation.
- **Higher Performance:** Generates data-driven ad strategies with optimized relevance.
- **Scalability:** Easily adapts to various business needs.
- **Consistency:** Ensures uniform quality across all campaigns.

### Get Started Today
Ready to streamline your marketing workflows? Explore KaibanJS and elevate your ad campaigns.

🌐 **Website**: [KaibanJS](https://www.kaibanjs.com/)  
💻 **GitHub Repository**: [KaibanJS on GitHub](https://github.com/kaiban-ai/KaibanJS)  
🤝 **Discord Community**: [Join the Community](https://kaibanjs.com/discord)  

Special thanks to **Aitor Roma** for his collaboration
---

:::info[We Value Your Feedback!]
Have ideas or suggestions? Join our community or contribute on GitHub. [Contribute Now](https://github.com/kaiban-ai/KaibanJS/issues)
:::
