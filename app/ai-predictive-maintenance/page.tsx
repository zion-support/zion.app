"use client";

/**
 * Predictive Maintenance AI Service
 * ---------------------------------
 * Placeholder page that will later host ARIMA‑based equipment health
 * forecasting. It currently displays a demo UI where users can upload a
 * CSV of sensor readings and receive a mock prediction.
 */

import { useState } from "react";

export default function PredictiveMaintenance() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const runPrediction = async () => {
    if (!file) return;
    // Placeholder: simulate a backend call
    setResult("⏳ Computing forecast…");
    setTimeout(() => {
      setResult("✅ Forecast: equipment health stable for next 30 days.");
    }, 2000);
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Predictive Maintenance</h1>
      <p className="mb-4">
        Upload a CSV containing time‑series sensor data. The AI will forecast
        equipment health using ARIMA models (to be implemented).
      </p>
      <input type="file" accept=".csv" onChange={handleUpload} className="mb-4" />
      <button
        onClick={runPrediction}
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={!file}
      >
        Run Forecast
      </button>
      {result && <p className="mt-4 text-lg">{result}</p>}
    </main>
  );
}
