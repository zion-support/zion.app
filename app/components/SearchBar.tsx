import React from 'react';

interface SearchBarProps {
  className?: string;
  children?: React.ReactNode;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '', children }) => {
  return (
    <div className={`searchbar-component ${className}`}>
{children || <h2>SearchBar</h2>}
    </div>
  );
};

SearchBar.displayName = 'SearchBar';

export default SearchBar;