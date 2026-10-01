#!/usr/bin/env python3
"""
Financial Fraud Detection - Fraud Risk Scorer
Based on "Financial Shenanigans" (Schilit & Perler, 3rd Ed.)

Aggregates all signals from ratio_analyzer.py into a comprehensive risk score
with category breakdown and specific technique mapping.

Usage:
  python fraud_risk_scorer.py --input financial_data.json

Scoring Dimensions (0-100 total):
  - Governance Risk:          0-20 points
  - Revenue Manipulation:     0-25 points
  - Expense Manipulation:     0-25 points
  - Cash Flow Manipulation:   0-20 points
  - Key Metrics Risk:         0-10 points
"""

import argparse
import json
import os
import sys
from datetime import datetime
from typing import Dict, List, Optional, Tuple

# Reuse the analysis functions from ratio_analyzer
# (In production, these would be imported; for self-contained skill, inline is fine)
from ratio_analyzer import (
    analyze_revenue_quality,
    analyze_expense_quality,
    analyze_cashflow_quality,
    WarningSignal,
)


#    Governance scoring                                                       

def score_governance(data: dict) -> Tuple[int, List[str]]:
    """
    Score governance risk (0-20, higher = more risk).
    Based on Chapter 2 red flags.
    """
    score = 0
    findings = []

    checks = {
        "ceo_is_chairman": (3, "CEO is also Chairman - lack of board independence"),
        "family_dominated": (4, "Family-dominated management/board"),
        "consistent_beat_streak": (3, "Long streak of meeting/beating estimates (8+ quarters)"),
        "ceo_high_compensation": (2, "CEO compensation unusually high relative to peers"),
        "related_party_transactions": (4, "Significant related-party transactions disclosed"),
        "auditor_tenure_over_10": (2, "Same auditor for 10+ years without rotation"),
        "auditor_also_consulting": (2, "Auditor also provides large non-audit/consulting services"),
        "reverse_merger_or_spac": (3, "Company went public via reverse merger or SPAC"),
        "weak_internal_controls": (3, "Material weakness in internal controls reported"),
        "frequent_restatements": (3, "History of financial restatements"),
        "high_management_turnover": (2, "Frequent CFO/auditor turnover"),
        "aggressive_tax_avoidance": (1, "Aggressive tax strategies or tax haven usage"),
    }

    for key, (points, desc) in checks.items():
        if data.get(f"gov_{key}", False):
            score += points
            findings.append(f"    {desc} (+{points})")

    score = min(score, 20)  # Cap at 20
    return score, findings


#    Revenue manipulation scoring                                             

def score_revenue_manipulation(data: dict) -> Tuple[int, List[str]]:
    """
    Score revenue manipulation risk (0-25).
    Aggregates Scams 1-3 signals.
    """
    signals = analyze_revenue_quality(data)
    score = 0
    findings = []

    severity_points = {"CRITICAL": 8, "HIGH": 5, "MEDIUM": 3, "LOW": 1}

    for sig in signals:
        pts = severity_points.get(sig.severity, 1)
        score += pts
        findings.append(f"[{sig.severity}] {sig.signal} (+{pts})")

    # Additional governance-related revenue risks
    if data.get("rev_policy_changed", False):
        score += 3
        findings.append("    Revenue recognition policy changed recently (+3)")
    if data.get("rev_returns_high", False):
        score += 2
        findings.append("    High or increasing sales returns (+2)")
    if data.get("rev_channel_stuffing", False):
        score += 4
        findings.append("    Channel stuffing indicators (quarter-end shipment spikes) (+4)")
    if data.get("rev_bill_and_hold", False):
        score += 4
        findings.append("    Bill-and-hold transactions initiated by seller (+4)")
    if data.get("rev_round_trip", False):
        score += 5
        findings.append("    Round-trip or reciprocal transactions detected (+5)")

    score = min(score, 25)
    return score, findings


#    Expense manipulation scoring                                             

def score_expense_manipulation(data: dict) -> Tuple[int, List[str]]:
    """
    Score expense/asset manipulation risk (0-25).
    Aggregates Scams 4-5 signals.
    """
    signals = analyze_expense_quality(data)
    score = 0
    findings = []

    severity_points = {"CRITICAL": 8, "HIGH": 5, "MEDIUM": 3, "LOW": 1}

    for sig in signals:
        pts = severity_points.get(sig.severity, 1)
        score += pts
        findings.append(f"[{sig.severity}] {sig.signal} (+{pts})")

    # Additional signals
    if data.get("exp_cap_policy_changed", False):
        score += 4
        findings.append("    Changed capitalization policy (expensing -> capitalizing) (+4)")
    if data.get("exp_depreciation_extended", False):
        score += 3
        findings.append("    Extended useful life of assets (+3)")
    if data.get("exp_recurring_restructuring", False):
        score += 4
        findings.append("    Frequent restructuring charges recorded (+4)")
    if data.get("exp_unusual_assets", False):
        score += 3
        findings.append("    New or unusual asset accounts on balance sheet (+3)")
    if data.get("exp_inventory_obsolete", False):
        score += 2
        findings.append("    Failure to write down obsolete/overvalued inventory (+2)")

    score = min(score, 25)
    return score, findings


#    Cash flow manipulation scoring                                           

def score_cashflow_manipulation(data: dict) -> Tuple[int, List[str]]:
    """
    Score cash flow manipulation risk (0-20).
    Aggregates Scams 8-11 signals.
    """
    signals = analyze_cashflow_quality(data)
    score = 0
    findings = []

    severity_points = {"CRITICAL": 8, "HIGH": 5, "MEDIUM": 3, "LOW": 1}

    for sig in signals:
        pts = severity_points.get(sig.severity, 1)
        score += pts
        findings.append(f"[{sig.severity}] {sig.signal} (+{pts})")

    # Additional signals
    if data.get("cf_factor_receivables", False):
        score += 4
        findings.append("    Regularly sells/factors receivables to boost CFFO (+4)")
    if data.get("cf_delaying_payables", False):
        score += 2
        findings.append("    Unusually long payment terms to suppliers (+2)")
    if data.get("cf_reducing_r_and_d", False):
        score += 3
        findings.append("    Cutting R&D or maintenance spending to boost cash flow (+3)")
    if data.get("cf_acquisition_driven", False):
        score += 3
        findings.append("    Growth primarily driven by acquisitions (+3)")

    score = min(score, 20)
    return score, findings


#    Key metrics scoring                                                      

def score_key_metrics(data: dict) -> Tuple[int, List[str]]:
    """
    Score key metrics manipulation risk (0-10).
    Scams 12-13.
    """
    score = 0
    findings = []

    if data.get("metric_non_gaap_aggressive", False):
        score += 3
        findings.append("    Aggressive non-GAAP metrics that exclude normal operating costs (+3)")
    if data.get("metric_adjusted_ebitda_misleading", False):
        score += 3
        findings.append("    Adjusted EBITDA excludes significant real expenses (+3)")
    if data.get("metric_off_balance_sheet", False):
        score += 4
        findings.append("    Significant off-balance-sheet liabilities or SPEs (+4)")
    if data.get("metric_pension_assumptions", False):
        score += 2
        findings.append("    Unusually aggressive pension/retirement assumptions (+2)")
    if data.get("metric_stock_comp_hidden", False):
        score += 2
        findings.append("    Stock-based compensation poorly disclosed or excluded from metrics (+2)")
    if data.get("metric_same_store_sales_misleading", False):
        score += 2
        findings.append("    Same-store sales or comparable metrics defined misleadingly (+2)")

    # Derived from quantitative data
    revenue = data.get("revenue", 0)
    cffo = data.get("cffo", 0)
    net_income = data.get("net_income", 0)

    if revenue > 0 and net_income > 0:
        margin = net_income / revenue * 100
        cfo_margin = cffo / revenue * 100 if cffo else 0
        if margin > 20 and cfo_margin < 5:
            score += 3
            findings.append(f"    High net margin ({margin:.1f}%) but very low cash margin ({cfo_margin:.1f}%) - potential metric manipulation (+3)")

    score = min(score, 10)
    return score, findings


#    Risk rating                                                              

def risk_rating(total_score: int) -> Tuple[str, str]:
    """Classify total score into risk level."""
    if total_score >= 70:
        return "CRITICAL", "Very high fraud risk - multiple strong signals across categories"
    elif total_score >= 50:
        return "HIGH", "Elevated fraud risk - significant warning signals detected"
    elif total_score >= 30:
        return "MEDIUM", "Moderate fraud risk - some concerning signals, further investigation warranted"
    elif total_score >= 15:
        return "LOW", "Low fraud risk - minor signals, routine monitoring sufficient"
    else:
        return "VERY LOW", "Minimal fraud risk - few or no warning signals detected"


#    Main                                                                     

def main():
    parser = argparse.ArgumentParser(
        description="Financial Fraud Detection - Comprehensive Risk Scorer",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--input', '-i', required=True, help='JSON file with financial data and governance flags')
    parser.add_argument('--output', '-o', help='Output JSON file for results')
    args = parser.parse_args()

    with open(args.input, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print("=" * 70)
    print("  FINANCIAL FRAUD RISK ASSESSMENT")
    print("  Based on Financial Shenanigans (Schilit & Perler, 3rd Ed.)")
    print("=" * 70)

    # Score each dimension
    gov_score, gov_findings = score_governance(data)
    rev_score, rev_findings = score_revenue_manipulation(data)
    exp_score, exp_findings = score_expense_manipulation(data)
    cf_score, cf_findings = score_cashflow_manipulation(data)
    metric_score, metric_findings = score_key_metrics(data)

    total_score = gov_score + rev_score + exp_score + cf_score + metric_score
    rating, description = risk_rating(total_score)

    # Build results
    dimensions = [
        ("Governance Risk", gov_score, 20, gov_findings),
        ("Revenue Manipulation", rev_score, 25, rev_findings),
        ("Expense/Asset Manipulation", exp_score, 25, exp_findings),
        ("Cash Flow Manipulation", cf_score, 20, cf_findings),
        ("Key Metrics Manipulation", metric_score, 10, metric_findings),
    ]

    print(f"\n  Overall Risk Rating: [{rating}]")
    print(f"  Total Score: {total_score}/100")
    print(f"  {description}")
    print()

    for name, score, max_score, findings in dimensions:
        bar_len = 30
        filled = int(bar_len * score / max_score) if max_score > 0 else 0
        bar = " " * filled + " " * (bar_len - filled)
        pct = score / max_score * 100 if max_score > 0 else 0

        print(f"  {name:30s} {score:2d}/{max_score:2d} |{bar}| {pct:.0f}%")
        for f in findings:
            print(f"    {f}")
        print()

    # Summary table
    print(f"{' '*70}")
    print(f"  {'Dimension':30s} {'Score':>6s} {'Max':>4s} {'Weight':>6s}")
    print(f"{' '*70}")
    for name, score, max_score, _ in dimensions:
        weight = score / 100.0 * 100
        print(f"  {name:30s} {score:6d} {max_score:4d} {weight:5.0f}%")
    print(f"{' '*70}")
    print(f"  {'TOTAL':30s} {total_score:6d} {'100':>4s} {total_score:5.0f}%")
    print()

    # Output JSON
    if args.output:
        result = {
            "assessment_metadata": {
                "tool": "Financial Fraud Detection - Fraud Risk Scorer",
                "source": "Financial Shenanigans (Schilit & Perler, 3rd Ed.)",
                "timestamp": datetime.now().isoformat(),
            },
            "overall": {
                "total_score": total_score,
                "max_score": 100,
                "risk_rating": rating,
                "description": description,
            },
            "dimensions": [
                {
                    "name": name,
                    "score": score,
                    "max_score": max_score,
                    "findings": findings,
                }
                for name, score, max_score, findings in dimensions
            ],
        }

        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

        print(f"  Results saved to: {args.output}")

    print(f"{'='*70}")


if __name__ == "__main__":
    main()
