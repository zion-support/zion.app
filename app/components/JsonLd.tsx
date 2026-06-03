import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

const JsonLd: React.FC<JsonLdProps> = ({ data }) => (
  <script
    type="application/ld+json"
    suppressHydrationWarning
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

JsonLd.displayName = 'JsonLd';

export default JsonLd;
