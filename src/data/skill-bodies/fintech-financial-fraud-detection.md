# Financial Fraud Detection Skill

This skill provides a comprehensive framework for detecting financial statement fraud based on the taxonomies and techniques from **"Financial Shenanigans: How to Detect Accounting Gimmicks & Fraud in Financial Reports" (3rd Edition)** by Howard M. Schilit and Jeremy Perler.

## Core Philosophy

Financial fraud operates across three interdependent financial statements — think of them as three "mountains" that must all be climbed:

1. **Income Statement** (Revenue Manipulation) — The most common fraud target
2. **Cash Flow Statement** (Cash Flow Manipulation) — Often overlooked by investors
3. **Balance Sheet & Key Metrics** (Key Metrics Manipulation) — The final check

Like the US government's system of checks and balances, these three statements check each other. Fraud in one statement leaves footprints in the others.

## The 13 Major Scams (44 Techniques)

### Category 1: Revenue Manipulation (7 Techniques)

| # | Technique | What to Look For |
|---|-----------|------------------|
| 1 | **Recording Revenue Too Early** | Revenue before obligations fulfilled; bill-and-hold; long payment terms; incomplete performance |
| 2 | **Recording Fictitious Revenue** | Transactions lacking economic substance; round-trip trades; channel stuffing |
| 3 | **Boosting Income with One-Time Items** | Gains from asset sales classified as operating income; misleading classification |
| 4 | **Shifting Current Expenses to Later Period** | Improper capitalization; too-long amortization periods; failure to write down assets |
| 5 | **Using Other Methods to Hide Costs/Losses** | Not recording expense transactions; reversing accrued expenses; stock option backdating |
| 6 | **Shifting Current Revenue to Later Period** | Creating "cookie jar" reserves; delaying revenue recognition |
| 7 | **Shifting Future Expenses to Current Period** | "Big bath" charges; accelerating write-offs |

### Category 2: Cash Flow Manipulation (4 Techniques)

| # | Technique | What to Look For |
|---|-----------|------------------|
| 8 | **Shifting Financing Cash Inflows to Operating** | Bank loans recorded as sales; customer deposits treated as revenue |
| 9 | **Shifting Operating Cash Outflows to Investing** | Capitalizing normal operating expenses; classifying expenses as "investing activities" |
| 10 | **Boosting Operating Cash Flow via Acquisitions/Disposals** | Acquiring companies with receivables; selling receivables to boost cash flow |
| 11 | **Boosting Operating Cash Flow via Unsustainable Activities** | Selling receivables; cutting necessary expenses; delaying payables |

### Category 3: Key Metrics Manipulation (2 Techniques)

| # | Technique | What to Look For |
|---|-----------|------------------|
| 12 | **Presenting Misleading Metrics That Overstate Performance** | Non-GAAP metrics that exclude real costs; adjusted EBITDA manipulation |
| 13 | **Distorting Balance Sheet Metrics to Hide Deterioration** | Understating debt; overstating asset values; manipulating DSO/DSI |

## The Four-Layer Investigation Workflow

When analyzing a company for potential financial fraud, follow this structured process:

### Layer 1: Environmental Assessment (Governance Red Flags)

Before looking at numbers, assess whether the environment is fertile for fraud:

- **Lack of management checks and balances**: Single dominant leader, family-run with family in key positions, CEO also Chairman
- **"Win at all costs" culture**: Consistently meets or beats Wall Street expectations, promotes this streak
- **Management compensation tied to stock price**: Unusual bonus plans, option backdating patterns
- **Board lacks independence**: Directors have conflicts of interest, related-party transactions
- **Weak auditors**: Long auditor tenure (10+ years), large non-audit fees, small/low-reputation audit firm
- **Attempts to evade regulatory scrutiny**: Reverse mergers, SPACs (special purpose acquisition companies)

**Red flags checklist** (in `references/warning_signals.md`):
- [ ] Management dominated by single family/individual
- [ ] CEO also Chairman, no lead independent director
- [ ] Consistent streak of meeting/exceeding guidance (8+ quarters)
- [ ] Unusual or aggressive compensation plans
- [ ] Board members with related-party transactions
- [ ] Same auditor for 10+ years
- [ ] Auditor also provides large non-audit services
- [ ] Company went public via reverse merger or SPAC

### Layer 2: Revenue Quality Analysis

Use bundled script: `python scripts/ratio_analyzer.py --revenue`

**Key quantitative signals:**

| Metric | Warning Signal | Formula |
|--------|---------------|---------|
| **DSO (Days Sales Outstanding)** | DSO rising faster than revenue growth | (Ending AR / Revenue) × Days in period |
| **Revenue / Cash from Operations** | Ratio > 1.2 and widening | Revenue ÷ CFFO |
| **Revenue Growth vs. AR Growth** | AR growth significantly exceeds revenue growth | Compare YoY % changes |
| **Unbilled Receivables** | Sudden spike | Check balance sheet for "unbilled AR" |
| **Long-term Receivables** | Appearing or growing rapidly | Check notes for installment AR |
| **Deferred Revenue Decline** | Falling without explanation | Compare to prior periods |

**Revenue fraud specific red flags to check:**
- □ Revenue recognized before contractual obligations fulfilled
- □ Bill-and-hold transactions initiated by seller (not buyer)
- □ Long payment terms (120+ days) offered to customers
- □ Related-party sales with unusual terms
- □ Round-trip transactions (customer is also supplier)
- □ Channel stuffing / loading (quarter-end shipment spikes)
- □ Supplier/customer financing arrangements
- □ Changes in revenue recognition policy

### Layer 3: Expense & Asset Quality Analysis

Use bundled script: `python scripts/ratio_analyzer.py --expense`

**Key quantitative signals:**

| Metric | Warning Signal | Formula |
|--------|---------------|---------|
| **Operating Cash Flow vs. Net Income** | CFFO < Net Income consistently | CFFO - Net Income (negative = poor quality) |
| **DSI (Days Sales Inventory)** | DSI rising much faster than COGS | (Ending Inventory / COGS) × Days |
| **Capitalization Ratio** | Capitalized costs growing as % of revenue | Capitalized costs ÷ Revenue |
| **CapEx Surge** | Unexpected or unexplained capital expenditure spike | CapEx YoY % change |
| **Depreciation / Amortization Life** | Extended useful lives or slower depreciation | Compare to industry standards |
| **Allowance for Bad Debt / AR** | Allowance shrinking while AR grows | Allowance ÷ Gross AR (declining = warning) |
| **Reserve Accounts** | Unexplained decreases in reserve/accrual balances | Compare as % of related balance |

**Expense fraud specific red flags:**
- □ Policy changed from expensing to capitalizing costs
- □ New or unusual asset accounts on balance sheet
- □ Amortization/depreciation periods extended
- □ Asset impairment not recorded despite market declines
- □ Inventory reserves declining while inventory rises
- □ Bad debt allowance declining while AR rises
- □ Recurring "restructuring" or "one-time" charges
- □ Stock option backdating or improper grant-date accounting

### Layer 4: Cash Flow & Key Metrics Analysis

Use bundled script: `python scripts/ratio_analyzer.py --cashflow`

**Key quantitative signals:**

| Metric | Warning Signal | Formula |
|--------|---------------|---------|
| **Free Cash Flow** | FCF declining while earnings rise | CFFO - CapEx |
| **CFFO / Net Income** | Ratio < 1.0 consistently | CFFO ÷ Net Income |
| **Asset-based CFFO** | CFFO growing due to changes in working capital (not operations) | Check working capital changes in cash flow statement |
| **Acquisition-adjusted FCF** | FCF positive but negative after subtracting acquisition spending | FCF - Acquisition Cash Outflows |

**Cash flow fraud specific red flags:**
- □ Operating cash flow growing much faster than earnings
- □ Free cash flow deteriorating despite reported profitability
- □ Large changes in working capital (payables, receivables, inventory)
- □ Sale of receivables to boost operating cash flow
- □ Securitization or factoring of receivables
- □ Acquisition spending classified as operating activity
- □ Unsustainable sources of cash (cutting R&D, maintenance, advertising)

## Using the Python Scripts

Two scripts are bundled with this skill:

### 1. `ratio_analyzer.py` — Financial Ratio Analysis

Computes all key ratios and flags warning signals:

```bash
python scripts/ratio_analyzer.py --income --revenue     # Revenue quality analysis
python scripts/ratio_analyzer.py --expense               # Expense/asset quality
python scripts/ratio_analyzer.py --cashflow              # Cash flow analysis
python scripts/ratio_analyzer.py --all                   # Full analysis
```

**Input:** Provide financial data as JSON, CSV, or manually input key figures.
**Output:** Ratio calculations, trend analysis, and specific red flag alerts mapped to the 13-scam taxonomy.

### 2. `fraud_risk_scorer.py` — Comprehensive Fraud Risk Scoring

Aggregates all signals into a risk score with category breakdown:

```bash
python scripts/fraud_risk_scorer.py --input financial_data.json
```

**Scoring dimensions:**
- Governance Risk (0-20 points)
- Revenue Manipulation Risk (0-25 points)
- Expense Manipulation Risk (0-25 points)
- Cash Flow Manipulation Risk (0-20 points)
- Key Metrics Risk (0-10 points)

**Output:** Total risk score (0-100) with severity rating and specific techniques detected.

## Report Structure

When asked to analyze a company for potential financial fraud, produce a structured report:

```
# Fraud Risk Analysis: [Company Name]

## Executive Summary
- Overall fraud risk rating (Low / Medium / High / Critical)
- Number of red flags detected by category
- Key concerns identified

## 1. Environmental / Governance Assessment
- Management structure and checks
- Board independence
- Auditor quality and tenure
- Compensation structure
- Related-party transactions

## 2. Revenue Quality Assessment
- DSO trends and AR growth analysis
- Revenue recognition policy evaluation
- Specific techniques detected (map to Scams 1-3)

## 3. Expense & Asset Quality Assessment
- Capitalization policy analysis
- Depreciation/amortization reasonableness
- Reserve adequacy evaluation
- Specific techniques detected (map to Scams 4-5)

## 4. Cash Flow Quality Assessment
- FCF vs. reported earnings comparison
- Working capital change analysis
- Specific techniques detected (map to Scams 8-11)

## 5. Key Metrics Assessment
- Non-GAAP metric evaluation
- Balance sheet indicator quality
- Specific techniques detected (map to Scams 12-13)

## 6. Overall Risk Score (if financial data sufficient)
- Score breakdown by dimension
- Comparison to industry benchmarks

## Key Warning Signals Summary
- Bullet list of specific red flags found

## Recommendations
- Further investigation steps
- Specific areas to monitor
```

## Example Analysis Prompts

**Example 1 — Revenue recognition investigation:**
> "Analyze Company X's revenue quality. Their revenue grew 30% YoY but AR grew 55%. DSO went from 45 to 58 days. They recently changed revenue recognition policy for long-term contracts. Check for Scams 1-3."

**Example 2 — Full fraud risk assessment:**
> "Perform a complete financial fraud risk assessment on Company Y. I'll provide their 10-K financial statements. Look for all 13 types of scams — revenue manipulation, cash flow manipulation, and key metrics manipulation. Governance: founder is CEO+Chairman, 12-year auditor tenure."

**Example 3 — Cash flow investigation:**
> "Company Z shows growing net income but operating cash flow is declining. Free cash flow turned negative this year. CapEx suddenly doubled. They acquired 3 companies last year. Investigate cash flow fraud (Scams 8-11)."

**Example 4 — Quick red flag scan:**
> "Do a quick scan on Company W. Revenue up 40%, AR up 80%, bad debt allowance dropped, inventory DSI jumped from 60 to 85 days. They've beaten earnings estimates 14 quarters straight."

## Key References

- **Full warning signals catalog**: See `references/warning_signals.md` for the complete organized list of all red flags from the 13 scams
- **Python scripts**: Use `scripts/ratio_analyzer.py` for quantitative ratio analysis, `scripts/fraud_risk_scorer.py` for comprehensive risk scoring
- **Source**: Based on "Financial Shenanigans (3rd Ed.)" by Howard M. Schilit & Jeremy Perler

## Important Caveats

- **Fraud detection is probabilistic, not deterministic.** Red flags indicate elevated risk, not proof of fraud.
- **Context matters.** Some industries have naturally high DSO or unique revenue recognition patterns. Always compare to industry peers.
- **Good companies can have red flags.** Distinguish between aggressive accounting (within GAAP) and fraudulent accounting (violates GAAP).
- **Our goal is to identify risk, not to make accusations.** Present findings as "warning signals" and "risk factors," not definitive conclusions.