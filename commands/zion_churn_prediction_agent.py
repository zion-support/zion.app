#!/usr/bin/env python3
"""
Zion Tech Group – Predictive Churn Modeling

* Trains a RandomForestClassifier on historic usage & engagement data.
* Scores every active customer; flags those with churn probability > 0.7.
* Writes `churn_predictions.json`.
* Sends a Slack alert with the top‑5 at‑risk customers.
* Logs to Zion_Brain_Log.md.
"""

import os, json, time
from datetime import datetime
from pathlib import Path
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import psycopg2
import requests

WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
LOG_MD  = WORKDIR / "Zion_Brain_Log.md"
OUT_JSON = WORKDIR / "churn_predictions.json"
SLACK_WEBHOOK = os.getenv("SLACK_WEBHOOK_URL")   # set in .env

def logger(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] ChurnPredict: {msg}\n")

def db_conn():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST","localhost"),
        dbname=os.getenv("POSTGRES_DB","zion"),
        user=os.getenv("POSTGRES_USER","zion_user"),
        password=os.getenv("POSTGRES_PASSWORD","zion_secret")
    )

def load_data():
    conn = db_conn()
    df = pd.read_sql("""
        SELECT c.customer_id, c.last_login, c.total_sessions,
               c.avg_session_length, c.support_tickets,
               CASE WHEN c.last_login < NOW() - INTERVAL '30 days' THEN 1 ELSE 0 END AS churned
        FROM customers c
    """, conn)
    conn.close()
    return df

def train_model(df):
    X = df[["last_login","total_sessions","avg_session_length","support_tickets"]]
    # Convert timestamps to numeric days ago
    X["last_login"] = (datetime.utcnow() - pd.to_datetime(X["last_login"])).dt.days
    y = df["churned"]
    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X, y)
    logger("Churn model trained.")
    return model, X.columns

def predict(model, cols, df):
    X = df[cols].copy()
    X["last_login"] = (datetime.utcnow() - pd.to_datetime(X["last_login"])).dt.days
    probs = model.predict_proba(X)[:,1]   # probability of churn
    df["churn_prob"] = probs
    return df

def save_predictions(df):
    preds = df[["customer_id","churn_prob"]].to_dict(orient="records")
    OUT_JSON.write_text(json.dumps(preds, indent=2))
    logger(f"Churn predictions saved to {OUT_JSON}")

def slack_alert(df):
    if not SLACK_WEBHOOK:
        logger("Slack webhook not configured – skipping alert.")
        return
    top5 = df.nlargest(5, "churn_prob")
    text = "*🚨 Top 5 At-Risk Customers*\n"
    for _, row in top5.iterrows():
        text += f"- ID {row['customer_id']}: {row['churn_prob']:.0%} chance\n"
    payload = {"text": text}
    try:
        r = requests.post(SLACK_WEBHOOK, json=payload)
        r.raise_for_status()
        logger("Slack churn alert sent.")
    except Exception as e:
        logger(f"Slack alert failed: {e}")

def main():
    logger("=== Predictive Churn Modeling started ===")
    df = load_data()
    model, cols = train_model(df)
    scored = predict(model, cols, df)
    save_predictions(scored)
    slack_alert(scored)
    logger("=== Predictive Churn Modeling finished ===")

if __name__ == "__main__":
    main()