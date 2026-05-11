"use client";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function PasswordStrengthChecker() {
  const [pwd, setPwd] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const evaluate = (p: string) => {
    let s = 0;
    const length = p.length;
    if (length >= 8) s += 1; else if (length >= 6) s += 0.5;
    if (/[A-Z]/.test(p)) s += 1;
    if (/[a-z]/.test(p)) s += 1;
    if (/[0-9]/.test(p)) s += 1;
    if (/[^A-Za-z0-9]/.test(p)) s += 1;
    setScore(s);
    if (s < 3) setFeedback('Weak');
    else if (s < 5) setFeedback('Moderate');
    else setFeedback('Strong');
  };

  const handleChange = (e:string) => {
    const v = e;
    setPwd(v);
    evaluate(v);
  };

  const bg = (c:number)=>{
    if(c<3) return 'bg-red-200';
    if(c<5) return 'bg-yellow-200';
    return 'bg-green-200';
  };

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Head><title>Password Strength Checker</title></Head>
      <h1 className="text-3xl font-bold mb-4">Password Strength Checker</h1>
      <input type="password" value={pwd} onChange={e=>handleChange(e.target.value)} className="w-full p-2 border rounded" placeholder="Enter password" />
      <div className="mt-4 p-2 rounded" className={bg(score)}>
        <strong>Score:</strong> {score}/5 - {feedback}
      </div>
      <div className="mt-8 text-center">
        <Link href="/free-tools-hub" className="text-sm text-red-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}
