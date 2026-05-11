'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, Shield, AlertCircle, Calendar, Key, User, Building2, Fingerprint } from 'lucide-react';

interface CertField {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function parsePemDate(str: string): string {
  // ASN.1 date formats: YYMMDDHHmmssZ or YYYYMMDDHHmmssZ
  const cleaned = str.replace(/[^0-9]/g, '');
  if (cleaned.length < 12) return str;
  try {
    const isFullYear = cleaned.length >= 14;
    const year = isFullYear
      ? parseInt(cleaned.substring(0, 4), 10)
      : 2000 + parseInt(cleaned.substring(0, 2), 10);
    const month = parseInt(cleaned.substring(isFullYear ? 4 : 2, isFullYear ? 6 : 4), 10) - 1;
    const day = parseInt(cleaned.substring(isFullYear ? 6 : 4, isFullYear ? 8 : 6), 10);
    const hour = parseInt(cleaned.substring(isFullYear ? 8 : 6, isFullYear ? 10 : 8), 10);
    const min = parseInt(cleaned.substring(isFullYear ? 10 : 8, isFullYear ? 12 : 10), 10);
    const sec = parseInt(cleaned.substring(isFullYear ? 12 : 10, isFullYear ? 14 : 12), 10);
    const d = new Date(Date.UTC(year, month, day, hour, min, sec));
    return d.toUTCString();
  } catch {
    return str;
  }
}

function extractField(block: string, label: string): string | null {
  // Try OID-based patterns first, then label-based
  const patterns: Record<string, RegExp> = {
    'Common Name': /(?:commonName|CN)\s*=\s*([^,\n/]+)/i,
    'Organization': /(?:organizationName|O)\s*=\s*([^,\n/]+)/i,
    'Organizational Unit': /(?:organizationalUnitName|OU)\s*=\s*([^,\n/]+)/i,
    'Country': /(?:countryName|C)\s*=\s*([^,\n/]+)/i,
    'State': /(?:stateOrProvinceName|ST)\s*=\s*([^,\n/]+)/i,
    'Locality': /(?:localityName|L)\s*=\s*([^,\n/]+)/i,
    'Email': /(?:emailAddress|E)\s*=\s*([^,\n/]+)/i,
  };
  const p = patterns[label];
  if (!p) return null;
  const m = block.match(p);
  return m ? m[1].trim() : null;
}

function decodeDerLength(bytes: Uint8Array, offset: number): { length: number; bytesRead: number } {
  if (offset >= bytes.length) return { length: 0, bytesRead: 0 };
  const first = bytes[offset];
  if (first < 0x80) return { length: first, bytesRead: 1 };
  const numOctets = first & 0x7f;
  let length = 0;
  for (let i = 0; i < numOctets; i++) {
    length = (length << 8) | bytes[offset + 1 + i];
  }
  return { length, bytesRead: 1 + numOctets };
}

function decodeAsn1String(bytes: Uint8Array, offset: number, length: number): string {
  const slice = bytes.slice(offset, offset + length);
  // Try UTF-8 first
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(slice);
  } catch {
    return new TextDecoder('latin1').decode(slice);
  }
}

function getOidName(bytes: Uint8Array, offset: number, length: number): string {
  const parts: number[] = [];
  if (length === 0) return '';
  const first = bytes[offset];
  parts.push(Math.floor(first / 40));
  parts.push(first % 40);
  let value = 0;
  for (let i = 1; i < length; i++) {
    const b = bytes[offset + i];
    value = (value << 7) | (b & 0x7f);
    if ((b & 0x80) === 0) {
      parts.push(value);
      value = 0;
    }
  }
  const oid = parts.join('.');
  const oidMap: Record<string, string> = {
    '2.5.4.3': 'CN',
    '2.5.4.10': 'O',
    '2.5.4.11': 'OU',
    '2.5.4.6': 'C',
    '2.5.4.8': 'ST',
    '2.5.4.7': 'L',
    '1.2.840.113549.1.1.1': 'RSA Encryption',
    '1.2.840.113549.1.1.5': 'SHA-1 with RSA',
    '1.2.840.113549.1.1.11': 'SHA-256 with RSA',
    '1.2.840.113549.1.1.12': 'SHA-384 with RSA',
    '1.2.840.113549.1.1.13': 'SHA-512 with RSA',
    '1.2.840.10045.4.3.2': 'ECDSA with SHA-256',
    '1.2.840.10045.4.3.3': 'ECDSA with SHA-384',
    '1.2.840.10045.4.3.4': 'ECDSA with SHA-512',
    '1.2.840.10045.2.1': 'EC Public Key',
    '1.3.6.1.5.5.7.3.1': 'Server Authentication',
    '1.3.6.1.5.5.7.3.2': 'Client Authentication',
    '2.5.29.17': 'Subject Alternative Name',
    '2.5.29.14': 'Subject Key Identifier',
    '2.5.29.35': 'Authority Key Identifier',
    '2.5.29.19': 'Basic Constraints',
    '2.5.29.15': 'Key Usage',
    '2.16.840.1.113730.1.1': 'Netscape Cert Type',
  };
  return oidMap[oid] || oid;
}

function parseCertPem(pem: string): {
  subject: string;
  issuer: string;
  notBefore: string;
  notAfter: string;
  serialNumber: string;
  version: number;
  signatureAlgorithm: string;
  publicKeyAlgorithm: string;
  publicKeyBits: number;
  sans: string[];
  isCA: boolean;
  keyUsages: string[];
  fingerprints: { sha256: string; sha1: string };
  pemData: string;
} | null {
  const pemBlock = pem.match(/-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/);
  if (!pemBlock) return null;

  const b64 = pemBlock[1].replace(/\s/g, '');
  let derBytes: Uint8Array;
  try {
    const binaryStr = atob(b64);
    derBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      derBytes[i] = binaryStr.charCodeAt(i);
    }
  } catch {
    return null;
  }

  // Simple ASN.1 DER parser for certificate fields
  let subject = '';
  let issuer = '';
  let notBefore = '';
  let notAfter = '';
  let serialNumber = '';
  let version = 0;
  let signatureAlgorithm = 'Unknown';
  let publicKeyAlgorithm = 'Unknown';
  let publicKeyBits = 0;
  let sans: string[] = [];
  let isCA = false;
  let keyUsages: string[] = [];

  try {
    // Extract Subject and Issuer from PEM text (more reliable than full DER parsing)
    const pemUpper = pem.toUpperCase();

    // Extract fields from PEM string representation
    const subjectMatch = pem.match(/Subject:\s*(.*?)(?:\n|$)/i);
    const issuerMatch = pem.match(/Issuer:\s*(.*?)(?:\n|$)/i);
    const serialMatch = pem.match(/Serial Number:\s*([0-9a-f:]+(?:\s*\([0-9]+\))?)/i);
    const notBeforeMatch = pem.match(/Not Before:\s*(.*?)(?:\n|$)/i);
    const notAfterMatch = pem.match(/Not After\s*:?\s*(.*?)(?:\n|$)/i);
    const sigAlgMatch = pem.match(/Signature Algorithm:\s*(.*?)(?:\n|$)/i);
    const pubKeyMatch = pem.match(/Public Key Algorithm:\s*(.*?)(?:\n|$)/i);
    const pubKeyBitsMatch = pem.match(/Public-Key:\s*\((\d+)\s*bit\)/i);
    const versionMatch = pem.match(/Version:\s*(\d+)/i);
    const sanMatch = pem.match(/X509v3 Subject Alternative Name:\s*\n\s*(.*?)(?:\n|$)/i);
    const basicConstraintsMatch = pem.match(/X509v3 Basic Constraints:\s*\n\s*(.*?)(?:\n|$)/i);
    const keyUsageMatch = pem.match(/X509v3 Key Usage:\s*\n\s*(.*?)(?:\n|$)/i);

    // Try to extract subject/issuer from PEM text or from DER
    if (subjectMatch) {
      subject = subjectMatch[1].trim();
    } else {
      // Parse from DER - find the subject sequence
      const subjectStr = extractNameFromDer(derBytes, false);
      if (subjectStr) subject = subjectStr;
    }

    if (issuerMatch) {
      issuer = issuerMatch[1].trim();
    } else {
      const issuerStr = extractNameFromDer(derBytes, true);
      if (issuerStr) issuer = issuerStr;
    }

    if (serialMatch) serialNumber = serialMatch[1].trim().replace(/\s*\(\d+\)/, '');
    if (sigAlgMatch) signatureAlgorithm = sigAlgMatch[1].trim();
    if (pubKeyMatch) publicKeyAlgorithm = pubKeyMatch[1].trim();
    if (pubKeyBitsMatch) publicKeyBits = parseInt(pubKeyBitsMatch[1], 10);
    if (versionMatch) version = parseInt(versionMatch[1], 10);
    if (notBeforeMatch) notBefore = notBeforeMatch[1].trim();
    if (notAfterMatch) notAfter = notAfterMatch[1].trim();
    if (basicConstraintsMatch && basicConstraintsMatch[1].includes('CA:TRUE')) isCA = true;
    if (keyUsageMatch) {
      keyUsages = keyUsageMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    }
    if (sanMatch) {
      sans = sanMatch[1].split(',').map(s => s.trim().replace(/^DNS:/, '')).filter(Boolean);
    }

    // If notBefore/notAfter not found from text, try to extract from DER
    if (!notBefore || !notAfter) {
      const dates = extractDatesFromDer(derBytes);
      if (dates.notBefore) notBefore = dates.notBefore;
      if (dates.notAfter) notAfter = dates.notAfter;
    }
  } catch {
    // Parsing failed partially
  }

  // Compute fingerprints using Web Crypto API (async, but we'll do a simple approach)
  const fingerprints = { sha256: 'Computing...', sha1: 'Computing...' };
  computeFingerprints(derBytes).then(fp => {
    fingerprints.sha256 = fp.sha256;
    fingerprints.sha1 = fp.sha1;
  });

  return {
    subject, issuer, notBefore, notAfter, serialNumber, version,
    signatureAlgorithm, publicKeyAlgorithm, publicKeyBits,
    sans, isCA, keyUsages, fingerprints, pemData: b64,
  };
}

function extractNameFromDer(bytes: Uint8Array, isIssuer: boolean): string {
  // Very simplified: look for SEQUENCE containing SET of SEQUENCE with OID + PrintableString
  // This is a heuristic approach for common X.509 certs
  const parts: string[] = [];
  const text = new TextDecoder('latin1').decode(bytes);

  // Look for commonName patterns in the raw bytes
  const cnOid = new Uint8Array([0x06, 0x03, 0x55, 0x04, 0x03]); // OID for CN
  const oOid = new Uint8Array([0x06, 0x03, 0x55, 0x04, 0x0A]); // OID for O
  const ouOid = new Uint8Array([0x06, 0x03, 0x55, 0x04, 0x0B]); // OID for OU
  const cOid = new Uint8Array([0x06, 0x03, 0x55, 0x04, 0x06]); // OID for C
  const stOid = new Uint8Array([0x06, 0x03, 0x55, 0x04, 0x08]); // OID for ST
  const lOid = new Uint8Array([0x06, 0x03, 0x55, 0x04, 0x07]); // OID for L

  const oidNames: Record<string, string> = { CN: '', O: '', OU: '', C: '', ST: '', L: '' };
  const oidBytes: [Uint8Array, string][] = [
    [cnOid, 'CN'], [oOid, 'O'], [ouOid, 'OU'], [cOid, 'C'], [stOid, 'ST'], [lOid, 'L'],
  ];

  // Find all occurrences of each OID and extract the string value
  for (const [oid, name] of oidBytes) {
    let searchFrom = 0;
    while (searchFrom < bytes.length) {
      const idx = indexOf(bytes, oid, searchFrom);
      if (idx === -1) break;
      // The value should follow: tag byte + length byte + value
      const valOffset = idx + oid.length;
      if (valOffset + 2 < bytes.length) {
        const tag = bytes[valOffset];
        const { length: valLen, bytesRead } = decodeDerLength(bytes, valOffset + 1);
        const valStart = valOffset + 1 + bytesRead;
        if (valLen > 0 && valLen < 256 && valStart + valLen <= bytes.length) {
          const val = decodeAsn1String(bytes, valStart, valLen);
          if (val && val.length > 0 && /^[\x20-\x7E]+$/.test(val)) {
            // Determine if this is issuer or subject by position
            // In X.509: TBS Certificate structure is [version] serial issuer subject ...
            // We'll collect all and later decide
            if (!oidNames[name] || idx > 100) {
              oidNames[name] = val;
            }
          }
        }
      }
      searchFrom = valOffset + 1;
    }
  }

  // For issuer: we want the first set of CN/O/C values (earlier in the file)
  // For subject: we want the second set
  // This is heuristic - collect all occurrences
  const cnAll: string[] = [];
  const oAll: string[] = [];
  const cAll: string[] = [];
  for (const [oid, name] of oidBytes) {
    let searchFrom = 0;
    let count = 0;
    while (searchFrom < bytes.length) {
      const idx = indexOf(bytes, oid, searchFrom);
      if (idx === -1) break;
      const valOffset = idx + oid.length;
      if (valOffset + 2 < bytes.length) {
        const { length: valLen, bytesRead } = decodeDerLength(bytes, valOffset + 1);
        const valStart = valOffset + 1 + bytesRead;
        if (valLen > 0 && valLen < 256 && valStart + valLen <= bytes.length) {
          const val = decodeAsn1String(bytes, valStart, valLen);
          if (val && val.length > 0 && /^[\x20-\x7E]+$/.test(val)) {
            count++;
            if (name === 'CN') cnAll.push(val);
            if (name === 'O') oAll.push(val);
            if (name === 'C') cAll.push(val);
          }
        }
      }
      searchFrom = valOffset + 1;
    }
  }

  const pick = isIssuer ? 0 : 1;
  const cn = cnAll[pick] || cnAll[0] || '';
  const o = oAll[pick] || oAll[0] || '';
  const c = cAll[pick] || cAll[0] || '';

  const dnParts: string[] = [];
  if (cn) dnParts.push(`CN=${cn}`);
  if (o) dnParts.push(`O=${o}`);
  if (c) dnParts.push(`C=${c}`);
  return dnParts.join(', ');
}

function indexOf(haystack: Uint8Array, needle: Uint8Array, from: number): number {
  for (let i = from; i <= haystack.length - needle.length; i++) {
    let found = true;
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) { found = false; break; }
    }
    if (found) return i;
  }
  return -1;
}

function extractDatesFromDer(bytes: Uint8Array): { notBefore: string; notAfter: string } {
  // UTCTime tag = 0x17 (23), GeneralizedTime tag = 0x18 (24)
  const dates: string[] = [];
  for (let i = 0; i < bytes.length - 2; i++) {
    if (bytes[i] === 0x17 || bytes[i] === 0x18) {
      const { length: len, bytesRead } = decodeDerLength(bytes, i + 1);
      if (len > 0 && len < 32) {
        const dateStr = decodeAsn1String(bytes, i + 1 + bytesRead, len);
        if (/^\d{12,14}Z$/.test(dateStr)) {
          dates.push(parsePemDate(dateStr));
        }
      }
    }
  }
  return {
    notBefore: dates[0] || '',
    notAfter: dates[1] || '',
  };
}

async function computeFingerprints(derBytes: Uint8Array): Promise<{ sha256: string; sha1: string }> {
  try {
    const sha256Buf = await crypto.subtle.digest('SHA-256', derBytes as BufferSource);
    const sha1Buf = await crypto.subtle.digest('SHA-1', derBytes as BufferSource);
    const toHex = (buf: ArrayBuffer) =>
      Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(':');
    return {
      sha256: toHex(sha256Buf).toUpperCase(),
      sha1: toHex(sha1Buf).toUpperCase(),
    };
  } catch {
    return { sha256: 'Error computing', sha1: 'Error computing' };
  }
}

function getDaysRemaining(dateStr: string): number | null {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return Math.floor((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

const EXAMPLE_CERTS = [
  {
    label: 'Self-signed localhost cert',
    pem: `-----BEGIN CERTIFICATE-----
MIIDazCCAlOgAwIBAgIUXy8pGQGdP4fNa0VjUhKdQnN4yHkwDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM
GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAeFw0yNTA0MDEwMDAwMDBaFw0yNjA0
MDEwMDAwMDBaMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEw
HwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwggEiMA0GCSqGSIb3DQEB
AQUAA4IBDwAwggEKAoIBAQC7VJTUt9Us8cKjMzEfYyjiWA4/qMD/Cw==-----END CERTIFICATE-----`,
  },
  {
    label: 'Let\'s Encrypt style',
    pem: `-----BEGIN CERTIFICATE-----
MIIFKDCCBBCgAwIBAgISBKxqJfbVrfJqN5DpGiYaLlJUMA0GCSqGSIb3DQEBCwUA
MDMxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQwwCgYDVQQD
EwNSMTEwHhcNMjUwMzAxMDAwMDAwWhcNMjUwNTMwMDAwMDAwWDAeMRwwGgYDVQQD
ExN3d3cuZXhhbXBsZS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
AQC7VJTUt9Us8cKjMzEfYyjiWA4/qMD/Cw==-----END CERTIFICATE-----`,
  },
];

export default function CertificateDecoder() {
  const [pem, setPem] = useState('');
  const [parsed, setParsed] = useState<ReturnType<typeof parseCertPem> | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [fingerprints, setFingerprints] = useState<{ sha256: string; sha1: string } | null>(null);

  const handleDecode = useCallback(async () => {
    setError('');
    setParsed(null);
    setFingerprints(null);

    if (!pem.trim()) {
      setError('Please paste a PEM-encoded certificate');
      return;
    }

    if (!pem.includes('-----BEGIN CERTIFICATE-----')) {
      setError('Invalid PEM format. Certificate must start with -----BEGIN CERTIFICATE-----');
      return;
    }

    const result = parseCertPem(pem);
    if (!result) {
      setError('Failed to parse certificate. Make sure it\'s a valid X.509 PEM certificate.');
      return;
    }

    // Compute fingerprints properly
    const pemBlock = pem.match(/-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/);
    if (pemBlock) {
      const b64 = pemBlock[1].replace(/\s/g, '');
      try {
        const binaryStr = atob(b64);
        const derBytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          derBytes[i] = binaryStr.charCodeAt(i);
        }
        const fp = await computeFingerprints(derBytes);
        setFingerprints(fp);
        result.fingerprints = fp;
      } catch { /* ignore */ }
    }

    setParsed(result);
  }, [pem]);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const loadExample = useCallback((example: typeof EXAMPLE_CERTS[0]) => {
    setPem(example.pem);
    setParsed(null);
    setError('');
  }, []);

  const statusColor = (dateStr: string): string => {
    const days = getDaysRemaining(dateStr);
    if (days === null) return 'text-slate-600';
    if (days < 0) return 'text-red-600 font-bold';
    if (days < 30) return 'text-amber-600 font-bold';
    return 'text-green-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Certificate Decoder</h1>
          <p className="text-slate-600">Decode and inspect X.509 SSL/TLS certificates</p>
        </div>
      </div>

      {/* Examples */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-sm text-slate-500 self-center">Try:</span>
        {EXAMPLE_CERTS.map((ex) => (
          <button
            key={ex.label}
            onClick={() => loadExample(ex)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          PEM Certificate
        </label>
        <textarea
          value={pem}
          onChange={(e) => setPem(e.target.value)}
          placeholder="-----BEGIN CERTIFICATE-----&#10;Paste your PEM-encoded certificate here...&#10;-----END CERTIFICATE-----"
          className="w-full h-48 p-3 border border-slate-300 rounded-xl font-mono text-sm resize-y focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          spellCheck={false}
        />
        <button
          onClick={handleDecode}
          className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg transition"
        >
          Decode Certificate
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {parsed && (
        <div className="space-y-4">
          {/* Subject */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Subject</h3>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-slate-900 font-mono text-sm break-all">{parsed.subject || 'N/A'}</p>
                {parsed.sans.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-slate-500">Subject Alternative Names:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {parsed.sans.map((san, i) => (
                        <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                          {san}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Issuer */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Issuer</h3>
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-slate-900 font-mono text-sm break-all">{parsed.issuer || 'N/A'}</p>
            </div>
          </div>

          {/* Validity */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Validity Period</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Not Before</p>
                  <p className="text-slate-900 text-sm">{parsed.notBefore || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Not After</p>
                  <p className={`text-sm ${statusColor(parsed.notAfter)}`}>
                    {parsed.notAfter || 'N/A'}
                    {getDaysRemaining(parsed.notAfter) !== null && (
                      <span className="ml-2 text-xs">
                        ({getDaysRemaining(parsed.notAfter)} days {getDaysRemaining(parsed.notAfter)! < 0 ? 'ago' : 'remaining'})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Technical Details</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Version</p>
                <p className="text-slate-900">v{parsed.version + 1} (0x{parsed.version.toString(16)})</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Serial Number</p>
                <p className="text-slate-900 font-mono text-xs break-all">{parsed.serialNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Signature Algorithm</p>
                <p className="text-slate-900">{parsed.signatureAlgorithm}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Public Key</p>
                <p className="text-slate-900">{parsed.publicKeyAlgorithm}{parsed.publicKeyBits ? ` (${parsed.publicKeyBits} bit)` : ''}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Type</p>
                <p className="text-slate-900">{parsed.isCA ? '🔐 Certificate Authority (CA)' : '🔒 End Entity'}</p>
              </div>
              {parsed.keyUsages.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500">Key Usage</p>
                  <p className="text-slate-900">{parsed.keyUsages.join(', ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Fingerprints */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Fingerprints</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Fingerprint className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">SHA-256</p>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-900 font-mono text-xs break-all flex-1">
                      {fingerprints?.sha256 || parsed.fingerprints.sha256}
                    </p>
                    <button
                      onClick={() => copyToClipboard(fingerprints?.sha256 || '', 'sha256')}
                      className="flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-100 transition"
                    >
                      {copied === 'sha256' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Fingerprint className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">SHA-1</p>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-900 font-mono text-xs break-all flex-1">
                      {fingerprints?.sha1 || parsed.fingerprints.sha1}
                    </p>
                    <button
                      onClick={() => copyToClipboard(fingerprints?.sha1 || '', 'sha1')}
                      className="flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-100 transition"
                    >
                      {copied === 'sha1' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copy PEM */}
          <div className="flex gap-3">
            <button
              onClick={() => copyToClipboard(pem, 'pem')}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm transition"
            >
              {copied === 'pem' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              Copy PEM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
