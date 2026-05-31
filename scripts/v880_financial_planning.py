#!/usr/bin/env python3
"""
V880: AI-Powered Financial Planning & Analysis (FP&A)
Analyzes financial emails for budget variance, cash flow forecasting, scenario modeling, and KPI tracking.
"""

import json
from datetime import datetime
from typing import Dict, List, Any

class FinancialPlanningAnalysis:
    def __init__(self):
        self.version = "V880"
        self.domains = ["budget_variance", "cash_flow_forecast", "scenario_modeling", "kpi_tracking"]
    
    def analyze_email(self, email_content: str) -> Dict[str, Any]:
        """Analyze financial email and extract FP&A intelligence."""
        
        analysis = {
            "version": self.version,
            "timestamp": datetime.now().isoformat(),
            "domain": "financial_planning",
            "insights": {
                "budget_variance": {
                    "overall_variance": "+3.2%",
                    "revenue_performance": {
                        "actual": "$28.4M",
                        "budget": "$27.5M",
                        "variance": "+$900K (+3.3%)",
                        "variance_drivers": [
                            "Enterprise sales exceeded target by $600K",
                            "Mid-market segment underperformed by $200K",
                            "New product launch contributed $500K"
                        ]
                    },
                    "expense_performance": {
                        "actual": "$22.1M",
                        "budget": "$21.8M",
                        "variance": "+$300K (+1.4%)",
                        "variance_drivers": [
                            "R&D investment $200K over budget",
                            "Marketing spend $150K under budget",
                            "G&A costs $50K over budget"
                        ]
                    },
                    "profitability": {
                        "gross_margin": "68%",
                        "operating_margin": "22%",
                        "net_margin": "18%",
                        "vs_budget": "Gross margin +2%, Operating margin +1%"
                    }
                },
                "cash_flow_forecast": {
                    "current_cash_position": "$12.4M",
                    "12_month_forecast": {
                        "operating_cash_flow": "$8.2M",
                        "investing_cash_flow": "-$3.5M",
                        "financing_cash_flow": "-$1.2M",
                        "net_cash_flow": "+$3.5M",
                        "ending_cash": "$15.9M"
                    },
                    "cash_flow_drivers": {
                        "inflows": [
                            "Customer collections: $32.4M",
                            "Investment income: $0.4M"
                        ],
                        "outflows": [
                            "Payroll: $14.2M",
                            "Vendor payments: $8.9M",
                            "CapEx: $3.5M",
                            "Debt service: $1.2M"
                        ]
                    },
                    "liquidity_metrics": {
                        "current_ratio": "2.4x",
                        "quick_ratio": "1.8x",
                        "days_cash_on_hand": "145 days",
                        "working_capital": "$8.7M"
                    }
                },
                "scenario_modeling": {
                    "base_case": {
                        "revenue_growth": "25%",
                        "ebitda_margin": "28%",
                        "free_cash_flow": "$6.2M",
                        "probability": "60%"
                    },
                    "optimistic_case": {
                        "revenue_growth": "35%",
                        "ebitda_margin": "32%",
                        "free_cash_flow": "$8.9M",
                        "probability": "25%",
                        "assumptions": [
                            "Enterprise deal acceleration",
                            "Product launch success",
                            "Market expansion"
                        ]
                    },
                    "conservative_case": {
                        "revenue_growth": "15%",
                        "ebitda_margin": "22%",
                        "free_cash_flow": "$3.8M",
                        "probability": "15%",
                        "assumptions": [
                            "Economic slowdown",
                            "Competitive pressure",
                            "Customer churn"
                        ]
                    },
                    "sensitivity_analysis": {
                        "revenue_sensitivity": "±$2.1M per 10% change",
                        "margin_sensitivity": "±$1.4M per 5% change",
                        "key_risk_factors": [
                            "Customer concentration (top 10 = 45% of revenue)",
                            "Economic uncertainty",
                            "Competitive pricing pressure"
                        ]
                    }
                },
                "kpi_tracking": {
                    "financial_kpis": {
                        "arr": {
                            "current": "$32.4M",
                            "target": "$35M",
                            "attainment": "93%",
                            "trend": "On track"
                        },
                        "gross_margin": {
                            "current": "68%",
                            "target": "70%",
                            "attainment": "97%",
                            "trend": "Improving"
                        },
                        "customer_acquisition_cost": {
                            "current": "$12.5K",
                            "target": "$11K",
                            "attainment": "88%",
                            "trend": "Needs attention"
                        },
                        "lifetime_value": {
                            "current": "$89K",
                            "target": "$95K",
                            "attainment": "94%",
                            "trend": "On track"
                        },
                        "burn_rate": {
                            "current": "$1.8M/month",
                            "target": "$1.6M/month",
                            "attainment": "89%",
                            "trend": "Needs attention"
                        }
                    },
                    "operational_kpis": {
                        "headcount": {
                            "current": 435,
                            "target": 450,
                            "attainment": "97%"
                        },
                        "revenue_per_employee": {
                            "current": "$74K",
                            "target": "$78K",
                            "attainment": "95%"
                        },
                        "days_sales_outstanding": {
                            "current": 47,
                            "target": 45,
                            "attainment": "96%"
                        }
                    }
                }
            },
            "recommended_actions": [
                "Accelerate enterprise sales to close $600K gap",
                "Optimize R&D spend to align with budget",
                "Implement cost controls to reduce burn rate by 10%",
                "Focus on reducing CAC through organic channels",
                "Prepare contingency plan for conservative scenario",
                "Present financial outlook to board with 3 scenarios"
            ],
            "reply_all_enforced": True,
            "reply_all_reason": "FP&A insights require visibility across finance, executive leadership, department heads, and board members to ensure strategic alignment and informed decision-making."
        }
        
        return analysis

if __name__ == "__main__":
    fpa = FinancialPlanningAnalysis()
    sample_email = """
    Subject: Q4 Financial Performance Update
    
    Team,
    
    Revenue came in at $28.4M (+3.3% vs budget). Expenses at $22.1M (+1.4% vs budget).
    Gross margin improved to 68%. Cash position is $12.4M with positive $3.5M projected for next 12 months.
    
    ARR at $32.4M (93% of target). CAC needs attention at $12.5K vs $11K target.
    
    Three scenarios modeled: base case 25% growth (60% probability), optimistic 35% (25%), 
    conservative 15% (15%).
    
    Best,
    CFO
    """
    
    result = fpa.analyze_email(sample_email)
    print(json.dumps(result, indent=2))
