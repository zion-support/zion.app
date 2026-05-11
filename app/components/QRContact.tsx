"use client";

import QRCode from "qrcode.react";

export default function QRContact() {
  const contactUrl = typeof window !== "undefined" ? window.location.origin + "/contact" : "https://ziontechgroup.com/contact";
  return (
    <div className="flex flex-col items-center space-y-2 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
      <h3 className="text-lg font-semibold text-white">Scan to Contact Us</h3>
      <QRCode value={contactUrl} size={128} bgColor="#0f172a" fgColor="#a78bfa" />
      <p className="text-xs text-gray-400 text-center">Point your camera at the QR code to open the contact page.</p>
    </div>
  );
}
