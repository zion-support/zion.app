const assert = require('node:assert');

function deriveSchema({ title, description, pathname = '/qa-test' }) {
  const siteUrl = 'https://ziontechgroup.com';
  const orgName = 'Zion Tech Group';
  const fullUrl = `${siteUrl}${pathname || '/'}`;
  const cleanedTitle = (title || '').replace(/\s*\|.*$/, '').trim() || orgName;
  const cleanedDescription = description || `${orgName} service page.`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: fullUrl,
    name: cleanedTitle,
    description: cleanedDescription,
  };
}

function main() {
  const cases = [
    {
      input: { title: 'QA Title | Zion Tech Group', description: 'QA description.' },
      expected: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url: 'https://ziontechgroup.com/qa-test',
        name: 'QA Title',
        description: 'QA description.',
      },
    },
    {
      input: { title: '  ', description: '' },
      expected: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url: 'https://ziontechgroup.com/qa-test',
        name: 'Zion Tech Group',
        description: 'Zion Tech Group service page.',
      },
    },
    {
      input: { title: 'Only Title', description: 'Only description' },
      expected: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url: 'https://ziontechgroup.com/qa-test',
        name: 'Only Title',
        description: 'Only description',
      },
    },
  ];

  for (const test of cases) {
    const schema = deriveSchema(test.input);
    assert.deepStrictEqual(schema, test.expected);
  }

  console.log('useAutoJsonLdPage deterministic self-test passed');
}

main();
