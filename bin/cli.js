#!/usr/bin/env node

/**
 * postcode-context-mcp Stdio-to-Streamable-HTTP Bridge
 * Connects stdio MCP clients and container sandboxes (e.g. Glama, Claude Desktop)
 * to the remote Streamable HTTP MCP server at https://api.postcodecontext.uk/mcp.
 * Generated from the Single Source of Truth (SSOT) Registry.
 */

import readline from 'node:readline';

const TARGET_URL = process.env.POSTCODE_CONTEXT_MCP_URL || 'https://api.postcodecontext.uk/mcp';
const AUTH_TOKEN = process.env.POSTCODE_CONTEXT_API_KEY || process.env.MCP_AUTH_TOKEN || '';

const SERVER_INFO = {
  name: 'postcode-context',
  version: '1.0.0'
};

const TOOLS = [
  {
    "name": "lookup_postcode",
    "description": "Use when you need demographic, property, EPC energy efficiency, broadband, or socio-economic context for a Great Britain unit postcode (England, Scotland, Wales). Returns full profile by default; use view=\"brief\" (~80 tokens) for low-token, concise briefings when managing context budget. Do not use for non-GB postcodes (e.g. Northern Ireland BT) or when comparing multiple postcodes simultaneously (use compare_postcodes instead).",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "postcode": {
          "type": "string",
          "description": "Great Britain unit postcode to analyze (e.g. SW1A 1AA, BB7 3BB, EH1 1YZ, CF10 1EP). Space-optional, case-insensitive."
        },
        "view": {
          "type": "string",
          "enum": [
            "full",
            "brief",
            "summary",
            "ai",
            "property",
            "demographics",
            "education",
            "healthcare",
            "transit",
            "services",
            "schools",
            "health",
            "transport",
            "infrastructure"
          ],
          "default": "full",
          "description": "View slice to return: \"full\" (complete 113-metric profile, default), \"brief\" (or \"summary\"/\"ai\", ~80 tokens summary with AI affluence tier & persona, recommended for token efficiency), \"property\" (prices & EPC), \"demographics\" (Census & IMD deciles), \"education\" (or \"schools\"), \"healthcare\" (or \"health\"), \"transit\" (or \"transport\"), or \"services\" (or \"infrastructure\")."
        },
        "exclude": {
          "description": "Optional domain(s) to exclude: \"schools\", \"healthcare\", \"transit\" as a comma-separated string (e.g. \"schools, healthcare\") or an array of strings (e.g. [\"schools\", \"healthcare\"]). Note: exclude only applies when view=\"full\"; ignored if a specific view slice is selected.",
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          ]
        }
      },
      "required": [
        "postcode"
      ]
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    }
  },
  {
    "name": "compare_postcodes",
    "description": "Use when you need to directly contrast 2 to 5 Great Britain postcodes across affluence, safety, housing cost per m², broadband, and family suitability. Returns full profiles by default; use view=\"brief\" (~80 tokens per postcode) to keep context compact alongside the comparison ranking. Do not use for single postcode inspection (use lookup_postcode) or bulk batches of >5 postcodes (use enrich_postcodes).",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "postcodes": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 2,
          "maxItems": 5,
          "description": "Array of 2 to 5 Great Britain postcodes to compare."
        },
        "view": {
          "type": "string",
          "enum": [
            "full",
            "brief",
            "summary",
            "ai",
            "property",
            "demographics",
            "education",
            "healthcare",
            "transit",
            "services",
            "schools",
            "health",
            "transport",
            "infrastructure"
          ],
          "default": "full",
          "description": "View slice for returned postcode profiles: \"full\" (complete profile per postcode, default), \"brief\" (or \"summary\"/\"ai\", ~80 tokens per postcode, recommended to minimize context usage alongside comparison ranking), \"property\", \"demographics\", \"education\", \"healthcare\", \"transit\", or \"services\"."
        }
      },
      "required": [
        "postcodes"
      ]
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    }
  },
  {
    "name": "enrich_postcodes",
    "description": "Bulk demographic, economic, and spatial lookup for 1 to 50 Great Britain postcodes. Returns brief profile by default (~80 tokens per postcode) to prevent context blow-up; use view=\"full\" when all 113 metrics are needed. Cost-effective for 6 to 50 postcodes ($0.050 flat fee). For 1 postcode use lookup_postcode ($0.005); for 2 to 5 postcodes use compare_postcodes ($0.010). Do not use when detailed side-by-side comparative rankings are required (use compare_postcodes).",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "postcodes": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 1,
          "maxItems": 50,
          "description": "Array of 1 to 50 Great Britain postcodes to enrich. Cost-effective for 6 to 50 postcodes ($0.050 flat fee). For 1 postcode use lookup_postcode ($0.005); for 2 to 5 postcodes use compare_postcodes ($0.010)."
        },
        "view": {
          "type": "string",
          "enum": [
            "full",
            "brief",
            "summary",
            "ai",
            "property",
            "demographics",
            "education",
            "healthcare",
            "transit",
            "services",
            "schools",
            "health",
            "transport",
            "infrastructure"
          ],
          "default": "brief",
          "description": "View slice for each postcode in the batch results: \"brief\" (or \"summary\"/\"ai\", ~80 tokens per postcode, default for batch calls to prevent context blow-up), \"full\" (complete 113-metric dataset per postcode, explicitly requested when all metrics needed), \"property\", \"demographics\", \"education\", \"healthcare\", \"transit\", or \"services\"."
        }
      },
      "required": [
        "postcodes"
      ]
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    }
  },
  {
    "name": "summarise_outcode",
    "description": "Use when you only have an outward code / district (e.g. SW1A, BB7, EH1, CF10) and need high-level district demographic and property statistics (~150 tokens). Do not use when an exact full unit postcode is available (use lookup_postcode).",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "outcode": {
          "type": "string",
          "description": "Valid outward postal district code (e.g. SW1A, BB7, EH1, CF10)."
        },
        "view": {
          "type": "string",
          "enum": [
            "full",
            "brief",
            "summary",
            "ai",
            "property",
            "demographics",
            "education",
            "healthcare",
            "transit",
            "services",
            "schools",
            "health",
            "transport",
            "infrastructure"
          ],
          "default": "full",
          "description": "Optional view slice to return: \"full\" (complete district summary, default), \"brief\" (or \"summary\"/\"ai\", ~80 tokens context summary), \"property\", \"demographics\", \"education\", \"healthcare\", \"transit\", or \"services\"."
        },
        "exclude": {
          "description": "Optional domain(s) to exclude: \"schools\", \"healthcare\", \"transit\" as a comma-separated string (e.g. \"schools, healthcare\") or an array of strings (e.g. [\"schools\", \"healthcare\"]). Note: exclude only applies when view=\"full\"; ignored if a specific view slice is selected.",
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          ]
        }
      },
      "required": [
        "outcode"
      ]
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    }
  },
  {
    "name": "get_postcode_ai_brief",
    "description": "Retrieve an ultra-lightweight, token-efficient natural language briefing, affluence tier, and persona profile (~80 tokens) for fast autonomous agent decision-making across Great Britain. Covers England, Scotland, and Wales (excludes Northern Ireland BT postcodes).",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "postcode": {
          "type": "string",
          "description": "Great Britain unit postcode to summarize (e.g. SW1A 1AA, BB7 3BB, EH1 1YZ, CF10 1EP). Space-optional, case-insensitive. Returns ~80 tokens of concise natural language context for LLM agents."
        }
      },
      "required": [
        "postcode"
      ]
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    }
  },
  {
    "name": "get_property_and_energy_profile",
    "description": "Retrieve real estate valuation (HM Land Registry / Registers of Scotland median house price, price per sqm, 3yr sales volume), EPC energy efficiency (current/potential band, retrofit upside), and Ofcom gigabit broadband connectivity for any Great Britain postcode. Covers England, Scotland, and Wales (excludes Northern Ireland BT postcodes).",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "postcode": {
          "type": "string",
          "description": "Great Britain unit postcode to inspect for real estate transactions, £/sqm, and EPC ratings (e.g. SW1A 1AA, BB7 3BB, EH1 1YZ, CF10 1EP). Space-optional, case-insensitive."
        }
      },
      "required": [
        "postcode"
      ]
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    }
  },
  {
    "name": "get_demographics_and_deprivation",
    "description": "Retrieve Census demographic breakdown (ONS Census 2021 / NRS Scotland Census 2022 income estimate, qualifications, tenure, employment, age) and statutory IMD deprivation deciles (IoD 2025, WIMD 2025, SIMD 2020 crime safety, education, living environment) for any Great Britain postcode. Covers England, Scotland, and Wales.",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "postcode": {
          "type": "string",
          "description": "Great Britain unit postcode to inspect for Census demographics and statutory IMD deprivation deciles (e.g. SW1A 1AA, BB7 3BB, EH1 1YZ, CF10 1EP). Space-optional, case-insensitive."
        }
      },
      "required": [
        "postcode"
      ]
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    }
  },
  {
    "name": "screen_postcodes",
    "description": "Rank and screen 2 to 10 Great Britain postcodes by a specific target metric (affluence, house price, crime safety, broadband speed, family suitability, or connectivity). Returns a sorted leaderboard. For 11 to 50 postcodes use enrich_postcodes; for full cross-metric comparison of 2 to 5 postcodes use compare_postcodes.",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "postcodes": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 2,
          "maxItems": 10,
          "description": "List of 2 to 10 Great Britain postcodes to screen and rank (e.g. [\"SW1A 1AA\", \"BB7 3BB\", \"M1 1AE\"]). Maximum 10 postcodes."
        },
        "metric": {
          "type": "string",
          "enum": [
            "affluence",
            "house_price",
            "crime_safety",
            "broadband_speed",
            "family_suitability",
            "connectivity"
          ],
          "description": "Target metric to rank postcodes by: \"affluence\" (1-100 score), \"house_price\" (median GBP), \"crime_safety\" (IMD crime decile), \"broadband_speed\" (gigabit availability), \"family_suitability\" (1-100 score), or \"connectivity\" (transit & broadband)."
        },
        "order": {
          "type": "string",
          "enum": [
            "desc",
            "asc"
          ],
          "default": "desc",
          "description": "Sort order: \"desc\" (highest first, default) or \"asc\" (lowest first)."
        }
      },
      "required": [
        "postcodes",
        "metric"
      ]
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    }
  },
  {
    "name": "get_data_attribution",
    "description": "$0.00 USDC reference tool (no payment or authentication required; subject to Terms of Service): Retrieve official statutory attribution statements, Crown copyright notices, Royal Mail Gridlink sublicence details, and Open Government Licence v3.0 metadata across all 19 contributing data providers (ONS, OS, Royal Mail, HM Land Registry, Registers of Scotland, MHCLG, Ofcom, Scottish Government, Welsh Government, DfE, CQC, PHS, NWSSP, DfT, ORR).",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {}
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    }
  },
  {
    "name": "get_data_dictionary",
    "description": "$0.00 USDC reference tool (no payment or authentication required; subject to Terms of Service): Retrieve exact field specifications, mathematical calculation formulas, statistical scales, and data sources for any metric across Great Britain in the Postcode Context database.",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "domain": {
          "type": "string",
          "enum": [
            "all",
            "summary_for_ai",
            "property_and_energy",
            "deprivation_deciles",
            "census_demographics",
            "digital_infrastructure",
            "location",
            "query_and_fallbacks",
            "landmark_context",
            "schools_and_education",
            "education_and_schools",
            "healthcare_and_services",
            "transit"
          ],
          "default": "summary_for_ai",
          "description": "Statistical domain category filter. Use \"summary_for_ai\" (default) for a compact token-efficient overview (~8 fields) for AI agents, or \"all\" for the complete 113-metric specification."
        },
        "field": {
          "type": "string",
          "description": "Optional specific field name to inspect."
        }
      }
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": false
    }
  }
];

const RESOURCES = [
  {
    "uri": "postcode://data-dictionary",
    "name": "Postcode Context Great Britain Data Dictionary",
    "description": "Complete field definitions, mathematical formulas, weighting dimensions, and statistical caveats across all 113 documented dictionary fields.",
    "mimeType": "application/json"
  },
  {
    "uri": "postcode://data-attribution",
    "name": "Postcode Context Statutory Attribution Register",
    "description": "Official provenance, vintages, and Open Government Licence v3.0 / Royal Mail Gridlink attribution notices for all 19 contributing datasets.",
    "mimeType": "application/json"
  }
];

function sendJsonRpc(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

function buildLocalFallback(msg) {
  if (!msg || typeof msg !== 'object' || msg.id === undefined) return null;
  if (msg.method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id: msg.id,
      result: {
        protocolVersion: msg.params?.protocolVersion || '2024-11-05',
        capabilities: {
          tools: { listChanged: false },
          resources: { subscribe: false, listChanged: false }
        },
        serverInfo: SERVER_INFO
      }
    };
  }
  if (msg.method === 'ping') {
    return { jsonrpc: '2.0', id: msg.id, result: {} };
  }
  if (msg.method === 'tools/list') {
    return { jsonrpc: '2.0', id: msg.id, result: { tools: TOOLS } };
  }
  if (msg.method === 'resources/list') {
    return { jsonrpc: '2.0', id: msg.id, result: { resources: RESOURCES } };
  }
  if (msg.method === 'prompts/list') {
    return { jsonrpc: '2.0', id: msg.id, result: { prompts: [] } };
  }
  return null;
}

async function handleLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return;

  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    return;
  }

  // Notifications without an id require no response
  if (msg.id === undefined || msg.id === null) {
    return;
  }

  // Fast-path deterministic discovery methods so container inspectors (Glama TDQS) succeed even in air-gapped microVMs
  const discoveryFallback = buildLocalFallback(msg);
  if (discoveryFallback && (msg.method === 'initialize' || msg.method === 'ping' || msg.method === 'prompts/list')) {
    sendJsonRpc(discoveryFallback);
    return;
  }

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream'
    };
    if (AUTH_TOKEN) {
      headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
    }

    const res = await fetch(TARGET_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(msg)
    });

    if (res.ok) {
      const data = await res.json();
      sendJsonRpc(data);
      return;
    }
  } catch {
    // Fall through to local discovery fallback when sandbox blocks outbound network
  }

  if (discoveryFallback) {
    sendJsonRpc(discoveryFallback);
    return;
  }

  sendJsonRpc({
    jsonrpc: '2.0',
    id: msg.id,
    error: {
      code: -32603,
      message: `Unable to reach remote MCP endpoint (${TARGET_URL}). Connect directly over Streamable HTTP or verify outbound HTTPS access.`
    }
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false
});

rl.on('line', (line) => {
  handleLine(line);
});
