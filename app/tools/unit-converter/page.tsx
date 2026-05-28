"use client";
import { useState } from "react";
import Link from "next/link";

const units = {
  length: {
    meters: 1,
    kilometers: 0.001,
    miles: 0.000621371,
    feet: 3.28084,
  },
  weight: {
    grams: 1,
    kilograms: 0.001,
    pounds: 0.00220462,
    ounces: 0.035274,
  },
};

export default function UnitConverter() {

export const metadata = {
  title: "Unit Converter",
  description: "",
};


  const [type, setType] = useState("length");
  const [from, setFrom] = useState("meters");
  const [to, setTo] = useState("kilometers");
  const [value, setValue] = useState(0);
  const [result, setResult] = useState(0);

  const convert = () => {
    const factorFrom = units[type as keyof typeof units][from as keyof typeof units[typeof type]];
    const factorTo = units[type as keyof typeof units][to as keyof typeof units[typeof type]];
    const val = (value * factorFrom) / factorTo;
    setResult(val);
  };

  const unitOptions = Object.keys(units[type as keyof typeof units]);

  return (
    <main className="mx-auto max-w-3xl p-8">
      
      <h1 className="text-3xl font-bold mb-4">Unit Converter</h1>
      <div className="mb-4">
        <label className="mr-2">Category:</label>
        <select value={type} onChange={e=>{setType(e.target.value); setFrom(Object.keys(units[e.target.value as any])[0]); setTo(Object.keys(units[e.target.value as any])[1]);}} className="border rounded p-1">
          {Object.keys(units).map(k=> <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <input type="number" value={value} onChange={e=>setValue(parseFloat(e.target.value)||0)} className="border rounded p-1 mr-2" />
        <select value={from} onChange={e=>setFrom(e.target.value)} className="border rounded p-1 mr-2">
          {unitOptions.map(u=> <option key={u} value={u}>{u}</option>)}
        </select>
        <span className="mx-2">→</span>
        <select value={to} onChange={e=>setTo(e.target.value)} className="border rounded p-1 mr-2">
          {unitOptions.map(u=> <option key={u} value={u}>{u}</option>)}
        </select>
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded">Convert</button>
      </div>
      <div className="mt-2">
        <strong>Result:</strong> {result.toFixed(5)} 
      </div>
    </main>
    );
  }