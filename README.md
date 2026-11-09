# Postcode Context Great Britain — Remote MCP Server & x402 API

[![Official MCP Registry](https://img.shields.io/badge/MCP_Registry-uk.postcodecontext%2Fmcp-4f46e5?logo=anthropic)](https://registry.modelcontextprotocol.io/v0/servers?search=postcodecontext)
[![Glama TDQS](https://glama.ai/mcp/servers/postcodecontext/postcode-context-mcp/badge)](https://glama.ai/mcp/servers/postcodecontext/postcode-context-mcp)
[![Payment: x402 v2 USDC on Base](https://img.shields.io/badge/x402_v2-USDC_on_Base-0052ff)](https://api.postcodecontext.uk/.well-known/x402)
[![Coverage: 1.76M GB Postcodes](https://img.shields.io/badge/GB_Postcodes-1.76M_Active-10b981)](https://api.postcodecontext.uk/data-dictionary)
[![License: Proprietary / Client Terms](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Terms of Service](https://img.shields.io/badge/Terms-Commercial_API-blue)](https://api.postcodecontext.uk/terms)

> **Give AI agents real-world UK location intelligence.**  
> Turn any UK postcode into structured property, demographic, energy, school, healthcare, and connectivity context in one call. Compare locations, screen up to 50 postcodes per request, and return source-grounded evidence—with transparent pricing from $0.005 per request ($1 per 1,000 postcodes in batch).

**Postcode Context Great Britain** is a 100% stateless Remote Model Context Protocol (MCP) Server (`streamable-http`) and REST API delivering Great Britain postcode socio-economic intelligence, ONS Census 2021 demographics, Index of Multiple Deprivation (IMD) deciles, HM Land Registry property prices & £/sqm valuations, EPC energy efficiency ratings, and Ofcom gigabit broadband availability across **1.76 million Great Britain postcodes**. Northern Ireland (`BT`) and Crown Dependencies (`JE`, `GY`, `IM`) are excluded to ensure 100% royalty-free commercial resale under OGL v3.0.

---

## 🌐 Live Server Endpoints

| Resource | URL | Protocol / Format | Access |
|---|---|---|---|
| **Remote MCP Server** | `https://api.postcodecontext.uk/mcp` | Streamable HTTP (`JSON-RPC 2.0`) | Unauthenticated Discovery / Paid Tools |
| **x402 v2 Manifest** | `https://api.postcodecontext.uk/.well-known/x402` | Machine-readable x402 payment spec | 100% Free / Public |
| **MCP Registry Auth** | `https://api.postcodecontext.uk/.well-known/mcp-registry-auth` | MCP Registry HTTP Verification | 100% Free / Public |
| **Glama Connector** | `https://api.postcodecontext.uk/.well-known/glama.json` | Glama Domain Ownership Claim | 100% Free / Public |
| **OpenAPI 3.1 Spec** | `https://api.postcodecontext.uk/openapi.json` | Full REST API specification | 100% Free / Public |
| **Data Dictionary** | `https://api.postcodecontext.uk/data-dictionary` | Interactive HTML & JSON methodology | 100% Free / Public |
| **Attribution Registry**| `https://api.postcodecontext.uk/api/v1/attribution` | Statutory provenance & OGL v3.0 | 100% Free / Public |
| **LLMs.txt** | `https://api.postcodecontext.uk/llms.txt` | Autonomous AI agent guide | 100% Free / Public |

---

## 📊 Datasets Returned in Every Profile

Every lookup provides deep, multi-disciplinary intelligence joined from 8 sovereign UK data sources:

1. **HM Land Registry Property Intelligence:**
   - 3-year rolling median transaction price, transaction volume, and benchmark estimated price per square metre (£/sqm).
2. **ONS Census 2021 Demographics:**
   - Modelled household net/gross income, NS-SeC higher managerial % distribution, Level 4+ higher education qualifications, outright homeownership vs social rent, and age demographics.
3. **Statutory Index of Multiple Deprivation (IMD Deciles):**
   - National deciles (1 = most deprived 10%, 10 = least deprived 10%) across overall IMD, Crime & Community Safety, Education & Skills, Health Deprivation, and Living Environment.
4. **Domestic EPC Energy Efficiency:**
   - Current median energy efficiency rating band (A–G), potential rating band, and estimated green retrofit upside.
5. **Ofcom Digital Infrastructure:**
   - Full-fibre (FTTP) and gigabit broadband availability percentage, superfast availability, and recorded average download speeds.
6. **Education & School Proximity:**
   - Primary and secondary school distances and Ofsted inspection performance profiles within the small-area catchment.
7. **Healthcare & NHS Infrastructure:**
   - Proximity to nearest GP surgeries and NHS acute hospitals.
8. **Rail & Rapid Transit Connectivity:**
   - Dual-station anchoring (closest station + major mainline hub) with Office of Rail and Road (ORR) annual footfall category.

---

## 📐 Transparent Scoring Methodology & Mathematical Formulas

Every synthetic score in Postcode Context is 100% deterministic, source-grounded in Census 2021/2022 and statutory public registers, and fully documented:

### 1. Affluence Score (`affluence_score_100`)
- **Scale:** `1 to 100` (100 = Peak Affluence; ~10 points represents ~1 national decile shift).
- **Weighting Dimensions:**
  - **35% Modelled Net Household Income:** Normalized against regional GDHI baseline (£72,000 ceiling, capped at 100), where $\text{Income} = \text{clamp}\left(21000, 95000, \text{round}\left(22000 + 3300 \times (\text{IncomeDecile} - 1) + 260 \times \text{Managerial} + 180 \times \text{L4}\right)\right)$.
  - **25% Human Capital:** Equal weighting between Level 4+ higher education degree holders (`qual_level4_plus_pct`) and higher managerial/professional occupations (`ns_sec_managerial_professional_pct`).
  - **25% Statutory Deprivation Freedom:** Normalized national IMD decile (`imd_overall_decile * 10`).
  - **15% Housing Equity:** Share of outright homeownership and mortgaged households (`owned_outright + mortgaged`).
- **Formula:**
  $$\text{Score} = \text{clamp}\left(1, 100, \text{round}\left(0.35 \times \min\left(100, \frac{\text{Income}}{72000} \times 100\right) + 0.25 \times \frac{\text{L4} + \text{Managerial}}{2} + 0.25 \times (\text{IMD} \times 10) + 0.15 \times \text{Homeownership}\right)\right)$$
- **Tiers:** `Ultra-Prime` (>=90) | `Affluent` (75–89) | `Mid-Market` (50–74) | `Modest-Income` (30–49) | `High-Deprivation` (<30).
- **Scope Note:** Measured at LSOA / Data Zone neighbourhood granularity. Because IMD deciles are relative within England, Wales, and Scotland, cross-border comparisons should rely on underlying Census percentages and property transaction metrics.

### 2. Family Suitability Score (`family_suitability_score_100`)
- **Scale:** `1 to 100` (100 = Optimal Family Environment).
- **Weighting Dimensions:**
  - **40% Statutory Crime Safety:** Low crime deprivation from statutory IMD crime domain (`crime_safety_decile * 10`).
  - **30% Statutory Education Deprivation & School Proximity:** Low adult/child education deprivation (`education_skills_decile * 10`), adjusted at runtime if the nearest primary/secondary school exceeds 3 km geodesic distance: $\text{EduComponent} = \max\left(10, \text{round}\left(\text{EduDecile} \times 10 - \min\left(20, \max(0, \text{SchoolDistKm} - 3) \times 2\right)\right)\right)$.
  - **30% Demographic Family Density:** Concentration of children (0–15 years) and parenting-age adults (30–44 years).
- **Formula:**
  $$\text{Score} = \text{clamp}\left(1, 100, \text{round}\left(0.40 \times (\text{CrimeDecile} \times 10) + 0.30 \times \text{EduComponent} + 0.30 \times \min\left(100, (\text{Age}_{0-15} + \text{Age}_{30-44}) \times 2\right)\right)\right)$$
- **Scope Note:** Evaluates statutory neighbourhood crime/education deciles, age structure, and straight-line proximity; does not include school inspection ratings or admissions catchment boundaries.

### 3. Commuter Connectivity Score (`commuter_connectivity_score_100`)
- **Scale:** `1 to 100` (100 = Exceptional Multi-Modal Connectivity).
- **Components & Weights:**
  - **45% Rail / Metro Station Proximity ($S_{\text{station}}$):** Stepped straight-line (geodesic) distance score to the nearest NaPTAN station (`<=0.8 km: 100`, `<=1.5 km: 85`, `<=3.0 km: 65`, `<=6.0 km: 45`, `<=10.0 km: 25`, `>10.0 km: 10`).
  - **Additive Intercity Hub Bonus ($B_{\text{hub}}$):** Proximity to major mainline rail/interchange hub ($\le 3.0\text{ km}: +15$; $\le 7.0\text{ km}: +8$; $>7.0\text{ km}: 0$).
  - **20% Local Transit Reliance ($S_{\text{transit}}$):** Zero-car household density from Census `car_ownership_pct.zero_cars`, scaled as $\min(100, \text{round}(\text{ZeroCarPct} \times 2.2))$.
  - **15% Digital Infrastructure ($S_{\text{digital}}$):** $\min(100, \text{round}((\text{BroadbandSpeedTierMbps} / 350) \times 60 + \text{GigabitAvailabilityPct} \times 0.4))$.
  - **10% Corridor Affluence:** `affluence_score_100`.
- **Formula:**
  $$\text{Score} = \text{clamp}\left(1, 100, \text{round}\left(0.45 \times S_{\text{station}} + B_{\text{hub}} + 0.20 \times S_{\text{transit}} + 0.15 \times S_{\text{digital}} + 0.10 \times \text{Affluence}\right)\right)$$

### 4. Property Value Index (`property_value_index`)
- **Scale:** `1 to 100` integer index (100 = Prime Central London benchmark ceiling of £16,200/m²; 50 ≈ £8,100/m²).
- **Formula:** $\min\left(100, \max\left(1, \text{round}\left(\frac{\text{price\_per\_sqm\_gbp}}{16200} \times 100\right)\right)\right)$

### 5. Primary Persona Tag Heuristics (`primary_persona_tag`)
Assigned deterministically through a transparent decision tree based on wealth tier, student concentration, age cohorts, and rental tenure (*Ultra-High-Net-Worth Executives*, *Urban Young Renters*, *Affluent Retirees*, *Suburban Commuter Families*, *Corporate Renters*, *Industrial & Service Sector Households*, *Mixed Suburban*). Curated national landmarks receive specialized institutional archetypes.

> **Verifiable via Tool & Web:** The complete mathematical dictionary for all **113 standardized metrics** can be queried programmatically via the free `get_data_dictionary` MCP tool, or browsed interactively at [https://api.postcodecontext.uk/data-dictionary](https://api.postcodecontext.uk/data-dictionary).

---

## 🧰 Available MCP Tools (10 Canonical Tools)

Discovery (`initialize`, `tools/list`, `resources/list`) and the two reference tools (`get_data_dictionary`, `get_data_attribution`) are **100% unauthenticated and free**. Five backward-compatible tool aliases are also routed transparently on `tools/call`.

| Tool Name | Price (USDC / Call) | Annotations | Function |
|---|---|---|---|
| `lookup_postcode` *(alias: `get_postcode_intelligence`)* | **$0.005** | Read-Only, Idempotent | Full 113-metric socio-economic, property, EPC, broadband & Census profile (`view="brief"` for ~80 tokens) |
| `compare_postcodes` *(aliases: `compare_gb_postcodes`, `compare_uk_postcodes`)* | **$0.010** | Read-Only, Idempotent | Side-by-side comparison of 2 to 5 postcodes with automated AI synthesis ranking |
| `enrich_postcodes` *(alias: `enrich_postcodes_batch`)* | **$0.050** | Read-Only, Idempotent | High-throughput cohort enrichment for 1 to 50 postcodes (`view="brief"` default, $1/1,000) |
| `summarise_outcode` *(alias: `get_outcode_district_summary`)* | **$0.005** | Read-Only, Idempotent | District-level aggregation across an outward postal district (e.g. `SW1A`, `EH1`) |
| `get_postcode_ai_brief` | **$0.005** | Read-Only, Idempotent | Low-token (~80 tokens) natural language briefing, affluence score & persona |
| `get_property_and_energy_profile` | **$0.005** | Read-Only, Idempotent | Land Registry median price, £/sqm, sales volume, EPC band & retrofit upside |
| `get_demographics_and_deprivation`| **$0.005** | Read-Only, Idempotent | Census 2021 income, qualifications, tenure, age & IMD deprivation deciles |
| `screen_postcodes` | **$0.010** | Read-Only, Idempotent | Rank 2 to 10 postcodes by `affluence`, `house_price`, `crime_safety`, `broadband_speed`, `family_suitability`, or `connectivity` |
| `get_data_dictionary` | **FREE** | Read-Only, Idempotent | Exact field definitions, calculation formulas, statistical scales, and sources |
| `get_data_attribution` | **FREE** | Read-Only, Idempotent | Statutory Crown copyright and Open Government Licence v3.0 metadata |

> **Zero-Charge 404 Guarantee (Fair Exchange):** If a queried postcode does not exist in the ONS directory (or is in Northern Ireland `BT`), settlement is automatically cancelled (`billed: false`, **$0.00 USDC settled**).

---

## ⚡ Client Configuration & Installation

You can connect **Postcode Context** directly over remote Streamable HTTP, or through the lightweight `npx` stdio wrapper for clients that require local processes.

### 1. Claude Desktop

#### Direct Remote Streamable HTTP (Recommended)
Edit your `claude_desktop_config.json`:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "postcode-context": {
      "url": "https://api.postcodecontext.uk/mcp"
    }
  }
}
```

#### Stdio Local Wrapper (Compatible with all stdio-only MCP clients)
Via `mcp-remote`:
```json
{
  "mcpServers": {
    "postcode-context": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://api.postcodecontext.uk/mcp"]
    }
  }
}
```

Or via this repository's lightweight stdio wrapper:
```json
{
  "mcpServers": {
    "postcode-context": {
      "command": "npx",
      "args": ["-y", "github:postcodecontext/postcode-context-mcp"]
    }
  }
}
```

---

### 2. Cursor (`.cursor/mcp.json`)

Add to your project's `.cursor/mcp.json` or Global Cursor Settings:

```json
{
  "mcpServers": {
    "postcode-context": {
      "url": "https://api.postcodecontext.uk/mcp"
    }
  }
}
```

If using an API key / subscription header:
```json
{
  "mcpServers": {
    "postcode-context": {
      "url": "https://api.postcodecontext.uk/mcp",
      "headers": {
        "Authorization": "Bearer mcp_live_YOUR_KEY"
      }
    }
  }
}
```

---

### 3. Claude Code CLI

Add the remote server directly with one command:

```bash
claude mcp add postcode-context https://api.postcodecontext.uk/mcp
```

---

### 4. VS Code (Claude / Copilot / MCP Extensions)

In `.vscode/settings.json`:

```json
{
  "mcp.servers": {
    "postcode-context": {
      "url": "https://api.postcodecontext.uk/mcp"
    }
  }
}
```

---

## 💳 Payment & Authentication Options

### Option A: Autonomous Pay-Per-Call via x402 (Zero-Signup)
AI agents and code pipelines can call tools autonomously paying in USDC on Base Mainnet (`eip155:8453`). With Coinbase CDP sponsored gas, there are **zero gas fees**!

```typescript
import { createx402MCPClient } from '@x402/mcp';
import { ExactEvmScheme } from '@x402/evm/exact/client';
import { privateKeyToAccount } from 'viem/accounts';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const account = privateKeyToAccount(process.env.EVM_PRIVATE_KEY as `0x${string}`);

const mcpClient = createx402MCPClient({
  name: 'my-location-agent',
  version: '1.0.0',
  schemes: [{ network: 'eip155:8453', client: new ExactEvmScheme(account) }],
  autoPayment: true
});

await mcpClient.connect(
  new StreamableHTTPClientTransport(new URL('https://api.postcodecontext.uk/mcp'))
);

const response = await mcpClient.callTool('lookup_postcode', {
  postcode: 'SW1A 1AA',
  view: 'full' // or 'brief' (~80 tokens)
});
console.log(response.content[0].text);
```

### Option B: API Key / Credit Card Subscriptions
For users preferring traditional monthly credit card billing:
- Subscribe via **[MCP Marketplace](https://mcp-marketplace.io)** (`postcode-context-uk`) or **[MCPize](https://mcpize.com)**.
- Pass your key via header: `Authorization: Bearer mcp_live_...`

---

## 🔬 Example Tool Call & Output

### Request: `lookup_postcode` *(alias: `get_postcode_intelligence`)*
```json
{
  "postcode": "SW1A 1AA"
}
```

### Truncated Response:
```json
{
  "summary_for_ai": {
    "ai_context_briefing": "Buckingham Palace is the official London residence and administrative headquarters of the British Sovereign...",
    "primary_persona_tag": "Crown & Sovereign Diplomatic Enclave",
    "affluence_tier": "Ultra-Prime",
    "b2c_spending_propensity": "Sovereign estate, high-security royal residence, and international diplomatic statecraft.",
    "affluence_score_100": 100,
    "family_suitability_score_100": 81,
    "commuter_connectivity_score_100": 98,
    "property_value_index": 88
  },
  "location": {
    "postcode": "SW1A 1AA",
    "outcode": "SW1A",
    "local_authority": "Westminster",
    "region_or_nation": "England",
    "latitude": 51.501,
    "longitude": -0.1419
  },
  "property_and_energy": {
    "median_house_price_gbp": 1250000,
    "price_per_sqm_gbp": 14200,
    "epc_rating_current": "C",
    "epc_rating_potential": "B"
  },
  "deprivation_deciles": {
    "imd_overall_decile": 9,
    "crime_safety_decile": 7,
    "education_skills_decile": 8
  },
  "digital_infrastructure": {
    "broadband_speed_tier_mbps": 350,
    "gigabit_availability_pct": 94
  },
  "landmark_context": {
    "is_national_landmark": true,
    "landmark_name": "Buckingham Palace",
    "landmark_category": "Royal Residence"
  },
  "_attribution": "Contains OS data © Crown copyright and database right 2026. Contains Royal Mail data © Royal Mail copyright and database right 2026."
}
```

---

## 📜 Sovereign Attribution & Licensing

- **Service & Proprietary Rights:** Postcode Context Great Britain is a proprietary commercial API and remote MCP service operated by Postcode Context (postcodecontext.uk). The Worker backend source code, data pipelines, and pre-built database tables are proprietary and private. However, **all scoring algorithms, weighting dimensions, mathematical formulas, and data dictionary definitions are openly documented and verifiable** in this README and via the free `get_data_dictionary` tool / `/data-dictionary` endpoint. The client manifest files and wrapper in this repository are provided under the [Postcode Context Client Integration License](LICENSE) solely for connecting to the official endpoints. All queries are subject to the [Postcode Context Terms of Service](https://api.postcodecontext.uk/terms).
- **Public Sector Data Licensing:** Underlying sovereign datasets contain OS, ONS, Ofcom, EPC, DfE/GIAS, CQC, NaPTAN/ORR, HM Land Registry, and Registers of Scotland data © Crown copyright and database right 2026, licensed under the **Open Government Licence v3.0 (OGL v3.0)**. Royal Mail data © Royal Mail copyright and database right 2026.
