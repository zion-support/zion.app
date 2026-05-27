#!/usr/bin/env python3
"""
V31-P4: Billing Attachment Router
Invoice/payment attachment → inject payment link into reply body.
"""
import json, os
from pathlib import Path

_WORKSPACE = Path(__file__).resolve().parent.parent.parent
DATA = _WORKSPACE / 'data'

def route_invoice_reply(
    filename: str,
    invoice_id: str = "",
    amount: str = "",
    due_date: str = "",
    payment_url: str = "",
    lang: str = "en",
) -> dict:
    """Build routing decision for an invoice/payment attachment."""
    payment_url = payment_url or os.getenv("PAYMENT_BASE_URL", "https://pay.ziontechgroup.com/invoice/")
    full_url = f"{payment_url.rstrip('/')}/{invoice_id}" if invoice_id else payment_url

    if lang == "pt":
        injection = (
            f"📎 Anexo: {filename}\nValor: {amount or 'N/A'}\n"
            f"Vencimento: {due_date or 'N/A'}\nPagamento: {full_url}"
        )
    else:
        injection = (
            f"📎 Attachment: {filename}\nAmount: {amount or 'N/A'}\n"
            f"Due: {due_date or 'N/A'}\nPay online: {full_url}"
        )

    return {
        "routing_action": "invoice_thank",
        "category": "invoice",
        "invoice_id": invoice_id,
        "amount": amount,
        "due_date": due_date,
        "payment_url": full_url,
        "injection_text": injection,
        "confidence": 0.90,
    }

def inject_payment_link(reply_body: str, invoice_result: dict) -> str:
    """Append payment injection to reply body if not already present."""
    injection = invoice_result.get("injection_text", "")
    if injection and injection not in reply_body:
        return reply_body.rstrip() + "\n\n" + injection
    return reply_body

def classify_billing_attachment(filename: str, content_preview: str = "") -> dict:
    """Classify attachment as invoice/payment_request/other."""
    name_lower = filename.lower()
    invoice_kw   = ["invoice", "inv-", "receipt", "payment_request", "boleto", "remittance"]
    payment_kw   = ["payment", "wire_transfer", "ach", "bank_transfer"]

    if any(k in name_lower for k in invoice_kw):
        return {"category": "invoice", "confidence": 0.92, "routing_action": "invoice_thank"}
    if any(k in name_lower for k in payment_kw):
        return {"category": "payment", "confidence": 0.85, "routing_action": "acknowledge"}

    preview_lower = (content_preview or "").lower()
    if "amount due" in preview_lower or "payment terms" in preview_lower:
        return {"category": "invoice", "confidence": 0.80, "routing_action": "invoice_thank"}

    return {"category": "other", "confidence": 0.40, "routing_action": "acknowledge"}
