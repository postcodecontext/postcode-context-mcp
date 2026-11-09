# Postcode Context Great Britain — Remote MCP Server & x402 API

[![Official MCP Registry](https://img.shields.io/badge/MCP_Registry-uk.postcodecontext%2Fmcp-4f46e5?logo=anthropic)](https://registry.modelcontextprotocol.io/v0/servers?search=postcodecontext)
[![Glama TDQS](https://glama.ai/mcp/servers/postcodecontext/postcode-context-mcp/badge)](https://glama.ai/mcp/servers/postcodecontext/postcode-context-mcp)
[![Payment: x402 v2 USDC on Base](https://img.shields.io/badge/x402_v2-USDC_on_Base-0052ff)](https://api.postcodecontext.uk/.well-known/x402)
[![Coverage: 1.76M GB Postcodes](https://img.shields.io/badge/GB_Postcodes-1.76M_Active-10b981)](https://api.postcodecontext.uk/data-dictionary)
[![License: Proprietary / Client Terms](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Terms of Service](https://img.shields.io/badge/Terms-Commercial_API-blue)](https://api.postcodecontext.uk/terms)

> **Give AI agents real-world UK location intelligence.**  
> Turn any Great Britain postcode (England, Scotland, or Wales) into structured property, demographic, energy, school metadata, GP healthcare, rail transit, and broadband context in one call. Compare locations, batch-enrich up to 50 postcodes per request, and return source-grounded evidence—with transparent per-call pricing from $0.005 per request ($0.050 per 50-postcode batch = $1 per 1,000 postcodes).

**Postcode Context Great Britain** is a stateless Remote Model Context Protocol (MCP) Server (`streamable-http`) and REST API delivering socio-economic intelligence, ONS Census 2021 (England & Wales) and NRS Scotland's Census 2022 demographics, Index of Multiple Deprivation (IoD 2025 / WIMD 2025 / SIMD 2020v2) deciles, HM Land Registry & Registers of Scotland residential property prices, MHCLG & Scottish Domestic EPC ratings, and Ofcom gigabit broadband availability across **1,760,216 (1.76M) active Great Britain postcodes**.

Northern Ireland (`BT`) and Crown Dependencies (`JE`, `GY`, `IM`) are excluded due to separate proprietary licensing regimes (e.g., Land & Property Services Northern Ireland). Underlying public sector datasets are predominantly licensed under the Open Government Licence v3.0 (OGL v3.0) alongside Ordnance Survey, ONS, and Royal Mail Gridlink statutory attribution terms; commercial API access and integration usage remain governed by the [Terms of Service](https://api.postcodecontext.uk/terms) and [License](LICENSE).

---

## 🌐 Live Server Endpoints & Access Model

### Paid Intelligence Endpoints (`x402 v2` USDC on Base Mainnet `eip155:8453`)

Intelligence queries require per-call payment via the x402 v2 protocol (`USDC` on Base Mainnet with Coinbase CDP sponsored gas). Unpaid requests receive an HTTP `402 Payment Required` challenge (REST) or structured x402 payment requirement (MCP). There is no unauthenticated free sandbox tier on REST intelligence routes.

| Interface | Endpoint | Price (USDC) | Purpose |
|---|---|---|---|
| **Remote MCP (`tools/call`)** | `POST https://api.postcodecontext.uk/mcp` | **$0.005 – $0.050** | Execute the 8 paid intelligence MCP tools |
| **REST Single Postcode** | `GET https://api.postcodecontext.uk/api/v1/postcode/{postcode}` | **$0.005** | Full or filtered (`?view=`, `?exclude=`, `?format=`) unit profile |
| **REST Outcode District** | `GET https://api.postcodecontext.uk/api/v1/outcode/{outcode}` | **$0.005** | Outward postal district aggregation (e.g. `SW1A`, `BB7`) |
| **REST Compare** | `POST https://api.postcodecontext.uk/api/v1/compare` | **$0.010** | Side-by-side comparison & ranking of 2 to 5 postcodes |
| **REST Batch Enrichment** | `POST https://api.postcodecontext.uk/api/v1/batch` | **$0.050** | Bulk enrichment for 1 to 50 postcodes (`view="brief"` default) |

### Reference, Schema & Protocol Discovery Endpoints (`$0.00` / No Auth — Subject to Terms)

Protocol discovery, schema reference, documentation, and verification routes require **no authentication and $0.00 payment**. Usage remains subject to the [Terms of Service](https://api.postcodecontext.uk/terms) and statutory Crown / OGL v3.0 / Royal Mail attribution notices:

| Resource | URL | Format | Scope & Status |
|---|---|---|---|
| **MCP Discovery & Free Tools** | `POST https://api.postcodecontext.uk/mcp` | Streamable HTTP (`JSON-RPC 2.0`) | No auth (`$0.00`) for `initialize`, `tools/list`, `resources/list`, `resources/read`, `get_data_dictionary`, `get_data_attribution` |
| **Data Dictionary** | `https://api.postcodecontext.uk/data-dictionary` & `/api/v1/dictionary` | HTML & JSON | Complete field definitions, mathematical formulas & statistical caveats |
| **Attribution Registry** | `https://api.postcodecontext.uk/api/v1/attribution` | JSON | All 19 official data sources, vintages & OGL v3.0 / Gridlink notices |
| **OpenAPI 3.1 Spec** | `https://api.postcodecontext.uk/openapi.json` | OpenAPI JSON | Full REST API schema & x402 pricing metadata |
| **LLMs.txt & MCP Guide** | `https://api.postcodecontext.uk/llms.txt` & `/mcp-guide` | Markdown / HTML | Autonomous agent documentation & integration guides |
| **Discovery Manifests** | `/.well-known/x402`, `/.well-known/mcp.json`, `/.well-known/agent-card.json` | JSON | Standard x402, MCP, and A2A machine-discovery manifests |
| **Crawler Verification** | `https://api.postcodecontext.uk/.well-known/glama.json` | JSON | Glama Remote Connector domain ownership claim |
| **Registry Domain Auth** | `https://api.postcodecontext.uk/.well-known/mcp-registry-auth` | `text/plain` | Official MCP Registry HTTP Ed25519 domain verification route |
| **Legal Governance** | `/terms`, `/privacy`, `/legal` | HTML | Commercial Terms of Service, Privacy Notice & Disclaimers |

---

## 📊 Datasets & Coverage Scope

Every full postcode profile joins intelligence across **19 official Great Britain public sector and statutory datasets** (applied according to England, Scotland, and Wales jurisdiction via the ONS Postcode Directory `ONSPD 2026-Q3`, Ordnance Survey `OS OpenData`, and Royal Mail `Gridlink`):

1. **Property Valuation & Housing Stock (HM Land Registry `2024–2026` & Registers of Scotland `2023–2025`):**
   - 3-year rolling median residential transaction price, transaction volume (`sales_volume_3yr`), benchmark estimated price per square metre (£/sqm), `price_basis` granularity (`postcode`, `data_zone`, `outcode_district`, or `local_authority`), dominant property typology, mean internal floor area (`avg_floor_area_sqm`), and pre-1930 housing share (`pre_1930_housing_pct`).
2. **Census Demographics & Modelled Income Heuristic (ONS Census 2021 E&W; NRS Scotland's Census 2022):**
   - `est_median_household_income_gbp`: **Heuristic small-area estimate of annual gross disposable household income** (clamped `£21,000–£95,000` for relative ranking — *not* an observed Census or HMRC survey return).
   - Observed Census shares: NS-SeC higher managerial/professional %, Level 4+ and no-qualification rates, housing tenure breakdown (owned outright, mortgaged, private rented, social rented), economically active employed %, retired %, student %, work-from-home %, car ownership (`zero_cars`, `two_or_more_cars`), 5 age bands, and population density per km².
3. **Statutory Indices of Multiple Deprivation — All 7 Domains:**
   - National deciles (`1` = most deprived 10% within home nation, `10` = least deprived 10%) and overall rank across **overall IMD** plus all **7 statutory domains**: `income`, `employment`, `education_skills`, `health`, `crime_safety`, `housing_barriers`, and `living_environment` (English IoD 2025, Welsh WIMD 2025, Scottish SIMD 2020v2).
   - *Cross-border note:* IMD deciles are calculated separately within England, Wales, and Scotland and are not directly interchangeable across national borders.
4. **Domestic EPC Energy Efficiency (MHCLG Open EPC E&W & Scottish Domestic EPC Register):**
   - Modal current and potential EPC rating bands (`A–G`) and green retrofit upside summary (`retrofit_upside_potential`).
5. **Ofcom Digital Infrastructure (Connected Nations 2026):**
   - `gigabit_availability_pct`: Percentage of domestic premises with access to gigabit-capable broadband (`>= 1,000 Mbps`, FTTP full fibre or gigabit cable).
   - `broadband_speed_tier_mbps`: Discrete fixed broadband availability tier (`350`, `120`, `80`, or `68.5 Mbps` baseline) derived from Ofcom availability brackets. *Note: This is a modelled availability tier, not an empirically measured speed-test average; separate FTTP-only and superfast availability percentages are not returned.*
6. **Schools Metadata & Straight-Line Proximity (DfE GIAS, Scottish SEED, Welsh Government):**
   - Nearest primary and nearest secondary school metadata (`id`, `name`, `phase`, `gender`, `religious_character`, `admissions_policy`) with straight-line geodesic distance (`distance_km`). *Note: Does NOT include statutory school inspection ratings or school admissions catchment boundaries.*
7. **Primary Care / GP Proximity & Statutory Ratings (CQC England, PHS/HIS Scotland, NWSSP/HIW Wales):**
   - `nearest_gp_surgery`: Nearest registered GP practice/surgery (`id`, `name`, `care_type`, straight-line `distance_km`, `regulator`, statutory `rating`, and `inspection_date` where available). *Note: Acute hospitals are not returned in API responses.*
8. **Rail & Rapid Transit Connectivity (DfT NaPTAN & ORR Table 1410):**
   - `nearest_station` and `nearest_intercity_hub` (`id`, `name`, `station_type`, straight-line geodesic `distance_km`, and `hub_type` station hierarchy tier: `national_hub`, `regional_hub`, `commuter_hub`, or `local_station` derived from ORR Table 1410 usage & Network Rail categories; raw annual passenger counts are not returned).
9. **National Landmarks & Special Non-Geographic Context:**
   - Curated `landmark_context` flags and demographic distortion notes for major UK royal, civic, diplomatic, and institutional postcodes (e.g., `SW1A 1AA`), plus British Forces Post Office (`BF1`) and royal/civic non-geographic postcodes.

---

## 📐 Transparent Scoring Methodology & Mathematical Formulas

Every synthetic score in Postcode Context is deterministic, grounded in Census 2021/2022 and statutory public registers, and documented below and in the live Data Dictionary:

### 1. Affluence Score (`affluence_score_100`)
- **Scale:** `1 to 100` (100 = Peak Affluence; ~10 points represents ~1 national decile shift).
- **Weighting Dimensions:**
  - **35% Heuristic Modelled Gross Disposable Household Income:** Normalized against regional GDHI baseline (£72,000 ceiling, capped at 100), where $\text{Income} = \text{clamp}\left(21000, 95000, \text{round}\left(22000 + 3300 \times (\text{IncomeDecile} - 1) + 260 \times \text{Managerial} + 180 \times \text{L4}\right)\right)$.
  - **25% Human Capital:** Equal weighting between Level 4+ higher education degree holders (`degree_or_higher_level4_plus`) and higher managerial/professional occupations (`ns_sec_managerial_professional_pct`).
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
  - **30% Statutory Education Deprivation & School Proximity:** Low adult/child education deprivation (`education_skills_decile * 10`), adjusted at runtime if the nearest primary school (falling back to nearest secondary if unavailable) exceeds 3 km geodesic distance: $\text{EduComponent} = \max\left(10, \text{round}\left(\text{EduDecile} \times 10 - \min\left(20, \max(0, \text{SchoolDistKm} - 3) \times 2\right)\right)\right)$.
  - **30% Demographic Family Density:** Concentration of children (0–15 years) and parenting-age adults (30–44 years).
- **Formula:**
  $$\text{Score} = \text{clamp}\left(1, 100, \text{round}\left(0.40 \times (\text{CrimeDecile} \times 10) + 0.30 \times \text{EduComponent} + 0.30 \times \min\left(100, (\text{Age}_{0-15} + \text{Age}_{30-44}) \times 2\right)\right)\right)$$
- **Scope Note:** Evaluates statutory neighbourhood crime/education deciles, age structure, and straight-line proximity; does **not** include school inspection ratings or admissions catchment boundaries.

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
Assigned deterministically through a transparent decision tree based on wealth tier, student concentration, age cohorts, and rental tenure across residential archetypes (*Ultra-High-Net-Worth Executives & Diplomatic Residents*, *Urban Young Renters & University Students*, *Affluent Coastal & Countryside Retirees*, *Affluent Suburban Commuter Families*, *Metropolitan Corporate Professionals & Renters*, *Industrial & Service Sector Households*, and *Established Mixed-Generation Suburban Residents*). Curated national landmarks receive specialized institutional archetypes (e.g., *Crown & Sovereign Diplomatic Enclave*).

> **Verifiable via Tool & Web:** The complete mathematical dictionary for all **113 documented dictionary fields** (across 11 domains, including nested subfields, query metadata, and 1 deprecated alias) can be inspected programmatically via `get_data_dictionary` ($0.00) or online at [https://api.postcodecontext.uk/data-dictionary](https://api.postcodecontext.uk/data-dictionary).

---

## 🧰 Available MCP Tools (10 Canonical Tools)

MCP discovery (`initialize`, `tools/list`, `resources/list`), `resources/read` (`postcode://data-dictionary`, `postcode://data-attribution`), and the two reference tools (`get_data_dictionary`, `get_data_attribution`) require **no authentication and $0.00 payment** (subject to the Terms of Service). All 10 tools declare explicit MCP annotations (`readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`, `openWorldHint: false`), and five backward-compatible tool aliases are routed transparently on `tools/call`.

| Tool Name | Price (USDC / Call) | Annotations | Function |
|---|---|---|---|
| `lookup_postcode` *(alias: `get_postcode_intelligence`)* | **$0.005** | Read-Only, Idempotent | Full multi-domain profile across 113 documented dictionary fields (`view="brief"` for ~80 tokens) |
| `compare_postcodes` *(aliases: `compare_gb_postcodes`, `compare_uk_postcodes`)* | **$0.010** | Read-Only, Idempotent | Side-by-side comparison of 2 to 5 postcodes with automated AI synthesis ranking |
| `enrich_postcodes` *(alias: `enrich_postcodes_batch`)* | **$0.050** | Read-Only, Idempotent | High-throughput cohort enrichment for 1 to 50 postcodes (`view="brief"` default; $1/1,000 at max 50 batch) |
| `summarise_outcode` *(alias: `get_outcode_district_summary`)* | **$0.005** | Read-Only, Idempotent | District-level aggregation across an outward postal district (e.g. `SW1A`, `EH1`) |
| `get_postcode_ai_brief` | **$0.005** | Read-Only, Idempotent | Low-token (~80 tokens) natural language briefing, affluence score & persona |
| `get_property_and_energy_profile` | **$0.005** | Read-Only, Idempotent | HMLR / RoS median price, £/sqm, sales volume, EPC band & retrofit upside |
| `get_demographics_and_deprivation` | **$0.005** | Read-Only, Idempotent | Heuristic household income, Census 2021 (E&W) / 2022 (Scotland) demographics & 7-domain IMD deciles |
| `screen_postcodes` | **$0.010** | Read-Only, Idempotent | Rank 2 to 10 postcodes by `affluence`, `house_price`, `crime_safety`, `broadband_speed`, `family_suitability`, or `connectivity` |
| `get_data_dictionary` | **$0.00** *(No Auth)* | Read-Only, Idempotent | Exact field definitions, calculation formulas, statistical scales, and sources |
| `get_data_attribution` | **$0.00** *(No Auth)* | Read-Only, Idempotent | Statutory Crown copyright, OGL v3.0, and Royal Mail Gridlink provenance metadata |

> **District Fallback & Fair Exchange Guarantee:** If a syntactically valid GB unit postcode is newly registered or absent from ONSPD, lookup falls back automatically to the parent outward district (`match_type: "district_fallback"`, `confidence: "approximate"`). On x402-signed requests, if neither the unit postcode nor its outward district matches in ONS data—or if a request fails syntax validation or targets excluded territories (`BT`, `JE`, `GY`, `IM`)—tool execution errors before settlement (`billed: false`, **$0.00 USDC settled**). Unpaid requests without an x402 payment header receive the standard payment challenge upfront.

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
      "type": "streamable-http",
      "url": "https://api.postcodecontext.uk/mcp"
    }
  }
}
```

---

### 3. Claude Code CLI

Add the remote server directly with one command:

```bash
claude mcp add --transport http postcode-context https://api.postcodecontext.uk/mcp
```

---

### 4. VS Code (Copilot / MCP)

In `.vscode/mcp.json`:

```json
{
  "servers": {
    "postcode-context": {
      "type": "http",
      "url": "https://api.postcodecontext.uk/mcp"
    }
  }
}
```

---

## 💳 Autonomous Payment via x402 (Zero-Signup USDC on Base)

AI agents and code pipelines can call paid tools autonomously in USDC on Base Mainnet (`eip155:8453`) with Coinbase CDP sponsored gas (**zero gas fees**):

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

---

## 🔬 Example Tool Call & Output

### Request: `lookup_postcode` *(alias: `get_postcode_intelligence`)*
```json
{
  "postcode": "SW1A 1AA"
}
```

### Truncated Live Response *(abridged for brevity; full census, school, GP, transit & licensing fields omitted)*:
```json
{
  "match_type": "exact_unit",
  "confidence": "exact",
  "summary_for_ai": {
    "ai_context_briefing": "Buckingham Palace is the official London residence and administrative headquarters of the British Sovereign. General Census 2021 returns for LSOA Westminster 018C reflect surrounding civic barracks and transient rental flats, not the sovereign palace estate. Census demographics reflect residential blocks in Westminster 018C (Wellington Barracks and rental flats towards Victoria), not the Royal Household.",
    "primary_persona_tag": "Crown & Sovereign Diplomatic Enclave",
    "affluence_tier": "Ultra-Prime",
    "b2c_spending_propensity": "Sovereign estate, high-security royal residence, and international diplomatic statecraft.",
    "affluence_score_100": 100,
    "family_suitability_score_100": 67,
    "commuter_connectivity_score_100": 92,
    "property_value_index": 100
  },
  "location": {
    "postcode": "SW1A 1AA",
    "clean_postcode": "SW1A1AA",
    "outcode": "SW1A",
    "incode": "1AA",
    "lsoa_code": "E01004736",
    "lsoa_name": "Westminster 018C",
    "local_authority": "Westminster",
    "region_or_nation": "England",
    "latitude": 51.50101,
    "longitude": -0.141563
  },
  "property_and_energy": {
    "median_house_price_gbp": 3525000,
    "price_per_sqm_gbp": 47000,
    "price_basis": {
      "resolution": "postcode",
      "window": "2024–2026",
      "n": 38
    },
    "sales_volume_3yr": 38,
    "dominant_property_type": "Terraced",
    "avg_floor_area_sqm": 75,
    "epc_rating_current": "D",
    "epc_rating_potential": "C",
    "retrofit_upside_potential": "High upgrade upside (Current EPC D upgradable to C)"
  },
  "deprivation_deciles": {
    "imd_overall_decile": 8,
    "crime_safety_decile": 5,
    "education_skills_decile": 10
  },
  "census_demographics": {
    "est_median_household_income_gbp": 73722
  },
  "digital_infrastructure": {
    "broadband_speed_tier_mbps": 68.5,
    "gigabit_availability_pct": 0
  },
  "schools_and_education": {
    "nearest_primary_school": {
      "id": "ENG-152443",
      "name": "St Vincent De Paul Catholic Primary School",
      "phase": "Primary",
      "distance_km": 0.56
    },
    "nearest_secondary_school": {
      "id": "ENG-138312",
      "name": "Westminster City School",
      "phase": "Secondary",
      "distance_km": 0.38
    }
  },
  "healthcare_and_services": {
    "nearest_gp_surgery": {
      "id": "CQC-1-15779406945",
      "name": "Dr Apul Parikh Clinic",
      "care_type": "GP Practice",
      "distance_km": 0.48,
      "regulator": "CQC"
    }
  },
  "transit": {
    "nearest_station": {
      "id": "4900VICTRIC1",
      "name": "Victoria",
      "station_type": "London Underground",
      "hub_type": "national_hub",
      "distance_km": 0.52
    }
  },
  "landmark_context": {
    "is_national_landmark": true,
    "landmark_name": "Buckingham Palace",
    "landmark_category": "Royal Residence",
    "demographic_distortion_note": "Census demographics reflect residential blocks in Westminster 018C (Wellington Barracks and rental flats towards Victoria), not the Royal Household."
  },
  "_attribution": "Contains OS data © Crown copyright and database right 2026. Contains Royal Mail data © Royal Mail copyright and database right 2026. Contains National Statistics data © Crown copyright and database right 2026. Contains HM Land Registry data © Crown copyright 2026. Contains Registers of Scotland data © Crown copyright and database right 2026. Contains public sector information licensed under the Open Government Licence v3.0 (MHCLG Open EPC, Scottish Government Domestic EPC, English/Welsh/Scottish Indices of Deprivation, Ofcom Connected Nations, DfE GIAS, CQC, Scottish Government, Welsh Government, Public Health Scotland, Healthcare Inspectorate Wales)."
}
```

---

## 📜 Data Provenance, Attribution & Licensing

- **Service & Proprietary Rights:** Postcode Context Great Britain is a proprietary commercial API and remote MCP service operated by Postcode Context (`postcodecontext.uk`). The Worker backend source code, data pipelines, and pre-built database tables are proprietary and private. However, **all scoring algorithms, weighting dimensions, mathematical formulas, and data dictionary definitions are openly documented and verifiable** in this README and via the `get_data_dictionary` tool / `/data-dictionary` endpoint ($0.00). The client manifest files and stdio wrapper in this repository are provided under the [Postcode Context Client Integration License](LICENSE) solely for connecting to the official endpoints. All queries remain subject to the [Postcode Context Terms of Service](https://api.postcodecontext.uk/terms).
- **Public Sector Data & Statutory Attribution:** Underlying public sector datasets contain OS, ONS (Census 2021 / ONSPD), NRS Scotland (Census 2022), Ofcom (Connected Nations), MHCLG (Open EPC & IoD 2025), Scottish Government (Domestic EPC, SIMD 2020v2, SEED), Welsh Government (WIMD 2025 & Schools), DfE (GIAS), CQC, PHS/HIS Scotland, NWSSP/HIW Wales, DfT (NaPTAN), ORR (Table 1410), HM Land Registry, and Registers of Scotland data © Crown copyright and database right 2026, licensed under the **Open Government Licence v3.0 (OGL v3.0)**. Royal Mail postcode and Gridlink allocation data © Royal Mail copyright and database right 2026 is supplied under Gridlink licensing arrangements. Full dataset-by-dataset provenance is published at `/api/v1/attribution`.
