# @kaibanjs/mcp-docs-server

A Model Context Protocol (MCP) server that provides AI assistants with direct access to Kaibanjs's complete knowledge base. This includes comprehensive documentation with MDX support. The server integrates with popular AI development environments like Cursor and Windsurf, as well as Kaibanjs agents, making it easy to build documentation-aware AI assistants that can provide accurate, up-to-date information about Kaibanjs's ecosystem.

## Installation

### In Cursor

Create or update `.cursor/mcp.json` in your project root:

MacOS/Linux

```json
{
  "mcpServers": {
    "kaibanjs": {
      "command": "npx",
      "args": ["-y", "@kaibanjs/mcp-docs-server"]
    }
  }
}
```

Windows

```json
{
  "mcpServers": {
    "kaibanjs": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@kaibanjs/mcp-docs-server"]
    }
  }
}
```

This will make all Kaibanjs documentation tools available in your Cursor workspace.
Note that the MCP server wont be enabled by default. You'll need to go to Cursor settings -> MCP settings and click "enable" on the Kaibanjs MCP server.

### In Windsurf

Create or update `~/.codeium/windsurf/mcp_config.json`:

MacOS/Linux

```json
{
  "mcpServers": {
    "kaibanjs": {
      "command": "npx",
      "args": ["-y", "@kaibanjs/mcp-docs-server"]
    }
  }
}
```

Windows

```json
{
  "mcpServers": {
    "kaibanjs": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@kaibanjs/mcp-docs-server"]
    }
  }
}
```

This will make all Kaibanjs documentation tools available in your Windsurf workspace.
Note that Windsurf MCP tool calling doesn't work very well. You will need to fully quit and re-open Windsurf after adding this.
If a tool call fails you will need to go into Windsurf MCP settings and re-start the MCP server.

## Tools

### Documentation Tool (`kaibanjsDocs`)

- Get Kaibanjs documentation by requesting specific paths
- Explore both general guides and API reference documentation
- Automatically lists available paths when a requested path isn't found
