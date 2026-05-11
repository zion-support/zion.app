import React from 'react';

interface Feature {
  title: string;
  description: string;
}

interface RecommendationWidgetProps {
  data: {
    features: Feature[];
  };
}

const RecommendationWidget: React.FC<RecommendationWidgetProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredFeatures = data.features.filter(feature =>
    feature.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="recommendation-widget">
      <h3>Smart Search & Recommendation</h3>
      <input
        type="text"
        placeholder="Search features..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredFeatures.map(feature => (
          <li key={feature.title}>
            {feature.title}: {feature.description}
          </li>
        ))}
      </ul>
    </div>
  );
};


export default RecommendationWidget;
