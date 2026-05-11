import React from 'react';

interface SearchModalProps {
  className?: string;
  children?: React.ReactNode;
}

const SearchModal: React.FC<SearchModalProps> = ({ className = '', children }) => {
  return (
    <div className={`searchmodal-component ${className}`}>
{children || <h2>SearchModal</h2>}
    </div>
  );
};

SearchModal.displayName = 'SearchModal';

export default SearchModal;