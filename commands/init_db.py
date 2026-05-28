#!/usr/bin/env python3
"""
Database Initialization for Zion Tech Group

Creates required tables if they don't exist.
"""

import os
import sys
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
import psycopg2

# Load .env from current directory
WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
load_dotenv(WORKDIR / ".env")

LOG_MD = WORKDIR / "Zion_Brain_Log.md"

def log(msg: str) -> None:
    """Append timestamped log entry to Zion_Brain_Log.md"""
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] DB Init: {msg}\n")

def get_db_conn():
    """Connect to PostgreSQL database."""
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")
    db = os.getenv("POSTGRES_DB", "zion")
    user = os.getenv("POSTGRES_USER", "zion_user")
    password = os.getenv("POSTGRES_PASSWORD", "zion_secret")
    try:
        conn = psycopg2.connect(
            host=host, port=port, database=db, user=user, password=password
        )
        log(f"Connected to DB at {host}:{port}/{db}")
        return conn
    except Exception as e:
        log(f"Failed to connect to DB: {e}")
        raise

def create_tables() -> None:
    """Create all required tables."""
    sql = """
CREATE TABLE IF NOT EXISTS leads (
    lead_id SERIAL PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_sequences (
    sequence_id SERIAL PRIMARY KEY,
    lead_id INT NOT NULL,
    stage VARCHAR(50) NOT NULL,
    sent_at TIMESTAMP NOT NULL,
    metadata JSONB,
    FOREIGN KEY (lead_id) REFERENCES leads(lead_id)
);

CREATE TABLE IF NOT EXISTS pricing_history (
    record_id SERIAL PRIMARY KEY,
    competitor VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    scraped_at TIMESTAMP NOT NULL DEFAULT NOW(),
    source_url TEXT
);

CREATE TABLE IF NOT EXISTS dashboard_metrics (
    metric_id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value JSONB NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT NOW()
);
"""
    conn = get_db_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
            conn.commit()
            log("Tables created or already exist.")
            cur.execute(
                "SELECT tablename FROM pg_tables WHERE schemaname='public';"
            )
            tables = [row[0] for row in cur.fetchall()]
            log(f"Current tables: {', '.join(tables)}")
    finally:
        conn.close()
        log("Database connection closed.")

if __name__ == "__main__":
    log("=== DB Init started ===")
    try:
        create_tables()
        log("=== DB Init completed successfully ===")
    except Exception as e:
        log(f"=== DB Init failed: {e} ===")
        sys.exit(1)