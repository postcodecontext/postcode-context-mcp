#!/usr/bin/env node

/**
 * postcode-context-mcp CLI
 * Proxies local stdio MCP JSON-RPC messages to the remote Streamable HTTP MCP server:
 * https://api.postcodecontext.uk/mcp
 */

import { spawn } from 'node:child_process';

const TARGET_URL = process.env.POSTCODE_CONTEXT_MCP_URL || 'https://api.postcodecontext.uk/mcp';
const args = ['-y', 'mcp-remote', TARGET_URL, ...process.argv.slice(2)];

const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, {
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
