---
title: API Key Management
description: Learn about the pros and cons of using API keys in browser-based applications with KaibanJS. Understand when it's acceptable, the potential risks, and best practices for securing your keys in production environments.
---

# API Key Management

Managing API keys securely is one of the most important challenges when building applications that interact with third-party services, like Large Language Models (LLMs). With KaibanJS, we offer a flexible approach to handle API keys based on your project's stage and security needs, while providing a proxy boilerplate to ensure best practices.

This guide will cover:
1. **The pros and cons of using API keys in the browser**.
2. **Legitimate use cases** for browser-based API key usage.
3. **Secure production environments** using our **Kaiban LLM Proxy**.

:::tip[Using AI Development Tools?]
Our documentation is available in an LLM-friendly format at [docs.kaibanjs.com/llms-full.txt](https://docs.kaibanjs.com/llms-full.txt). Feed this URL directly into your AI IDE or coding assistant for enhanced development support!
:::

---

## API Key Handling with KaibanJS

When working with third-party APIs like OpenAI, Anthropic, and Google Gemini, you need to authenticate using API keys. KaibanJS supports two approaches to handle API keys:

### 1. Developer-Owned Keys (DOK)
This is the "move fast and break things" mode, where developers can provide API keys directly in the browser. This approach is recommended for:
- Rapid prototyping
- Local development
- Quick demos or hackathons
- Personal projects with limited risk

**Benefits**:
- **Fast setup**: No need to set up a server or proxy, allowing for quick iteration.
- **Direct interaction**: Makes testing and development easier, with the ability to communicate directly with the API.
  
**Drawbacks**:
- **Security risks**: Exposes API keys to the browser, allowing them to be easily viewed and potentially abused.
- **Limited to development environments**: Not recommended for production use.

### 2. Proxy Setup for Production
When building production-grade applications, exposing API keys in the frontend is a significant security risk. KaibanJS recommends using a backend proxy to handle API requests securely.

The **Kaiban LLM Proxy** offers a pre-built solution to ensure your API keys are hidden while still allowing secure, efficient communication with the LLM providers.

**Benefits**:
- **API keys are protected**: They remain on the server and never reach the frontend.
- **Vendor compliance**: Some LLM providers restrict frontend API access, requiring server-side communication.
- **Improved security**: You can add rate-limiting, request logging, and other security features to the proxy.

---

## What are API Keys?

API keys are unique identifiers provided by third-party services that allow access to their APIs. They authenticate your requests and often have usage quotas. In a production environment, these keys must be protected to prevent unauthorized use and abuse.

---

## Is It Safe to Use API Keys in the Browser?

Using API keys directly in the browser is convenient for development but risky in production. Browser-exposed keys can be easily viewed in developer tools, potentially leading to abuse or unauthorized access.

### Pros of Using API Keys in the Browser
1. **Ease of Setup**: Ideal for rapid prototyping, where speed is a priority.
2. **Direct Communication**: Useful when you want to quickly test API interactions without setting up backend infrastructure.
3. **Developer Flexibility**: Provides a way for users to supply their own API keys in scenarios like BYOAK (Bring Your Own API Key).

### Cons of Using API Keys in the Browser
1. **Security Risks**: Keys exposed in the browser can be easily stolen or misused.
2. **Provider Restrictions**: Some LLM providers, such as OpenAI and Anthropic, may restrict API key usage to backend-only.
3. **Lack of Control**: Without a backend, it's harder to manage rate-limiting, request logging, or prevent abuse.

---

## Legitimate Use Cases for Browser-Based API Keys

There are scenarios where using API keys in the browser is acceptable:

1. **Internal Tools or Demos**: Trusted internal environments or demos, where the risk of key exposure is low.
2. **BYOAK (Bring Your Own API Key)**: If users are supplying their own keys, it may be acceptable to use them in the browser, as they control their own credentials.
3. **Personal Projects**: For small-scale or personal applications where security risks are minimal.
4. **Non-Critical APIs**: For APIs with low security risks or restricted access, where exposing keys is less of a concern.

---

## Secure Production Setup: The Kaiban LLM Proxy

The **Kaiban LLM Proxy** is an open-source utility designed to serve as a **starting point** for securely handling API requests to multiple Large Language Model (LLM) providers. While Kaiban LLM Proxy provides a quick and easy solution, you are free to build or use your own proxies using your preferred technologies, such as **AWS Lambda**, **Google Cloud Functions**, or **other serverless solutions**.

- **Repository URL**: [Kaiban LLM Proxy GitHub Repo](https://github.com/kaiban-ai/kaiban-llm-proxy)

This proxy example is intended to demonstrate a simple and secure way to manage API keys, but it is not the only solution. You can clone the repository to get started or adapt the principles outlined here to build a proxy using your chosen stack or infrastructure.

### Cloning the Proxy

To explore or modify the Kaiban LLM Proxy, you can clone the repository:

```bash
git clone https://github.com/kaiban-ai/kaiban-llm-proxy.git
cd kaiban-llm-proxy
npm install
npm run dev
```

The proxy is flexible and can be deployed or adapted to other environments. You can create your own proxy in your preferred technology stack, providing full control over security, scalability, and performance.

---

## Best Practices for API Key Security

1. **Use Environment Variables**: Always store API keys in environment variables, never hardcode them in your codebase.
2. **Set Up a Proxy**: Use the Kaiban LLM Proxy for production environments to ensure API keys are never exposed.
3. **Monitor API Usage**: Implement logging and monitoring to track usage patterns and detect any abnormal activity.
4. **Use Rate Limiting**: Apply rate limiting on your proxy to prevent abuse or overuse of API resources.

---

## Conclusion

KaibanJS offers the flexibility to use API keys in the browser during development while providing a secure path to production with the **Kaiban LLM Proxy**. For rapid development, the **DOK approach** allows you to move quickly, while the **proxy solution** ensures robust security for production environments.

By leveraging KaibanJS and the proxy boilerplate, you can balance speed and security throughout the development lifecycle. Whether you’re building a quick demo or a production-grade AI application, we’ve got you covered.
