import React from 'react';

interface ServiceTemplateProps {
  className?: string;
  children?: React.ReactNode;
}

const ServiceTemplate: React.FC<ServiceTemplateProps> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={'service-template ' + className}>
      {children || <p>Service-template component</p>}
    </div>
  );
};

export default ServiceTemplate;