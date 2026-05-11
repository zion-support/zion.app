import Link from 'next/link';

const monetizationLinks = [
  { name: 'Vultr Hosting', href: 'https://www.vultr.com/?ref=ziontech' },
  { name: 'Datadog', href: 'https://www.datadoghq.com/free?ref=ziontech' },
  { name: 'OpenAI API', href: 'https://platform.openai.com/signup?ref=ziontech' },
  { name: 'GitHub Sponsors', href: 'https://github.com/sponsors/Zion-support' },
  { name: 'Buy Me a Coffee', href: 'https://www.buymeacoffee.com/' },
];

const MonetizationBar = () => {
  return (
    <div className="border-t border-purple-500/20 bg-slate-900/50 py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-purple-200">
          Support Us (Free Tools)
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {monetizationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 transition hover:text-purple-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonetizationBar;
