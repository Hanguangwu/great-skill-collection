#!/usr/bin/env python3
"""
Financial Fraud Detection - Ratio Analyzer
Based on "Financial Shenanigans" (Schilit & Perler, 3rd Ed.)

Computes key financial ratios and flags warning signals for:
  --revenue   : Revenue quality (DSO, AR growth, unbilled receivables)
  --expense   : Expense/asset quality (DSI, capitalization, reserves)
  --cashflow  : Cash flow quality (FCF, CFFO/Net Income, acquisition-adjusted FCF)
  --all       : Full analysis

Usage:
  python ratio_analyzer.py --revenue  (or --expense, --cashflow, --all)

Input: Provide financial data via JSON file or manual input.
"""

import argparse
import json
import sys
import os
from pathlib import Path
from typing import Dict, List, Optional, Tuple


#    Warning signal definitions                                               

SIGNAL_SEVERITY = {
    "LOW": "Low - minor concern, monitor",
    "MEDIUM": "Medium - warrants further investigation",
    "HIGH": "High - likely manipulation indicator",
    "CRITICAL": "Critical - strong fraud signal",
}


class WarningSignal:
    """A detected red flag mapped to the 13-scam taxonomy."""

    def __init__(self, scam_id: int, technique: str, signal: str,
                 severity: str, detail: str = ""):
        self.scam_id = scam_id
        self.technique = technique
        self.signal = signal
        self.severity = severity
        self.detail = detail

    def __repr__(self):
        detail = self.detail.replace('\u2192', '->') if self.detail else ""
        return (f"[Scam {self.scam_id}] {self.technique}: {self.signal} "
                f"({SIGNAL_SEVERITY[self.severity]})"
                + (f" - {detail}" if detail else ""))


#    Revenue Quality Analysis (Scams 1-3)                                     

def analyze_revenue_quality(data: dict) -> List[WarningSignal]:
    """Analyze revenue recognition quality for Scams 1-3."""
    signals = []

    revenue = data.get("revenue", 0)
    prev_revenue = data.get("prev_revenue", 0)
    ar = data.get("accounts_receivable", 0)
    prev_ar = data.get("prev_ar", 0)
    unbilled_ar = data.get("unbilled_ar", 0)
    prev_unbilled_ar = data.get("prev_unbilled_ar", 0)
    long_term_ar = data.get("long_term_ar", 0)
    prev_long_term_ar = data.get("prev_long_term_ar", 0)
    days = data.get("days_in_period", 365)
    cffo = data.get("cffo", 0)
    net_income = data.get("net_income", 0)

    # DSO (Days Sales Outstanding) - Scam 1 warning signal
    if revenue > 0:
        dso = (ar / revenue) * days
        if prev_revenue > 0 and prev_ar > 0:
            prev_dso = (prev_ar / prev_revenue) * days
            dso_change = dso - prev_dso
            if dso_change > 10:
                signals.append(WarningSignal(
                    1, "Recording Revenue Too Early",
                    f"DSO increased by {dso_change:.1f} days ({prev_dso:.1f} -> {dso:.1f})",
                    "HIGH" if dso_change > 20 else "MEDIUM",
                    f"AR growing faster than revenue suggests aggressive revenue recognition"
                ))

        if dso > 90:
            signals.append(WarningSignal(
                1, "Recording Revenue Too Early",
                f"DSO is very high at {dso:.1f} days",
                "MEDIUM",
                "DSO > 90 days indicates potential premature revenue recognition"
            ))

    # AR growth vs Revenue growth - Scam 1-2 signal
    if prev_revenue > 0 and prev_ar > 0:
        revenue_growth = (revenue - prev_revenue) / prev_revenue * 100
        ar_growth = (ar - prev_ar) / prev_ar * 100
        if ar_growth > revenue_growth + 15:
            signals.append(WarningSignal(
                1, "Recording Revenue Too Early / Fictitious Revenue",
                f"AR growth ({ar_growth:.1f}%) significantly exceeds revenue growth ({revenue_growth:.1f}%)",
                "HIGH" if (ar_growth - revenue_growth) > 30 else "MEDIUM",
                "Excess AR growth suggests channel stuffing, premature recognition, or fictitious sales"
            ))

    # Unbilled receivables - Scam 1
    if unbilled_ar > 0 and prev_unbilled_ar > 0:
        ub_growth = (unbilled_ar - prev_unbilled_ar) / prev_unbilled_ar * 100
        if ub_growth > 30:
            signals.append(WarningSignal(
                1, "Recording Revenue Too Early",
                f"Unbilled receivables surged {ub_growth:.1f}%",
                "HIGH",
                "Unbilled AR spike indicates revenue booked before billing/customer acceptance"
            ))

    # Long-term receivables - Scam 1 (extended payment terms)
    if long_term_ar > 0 and prev_long_term_ar > 0:
        lt_growth = (long_term_ar - prev_long_term_ar) / prev_long_term_ar * 100
        if lt_growth > 30:
            signals.append(WarningSignal(
                1, "Recording Revenue Too Early",
                f"Long-term receivables surged {lt_growth:.1f}%",
                "MEDIUM",
                "Long-term installment AR growth suggests extended payment terms to pull forward revenue"
            ))

    # Operating cash flow vs net income - Scam 1-2 cross-check
    if net_income > 0 and cffo is not None:
        quality_ratio = cffo / net_income if net_income != 0 else 0
        if quality_ratio < 0.8:
            signals.append(WarningSignal(
                1, "Revenue Quality (Cross-check)",
                f"CFFO/Net Income ratio is {quality_ratio:.2f} (below 0.8)",
                "MEDIUM",
                "Earnings quality concern: cash generated is significantly less than reported earnings"
            ))

    # Revenue growth check - Scam 2 (too good to be true)
    if prev_revenue > 0:
        rev_growth = (revenue - prev_revenue) / prev_revenue * 100
        if rev_growth > 100:
            signals.append(WarningSignal(
                2, "Fictitious Revenue",
                f"Revenue grew {rev_growth:.1f}% YoY - unusually high growth rate",
                "HIGH",
                "Revenue doubling is historically rare without M&A; investigate revenue composition"
            ))

    return signals


#    Expense & Asset Quality Analysis (Scams 4-5)                             

def analyze_expense_quality(data: dict) -> List[WarningSignal]:
    """Analyze expense/asset quality for Scams 4-5."""
    signals = []

    revenue = data.get("revenue", 0)
    cogs = data.get("cogs", 0)
    inventory = data.get("inventory", 0)
    prev_inventory = data.get("prev_inventory", 0)
    prev_cogs = data.get("prev_cogs", 0)
    capex = data.get("capex", 0)
    prev_capex = data.get("prev_capex", 0)
    depreciation = data.get("depreciation", 0)
    gross_ppe = data.get("gross_ppe", 0)
    bad_debt_allowance = data.get("bad_debt_allowance", 0)
    prev_bad_debt_allowance = data.get("prev_bad_debt_allowance", 0)
    gross_ar = data.get("gross_ar", 0)
    prev_gross_ar = data.get("prev_gross_ar", 0)
    days = data.get("days_in_period", 365)

    # DSI (Days Sales Inventory) - Scam 4
    if cogs > 0 and inventory > 0:
        dsi = (inventory / cogs) * days
        if prev_cogs > 0 and prev_inventory > 0:
            prev_dsi = (prev_inventory / prev_cogs) * days
            dsi_change = dsi - prev_dsi
            if dsi_change > 15:
                signals.append(WarningSignal(
                    4, "Shifting Current Expenses to Later Period",
                    f"DSI increased by {dsi_change:.1f} days ({prev_dsi:.1f} -> {dsi:.1f})",
                    "MEDIUM",
                    "Inventory buildup without corresponding sales growth suggests slow-moving/obsolete stock not written down"
                ))

    # Inventory growth vs COGS growth - Scam 4
    if prev_cogs > 0 and prev_inventory > 0:
        inv_growth = (inventory - prev_inventory) / prev_inventory * 100
        cogs_growth = (cogs - prev_cogs) / prev_cogs * 100
        if inv_growth > cogs_growth + 15:
            signals.append(WarningSignal(
                4, "Shifting Current Expenses to Later Period",
                f"Inventory growth ({inv_growth:.1f}%) far exceeds COGS growth ({cogs_growth:.1f}%)",
                "MEDIUM",
                "Excess inventory growth may indicate failure to write down obsolete stock"
            ))

    # CapEx surge - Scam 4 (improper capitalization)
    if prev_capex > 0 and capex > 0:
        capex_change = (capex - prev_capex) / prev_capex * 100
        if capex_change > 30 and revenue > 0:
            rev_growth = 0
            prev_rev = data.get("prev_revenue", 0)
            if prev_rev > 0:
                rev_growth = (revenue - prev_rev) / prev_rev * 100
            if capex_change > rev_growth + 25:
                signals.append(WarningSignal(
                    4, "Shifting Current Expenses to Later Period",
                    f"CapEx surged {capex_change:.1f}% while revenue grew only {rev_growth:.1f}%",
                    "HIGH",
                    "Unexplained CapEx increase may indicate improper capitalization of operating expenses (WorldCom-style)"
                ))

    # Bad debt reserve decline - Scam 4 (under-reserving)
    if gross_ar > 0 and prev_gross_ar > 0 and bad_debt_allowance is not None and prev_bad_debt_allowance is not None:
        reserve_ratio = bad_debt_allowance / gross_ar * 100 if gross_ar > 0 else 0
        prev_reserve_ratio = prev_bad_debt_allowance / prev_gross_ar * 100 if prev_gross_ar > 0 else 0
        if reserve_ratio < prev_reserve_ratio - 2:
            signals.append(WarningSignal(
                4, "Shifting Current Expenses to Later Period",
                f"Bad debt allowance ratio declined: {prev_reserve_ratio:.1f}% -> {reserve_ratio:.1f}% of AR",
                "HIGH",
                "Shrinking bad debt allowance while AR grows suggests under-reserving to boost earnings"
            ))

    # Depreciation expense / Gross PPE ratio - Scam 4 (too-slow depreciation)
    if gross_ppe > 0 and depreciation > 0:
        depre_rate = depreciation / gross_ppe * 100
        if depre_rate < 3:
            signals.append(WarningSignal(
                4, "Shifting Current Expenses to Later Period",
                f"Depreciation rate is very low ({depre_rate:.1f}% of gross PPE)",
                "LOW",
                "Very low depreciation rate may indicate overly long useful life assumptions"
            ))

    return signals


#    Cash Flow Quality Analysis (Scams 8-11)                                 

def analyze_cashflow_quality(data: dict) -> List[WarningSignal]:
    """Analyze cash flow quality for Scams 8-11."""
    signals = []

    cffo = data.get("cffo", 0)
    prev_cffo = data.get("prev_cffo", 0)
    net_income = data.get("net_income", 0)
    prev_ni = data.get("prev_net_income", 0)
    capex = data.get("capex", 0)
    acquisition_outflows = data.get("acquisition_outflows", 0)
    sale_of_receivables = data.get("sale_of_receivables", 0)
    stock_compensation = data.get("stock_compensation", 0)
    ar_change = data.get("ar_change", 0)
    ap_change = data.get("ap_change", 0)
    inventory_change = data.get("inventory_change", 0)

    # Free cash flow - Scam 8-11
    fcf = cffo - capex
    prev_fcf = prev_cffo - data.get("prev_capex", 0) if "prev_capex" in data else None

    if prev_fcf is not None and prev_fcf != 0:
        fcf_change = (fcf - prev_fcf) / abs(prev_fcf) * 100
        if fcf_change < -50:
            signals.append(WarningSignal(
                8, "Cash Flow Manipulation",
                f"Free cash flow declined {fcf_change:.0f}% (from {prev_fcf:.0f} to {fcf:.0f})",
                "CRITICAL",
                "FCF deterioration while reporting earnings growth is a major red flag (WorldCom/Enron signal)"
            ))

    # CFFO vs Net Income - Scam 8-9 cross-check
    if net_income > 0 and cffo > 0:
        ratio = cffo / net_income
        if ratio < 0.6:
            signals.append(WarningSignal(
                8, "Cash Flow Manipulation",
                f"CFFO/Net Income ratio is only {ratio:.2f}",
                "HIGH",
                "Consistently low cash conversion indicates potential earnings quality issues"
            ))
    elif net_income > 0 and cffo <= 0:
        signals.append(WarningSignal(
            8, "Cash Flow Manipulation",
            f"Positive net income ({net_income:.0f}) but negative/zero operating cash flow ({cffo:.0f})",
            "CRITICAL",
            "This is one of the strongest fraud signals - earnings are completely decoupled from cash"
        ))

    # CFFO growth vs Net Income growth - Scam 8-9
    if prev_cffo > 0 and prev_ni > 0:
        cffo_growth = (cffo - prev_cffo) / prev_cffo * 100
        ni_growth = (net_income - prev_ni) / prev_ni * 100
        if cffo_growth > ni_growth + 30:
            signals.append(WarningSignal(
                8, "Cash Flow Manipulation",
                f"CFFO growth ({cffo_growth:.1f}%) far exceeds NI growth ({ni_growth:.1f}%)",
                "MEDIUM",
                "Operating cash flow growing much faster than earnings may indicate cash flow manipulation"
            ))

    # Sale of receivables - Scam 10
    if sale_of_receivables and sale_of_receivables > 0:
        if cffo > 0 and (sale_of_receivables / cffo) > 0.2:
            signals.append(WarningSignal(
                10, "Boosting CFFO via Acquisitions/Disposals",
                f"Sale of receivables = {sale_of_receivables:.0f} ({sale_of_receivables/cffo*100:.1f}% of CFFO)",
                "HIGH",
                "Heavy reliance on selling receivables to generate operating cash flow is unsustainable"
            ))

    # Working capital driven CFFO
    working_cap_total = (ar_change or 0) + (inventory_change or 0) - (ap_change or 0)
    if cffo > 0 and abs(working_cap_total) > 0:
        wc_contribution = (-working_cap_total) / cffo * 100
        if wc_contribution > 50:
            signals.append(WarningSignal(
                8, "Cash Flow Manipulation",
                f"Working capital changes contributed {wc_contribution:.0f}% of CFFO",
                "MEDIUM",
                "Operating cash flow heavily dependent on working capital changes (paying late, collecting fast) - not sustainable"
            ))

    # Acquisition-adjusted FCF - Scam 10
    if acquisition_outflows > 0:
        adj_fcf = fcf - acquisition_outflows
        if fcf > 0 and adj_fcf < 0:
            signals.append(WarningSignal(
                10, "Boosting CFFO via Acquisitions/Disposals",
                f"FCF is positive ({fcf:.0f}) but turns negative ({adj_fcf:.0f}) after subtracting acquisition spending",
                "MEDIUM",
                "Company relies on acquisitions to maintain cash flow appearance (Tyco-style pattern)"
            ))

    # Stock-based compensation as large % of CFFO - Scam 8
    if cffo > 0 and stock_compensation > 0:
        sbc_ratio = stock_compensation / cffo * 100
        if sbc_ratio > 30:
            signals.append(WarningSignal(
                8, "Cash Flow Manipulation",
                f"Stock-based compensation = {sbc_ratio:.0f}% of CFFO",
                "LOW",
                "High SBC relative to operating cash flow inflates CFFO (SBC is non-cash but real cost)"
            ))

    return signals


#    Output helpers                                                           

def print_signals(signals: List[WarningSignal], category: str):
    print(f"\n{'='*70}")
    print(f"  {category}")
    print(f"{'='*70}")

    if not signals:
        print("  [OK] No significant warning signals detected.")
        return

    severity_counts = {}
    for s in signals:
        severity_counts[s.severity] = severity_counts.get(s.severity, 0) + 1

    print(f"  Detected {len(signals)} signals: ", end="")
    print(", ".join(f"{k}={v}" for k, v in sorted(severity_counts.items())))
    print()

    for i, sig in enumerate(signals, 1):
        severity_tag = {
            "LOW": "",
            "MEDIUM": "",
            "HIGH": "",
            "CRITICAL": "",
        }.get(sig.severity, "")

        print(f"  [{i}] [{sig.severity}] {sig.signal}")
        print(f"      Scam {sig.scam_id}: {sig.technique}")
        if sig.detail:
            detail_clean = sig.detail.replace('\u2192', '->')
            print(f"      -> {detail_clean}")
        print()


def load_data(file_path: Optional[str]) -> dict:
    """Load financial data from JSON file or interactive input."""
    if file_path:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    # Interactive input mode
    print("Manual data input mode.")
    print("Enter financial data as key=value pairs (one per line).")
    print("Keys: revenue, prev_revenue, accounts_receivable, prev_ar, cogs,")
    print("      inventory, prev_inventory, cffo, net_income, capex, etc.")
    print("Type 'done' when finished, or 'json' to paste JSON:")
    print()

    data = {}
    while True:
        line = input("> ").strip()
        if line.lower() == 'done':
            break
        if line.lower() == 'json':
            print("Paste JSON and press Ctrl+Z then Enter:")
            json_str = sys.stdin.read()
            try:
                data = json.loads(json_str)
            except json.JSONDecodeError as e:
                print(f"Invalid JSON: {e}")
            break
        if '=' in line:
            key, val = line.split('=', 1)
            try:
                data[key.strip()] = float(val.strip())
            except ValueError:
                data[key.strip()] = val.strip()

    return data


def main():
    parser = argparse.ArgumentParser(
        description="Financial Fraud Detection - Ratio Analyzer",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python ratio_analyzer.py --revenue --input data.json
  python ratio_analyzer.py --expense
  python ratio_analyzer.py --cashflow --input sample.json
  python ratio_analyzer.py --all
        """
    )
    parser.add_argument('--input', '-i', help='JSON file with financial data')
    parser.add_argument('--revenue', action='store_true', help='Revenue quality analysis (Scams 1-3)')
    parser.add_argument('--expense', action='store_true', help='Expense/asset quality analysis (Scams 4-5)')
    parser.add_argument('--cashflow', action='store_true', help='Cash flow quality analysis (Scams 8-11)')
    parser.add_argument('--all', action='store_true', help='Full analysis (all categories)')
    args = parser.parse_args()

    # Default to --all if nothing specified
    if not any([args.revenue, args.expense, args.cashflow, args.all]):
        args.all = True

    data = load_data(args.input)

    signals = []

    if args.all or args.revenue:
        rev_signals = analyze_revenue_quality(data)
        print_signals(rev_signals, "REVENUE QUALITY ANALYSIS (Scams 1-3)")
        signals.extend(rev_signals)

    if args.all or args.expense:
        exp_signals = analyze_expense_quality(data)
        print_signals(exp_signals, "EXPENSE & ASSET QUALITY ANALYSIS (Scams 4-5)")
        signals.extend(exp_signals)

    if args.all or args.cashflow:
        cf_signals = analyze_cashflow_quality(data)
        print_signals(cf_signals, "CASH FLOW QUALITY ANALYSIS (Scams 8-11)")
        signals.extend(cf_signals)

    # Summary
    if signals:
        print(f"{'='*70}")
        print(f"  TOTAL: {len(signals)} warning signals detected")
        critical = sum(1 for s in signals if s.severity == "CRITICAL")
        high = sum(1 for s in signals if s.severity == "HIGH")
        medium = sum(1 for s in signals if s.severity == "MEDIUM")
        low = sum(1 for s in signals if s.severity == "LOW")

        if critical:
            print(f"  CRITICAL: {critical}")
        if high:
            print(f"  HIGH: {high}")
        if medium:
            print(f"  MEDIUM: {medium}")
        if low:
            print(f"  LOW: {low}")
    else:
        print(f"\n{'='*70}")
        print("  No warning signals detected in the analyzed categories.")


if __name__ == "__main__":
    main()
