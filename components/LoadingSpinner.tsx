import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8"> {/* Adjusted padding */}
      <div className="flex space-x-2">
        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;