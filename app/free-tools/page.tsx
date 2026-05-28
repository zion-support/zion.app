import Link from 'next/link';

const tools = [
  {
    name: 'GitHub Copilot X (Free Tier)',
    href: 'https://github.com/features/copilot',
    desc: 'AI code assistant from GitHub – free tier for students and hobbyists.',
  },
  {
    name: 'VS Code',
    href: 'https://code.visualstudio.com/',
    desc: 'Free, open‑source code editor with extensions for every stack.',
  },
  {
    name: 'Tailwind CSS',
    href: 'https://tailwindcss.com/',
    desc: 'Utility‑first CSS framework – completely free to use.',
  },
  {
    name: 'Netlify',
    href: 'https://www.netlify.com/',
    desc: 'Deploy static sites for free with CI/CD built‑in.',
  },
  {
    name: 'Vercel',
    href: 'https://vercel.com/',
    desc: 'Jamstack hosting with generous free tier for front‑end apps.',
  },
  {
    name: 'QR Code Generator',
    href: '/tools/qr-code-generator',
    desc: 'Generate QR codes for any URL instantly in your browser.',
  },
];

export default function FreeToolsPage() {

export const metadata = {
  title: "Free Tools | {process.env.NEXT_PUBLIC_APP_NAME}",
  description: "",
};


  return (
    <main className="mx-auto max-w-4xl p-8">
      
      <h1 className="text-3xl font-bold mb-4">Free Tools & Resources</h1>
      <p className="mb-6">Explore a curated list of powerful free tools that help you build, deploy, and scale your projects without cost.</p>
      <ul className="space-y-4 list-none">
{tools.map((tool, i) => (
  <li key={i} className="border p-4 rounded">
    <h2 className="text-xl font-semibold">{tool.name}</h2>
    <p className="text-gray-600">{tool.desc}</p>
    <Link href={tool.href} className="text-blue-500 underline">{tool.href}</Link>
  </li>
))}
</ul>
    </main>
    );
}