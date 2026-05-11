'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, Lock, Unlock, Terminal, FileText } from 'lucide-react';

interface PermGroup {
  read: boolean;
  write: boolean;
  execute: boolean;
}

function groupToOctal(g: PermGroup): number {
  return (g.read ? 4 : 0) + (g.write ? 2 : 0) + (g.execute ? 1 : 0);
}

function groupToSymbolic(g: PermGroup): string {
  return (g.read ? 'r' : '-') + (g.write ? 'w' : '-') + (g.execute ? 'x' : '-');
}

function octalToGroup(octal: number): PermGroup {
  return {
    read: (octal & 4) !== 0,
    write: (octal & 2) !== 0,
    execute: (octal & 1) !== 0,
  };
}

const PRESETS: { name: string; owner: number; group: number; other: number; special?: number }[] = [
  { name: '644 (rw-r--r--)', owner: 6, group: 4, other: 4 },
  { name: '755 (rwxr-xr-x)', owner: 7, group: 5, other: 5 },
  { name: '700 (rwx------)', owner: 7, group: 0, other: 0 },
  { name: '600 (rw-------)', owner: 6, group: 0, other: 0 },
  { name: '777 (rwxrwxrwx)', owner: 7, group: 7, other: 7 },
  { name: '444 (r--r--r--)', owner: 4, group: 4, other: 4 },
  { name: '555 (r-xr-xr-x)', owner: 5, group: 5, other: 5 },
  { name: '640 (rw-r-----)', owner: 6, group: 4, other: 0 },
  { name: '750 (rwxr-x---)', owner: 7, group: 5, other: 0 },
  { name: '4755 (setuid)', owner: 7, group: 5, other: 5, special: 4 },
  { name: '2755 (setgid)', owner: 7, group: 5, other: 5, special: 2 },
  { name: '1777 (sticky)', owner: 7, group: 7, other: 7, special: 1 },
];

export default function ChmodCalculator() {
  const [owner, setOwner] = useState<PermGroup>({ read: true, write: true, execute: false });
  const [group, setGroup] = useState<PermGroup>({ read: true, write: false, execute: false });
  const [other, setOther] = useState<PermGroup>({ read: true, write: false, execute: false });
  const [setuid, setSetuid] = useState(false);
  const [setgid, setSetgid] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const toggle = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<PermGroup>>,
      field: keyof PermGroup,
    ) => {
      setter((prev) => ({ ...prev, [field]: !prev[field] }));
    },
    [],
  );

  const ownerOctal = groupToOctal(owner);
  const groupOctal = groupToOctal(group);
  const otherOctal = groupToOctal(other);
  const specialOctal = (setuid ? 4 : 0) + (setgid ? 2 : 0) + (sticky ? 1 : 0);
  const octalStr = (specialOctal ? specialOctal.toString() : '') + ownerOctal + groupOctal + otherOctal;
  const symbolicStr =
    (setuid ? (owner.execute ? 's' : 'S') : '') +
    groupToSymbolic(owner) +
    (setgid ? (group.execute ? 's' : 'S') : '') +
    groupToSymbolic(group) +
    (sticky ? (other.execute ? 't' : 'T') : '') +
    groupToSymbolic(other);

  const chmodCmd = `chmod ${octalStr} filename`;

  const copyValue = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const reset = () => {
    setOwner({ read: true, write: true, execute: false });
    setGroup({ read: true, write: false, execute: false });
    setOther({ read: true, write: false, execute: false });
    setSetuid(false);
    setSetgid(false);
    setSticky(false);
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setOwner(octalToGroup(preset.owner));
    setGroup(octalToGroup(preset.group));
    setOther(octalToGroup(preset.other));
    setSetuid((preset.special ?? 0 & 4) !== 0);
    setSetgid((preset.special ?? 0 & 2) !== 0);
    setSticky((preset.special ?? 0 & 1) !== 0);
  };

  const PermCheckbox = ({
    label,
    checked,
    onChange,
    color,
  }: {
    label: string;
    checked: boolean;
    onChange: () => void;
    color: string;
  }) => (
    <button
      onClick={onChange}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        checked
          ? `${color} text-white shadow-sm`
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );

  const PermGroupEditor = ({
    title,
    icon,
    perms,
    setter,
    colors,
  }: {
    title: string;
    icon: React.ReactNode;
    perms: PermGroup;
    setter: React.Dispatch<React.SetStateAction<PermGroup>>;
    colors: { read: string; write: string; execute: string };
  }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <span className="ml-auto rounded-md bg-slate-100 px-2 py-0.5 font-mono text-sm font-bold text-slate-700">
          {groupToOctal(perms)}
        </span>
      </div>
      <div className="flex gap-2">
        <PermCheckbox
          label="Read"
          checked={perms.read}
          onChange={() => toggle(setter, 'read')}
          color={colors.read}
        />
        <PermCheckbox
          label="Write"
          checked={perms.write}
          onChange={() => toggle(setter, 'write')}
          color={colors.write}
        />
        <PermCheckbox
          label="Execute"
          checked={perms.execute}
          onChange={() => toggle(setter, 'execute')}
          color={colors.execute}
        />
      </div>
      <p className="mt-2 font-mono text-xs text-slate-500">{groupToSymbolic(perms)}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Chmod Permission Calculator</h1>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Visually build Unix file permissions with owner/group/other controls, special bits, presets, and instant command output.
            </p>
          </div>

          {/* Output */}
          <div className="mb-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Octal</p>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="font-mono text-3xl font-bold text-slate-900">{octalStr}</span>
                  <button
                    onClick={() => copyValue(octalStr, 'octal')}
                    className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-100"
                  >
                    {copied === 'octal' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Symbolic</p>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="font-mono text-3xl font-bold text-slate-900">{symbolicStr}</span>
                  <button
                    onClick={() => copyValue(symbolicStr, 'symbolic')}
                    className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-100"
                  >
                    {copied === 'symbolic' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Command</p>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="font-mono text-lg font-bold text-slate-900">{chmodCmd}</span>
                  <button
                    onClick={() => copyValue(chmodCmd, 'cmd')}
                    className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-100"
                  >
                    {copied === 'cmd' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Permission Editors */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <PermGroupEditor
              title="Owner (u)"
              icon={<Lock className="h-4 w-4 text-blue-600" />}
              perms={owner}
              setter={setOwner}
              colors={{
                read: 'bg-blue-500',
                write: 'bg-blue-600',
                execute: 'bg-blue-700',
              }}
            />
            <PermGroupEditor
              title="Group (g)"
              icon={<Unlock className="h-4 w-4 text-violet-600" />}
              perms={group}
              setter={setGroup}
              colors={{
                read: 'bg-violet-500',
                write: 'bg-violet-600',
                execute: 'bg-violet-700',
              }}
            />
            <PermGroupEditor
              title="Other (o)"
              icon={<FileText className="h-4 w-4 text-amber-600" />}
              perms={other}
              setter={setOther}
              colors={{
                read: 'bg-amber-500',
                write: 'bg-amber-600',
                execute: 'bg-amber-700',
              }}
            />
          </div>

          {/* Special Bits */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Special Permissions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSetuid((v) => !v)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  setuid ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                SetUID (s) — {setuid ? 'On' : 'Off'}
              </button>
              <button
                onClick={() => setSetgid((v) => !v)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  setgid ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                SetGID (s) — {setgid ? 'On' : 'Off'}
              </button>
              <button
                onClick={() => setSticky((v) => !v)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  sticky ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Sticky (t) — {sticky ? 'On' : 'Off'}
              </button>
              <button
                onClick={reset}
                className="ml-auto flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Presets */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Common Presets</h3>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Permission Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">Permission Reference</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 pr-4 font-semibold text-slate-700">Value</th>
                    <th className="py-2 pr-4 font-semibold text-slate-700">Symbol</th>
                    <th className="py-2 font-semibold text-slate-700">Meaning</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 pr-4 font-mono">4</td>
                    <td className="py-1.5 pr-4 font-mono">r</td>
                    <td className="py-1.5">Read</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 pr-4 font-mono">2</td>
                    <td className="py-1.5 pr-4 font-mono">w</td>
                    <td className="py-1.5">Write</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 pr-4 font-mono">1</td>
                    <td className="py-1.5 pr-4 font-mono">x</td>
                    <td className="py-1.5">Execute</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 pr-4 font-mono">4 (special)</td>
                    <td className="py-1.5 pr-4 font-mono">s/S</td>
                    <td className="py-1.5">SetUID — run as file owner</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 pr-4 font-mono">2 (special)</td>
                    <td className="py-1.5 pr-4 font-mono">s/S</td>
                    <td className="py-1.5">SetGID — run as group</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pr-4 font-mono">1 (special)</td>
                    <td className="py-1.5 pr-4 font-mono">t/T</td>
                    <td className="py-1.5">Sticky — only owner can delete</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
