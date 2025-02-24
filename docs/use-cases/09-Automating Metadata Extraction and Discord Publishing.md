---
title: Automating Metadata Extraction and Discord Publishing
description: KaibanJS automates metadata extraction from websites and publishing updates to Discord channels, streamlining content workflows with AI agents.
---

Manually extracting metadata from web pages and sharing updates on Discord is time-consuming and prone to inconsistencies. KaibanJS automates this process using AI agents, ensuring efficient and structured communication.

![image](https://github.com/user-attachments/assets/4e768fe9-4561-4a42-b9f6-4141c686affe)


### The Challenge
Managing content updates and community announcements requires:

- **Extracting Metadata:** Parsing web pages for titles, descriptions, images, and key details.
- **Formatting Messages:** Ensuring updates are structured and visually appealing.
- **Publishing Consistently:** Sharing updates regularly while maintaining accuracy.
- **Reducing Manual Work:** Automating repetitive tasks to save time.

Traditional methods are slow, error-prone, and difficult to scale.

### The Solution with KaibanJS
KaibanJS automates metadata extraction and publication by combining AI agents into a seamless workflow. Teams can extract key content from web pages and instantly share it on Discord channels, reducing effort and improving consistency.

### The Agentic Solution
KaibanJS employs two specialized agents to handle metadata extraction and publication:

:::agents
- **MetadataExtractor:**
  - **Extracts** metadata such as title, description, images, author, and publication date from a web page.
  - **Formats** extracted content for reuse and structured outputs.
- **DiscordPublisher:**
  - **Creates** engaging and visually appealing Discord messages using structured metadata.
  - **Ensures** consistency with professional formatting and key details.
:::

### Process Overview
Here’s how KaibanJS automates metadata extraction and publishing:

:::tasks
1. **Metadata Extraction:** The **MetadataExtractor** parses the provided URL and retrieves key details such as title, description, image, author, and publication date.
2. **Publishing to Discord:** The **DiscordPublisher** formats the extracted metadata into a structured message and sends it to a designated Discord channel.
3. **Automated Output:** The final message is visually appealing and standardized, ensuring professional community engagement.
:::

### Implementation
Below is an example of how this automation is implemented using KaibanJS:

```javascript
import { Agent, Task, Team } from 'kaibanjs';
import { Tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";
import * as cheerio from 'cheerio';

// === MetadataTool ===
export class MetadataTool extends Tool {
  constructor(fields) {
    super(fields);
    this.name = "metadata_tool";
    this.description = "Extracts metadata from a URL in a structured format";
    this.schema = z.object({
      url: z
        .string()
        .url()
        .describe("The URL from which to extract metadata"),
    });
  }

  async _call(input) {
    try {
      const response = await axios.get(input.url);
      const $ = cheerio.load(response.data);
      
      const metadata = {
        title: $('title').text(),
        description: $('meta[property="og:description"]').attr('content'),
        url: $('link[rel="canonical"]').attr('href'),
        image: $('meta[property="og:image"]').attr('content'),
        author: $('meta[name="twitter:data1"]').attr('content'),
        twitter: $('meta[name="twitter:creator"]').attr('content'),
        published_time: $('meta[property="article:published_time"]').attr('content')
      };
      return metadata;
    } catch (error) {
      return `Error extracting metadata: ${error.message}`;
    }
  }
}

// === DiscordTool ===
export class DiscordTool extends Tool {
  name = "discord_tool";
  description = "Sends a message to Discord using a webhook";

  async _call(input) {
    try {
      const payload = {
        username: "Metadata Bot",
        content: `New content update: ${input.title}`,
        embeds: [{
          title: input.title,
          description: input.description,
          url: input.url,
          image: { url: input.image }
        }]
      };
      await axios.post(process.env.DISCORD_WEBHOOK_URL, payload);
      return `Message sent to Discord successfully`;
    } catch (error) {
      return `Error sending message to Discord: ${error.message}`;
    }
  }
}

const metadataTool = new MetadataTool();
const discordTool = new DiscordTool();

const metadataExtractor = new Agent({
  name: 'MetadataExtractor',
  tools: [metadataTool]
});

const discordPublisher = new Agent({
  name: 'DiscordPublisher',
  tools: [discordTool]
});

const tasks = [
  new Task({ agent: metadataExtractor }),
  new Task({ agent: discordPublisher })
];

const team = new Team({ agents: [metadataExtractor, discordPublisher], tasks });
export default team;
```

### Outcome
With KaibanJS, teams can:

- **Automate Content Updates:** Eliminate manual metadata extraction and formatting.
- **Improve Efficiency:** Save time and reduce effort with AI-driven workflows.
- **Ensure Consistency:** Standardize Discord messages for better communication.
- **Scale Effortlessly:** Handle multiple updates without increasing workload.

### Get Started Today
Ready to simplify your content workflows? Explore KaibanJS and revolutionize how you manage updates for your community.

🌐 **Website**: [KaibanJS](https://www.kaibanjs.com/)  
💻 **GitHub Repository**: [KaibanJS on GitHub](https://github.com/kaiban-ai/KaibanJS)  
🤝 **Discord Community**: [Join the Community](https://kaibanjs.com/discord)  

---

:::info[We Value Your Feedback!]
Have ideas or suggestions to improve this use case? Join our community or contribute on GitHub. [Contribute Now](https://github.com/kaiban-ai/KaibanJS/issues)
:::
