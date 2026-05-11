#!/usr/bin/env python3
"""
Zion Tech Group – Machine Learning Pipeline for Conversion Prediction
Trains a model on historical lead data and exports inference API.
"""

import json
import os
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Tuple
import joblib
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

# Paths
WORKDIR = Path(os.environ.get("ZION_ROOT", str(Path(__file__).resolve().parent.parent)))
DATA_CSV = WORKDIR / "leads.csv"  # Historical lead data
MODEL_PATH = WORKDIR / "models" / "conversion_model.pkl"
LOG_MD = WORKDIR / "Zion_Brain_Log.md"

# Ensure directories exist
MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

def md_log(msg: str) -> None:
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    LOG_MD.parent.mkdir(parents=True, exist_ok=True)
    with LOG_MD.open("a", encoding="utf-8") as f:
        f.write(f"- [{ts}] {msg}\n")

def load_data(csv_path: Path) -> pd.DataFrame:
    """Load historical lead data."""
    if not csv_path.exists():
        raise FileNotFoundError(f"Lead data not found at {csv_path}")
    df = pd.read_csv(csv_path)
    md_log(f"Loaded {len(df)} lead records from {csv_path.name}")
    return df

def preprocess(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    """Prepare features and target."""
    # Assume columns: 'time_on_site', 'pages_visited', 'email_opened', 'clicked_cta', 'converted'
    feature_cols = ['time_on_site', 'pages_visited', 'email_opened', 'clicked_cta']
    X = df[feature_cols].fillna(0)
    y = df['converted'].astype(int)
    md_log(f"Preprocessed data: {X.shape[0]} samples, {X.shape[1]} features")
    return X, y

def train_model(X_train: pd.DataFrame, y_train: pd.Series) -> GradientBoostingClassifier:
    """Train a Gradient Boosting classifier."""
    model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
    model.fit(X_train, y_train)
    md_log("GradientBoosting model trained.")
    return model

def evaluate(model: GradientBoostingClassifier, X_test: pd.DataFrame, y_test: pd.Series) -> Dict[str, Any]:
    """Evaluate model performance."""
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)
    md_log(f"Model accuracy: {acc:.3f}")
    return {"accuracy": acc, "report": report}

def save_model(model: GradientBoostingClassifier, path: Path) -> None:
    """Save model to disk."""
    joblib.dump(model, path)
    md_log(f"Model saved to {path}")

def load_model(path: Path) -> GradientBoostingClassifier:
    """Load model from disk."""
    if not path.exists():
        raise FileNotFoundError(f"Model file missing: {path}")
    model = joblib.load(path)
    md_log(f"Model loaded from {path}")
    return model

def predict(model: GradientBoostingClassifier, lead_data: Dict[str, float]) -> Dict[str, Any]:
    """Predict conversion probability for a single lead."""
    feature_order = ['time_on_site', 'pages_visited', 'email_opened', 'clicked_cta']
    X = np.array([[lead_data.get(f, 0) for f in feature_order]])
    proba = model.predict_proba(X)[0, 1]
    prediction = int(proba >= 0.5)
    return {"probability": float(proba), "prediction": prediction}

def run_training() -> None:
    """Full training pipeline."""
    md_log("=== ML Pipeline: Starting training run ===")
    df = load_data(DATA_CSV)
    X, y = preprocess(df)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    model = train_model(X_train, y_train)
    metrics = evaluate(model, X_test, y_test)
    save_model(model, MODEL_PATH)
    md_log("=== ML Pipeline: Training completed ===")
    # Also log metrics summary
    md_log(f"Test accuracy: {metrics['accuracy']:.3f}")

def run_inference_api() -> None:
    """Simple HTTP inference server (for demonstration)."""
    from http.server import BaseHTTPRequestHandler, HTTPServer
    import urllib.parse as urlparse

    model = load_model(MODEL_PATH)

    class Handler(BaseHTTPRequestHandler):
        def do_POST(self):
            if self.path != '/predict-conversion':
                self.send_error(404, "Not found")
                return
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            try:
                data = json.loads(body.decode('utf-8'))
                result = predict(model, data)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode('utf-8'))
                md_log(f"Inference request: {data} -> {result}")
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
                md_log(f"Inference error: {e}")

        def log_message(self, format, *args):
            # Suppress HTTP server logs
            pass

    server_address = ('', 8000)
    httpd = HTTPServer(server_address, Handler)
    md_log("Inference API listening on http://0.0.0.0:8000/predict-conversion")
    httpd.serve_forever()

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--train", action="store_true", help="Train the model")
    parser.add_argument("--serve", action="store_true", help="Start inference API server")
    parser.add_argument("--test", action="store_true", help="Run a quick test prediction")
    args = parser.parse_args()

    if args.train:
        run_training()
    elif args.serve:
        run_inference_api()
    elif args.test:
        # Quick sanity check
        if MODEL_PATH.exists():
            model = load_model(MODEL_PATH)
            sample = {"time_on_site": 120, "pages_visited": 5, "email_opened": 1, "clicked_cta": 1}
            result = predict(model, sample)
            md_log(f"Test prediction: {sample} -> {result}")
            print(json.dumps(result, indent=2))
        else:
            print("Model not found. Train first with --train")
    else:
        parser.print_help()
