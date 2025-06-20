import React from 'react';

interface EnhancedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple';
  message?: string;
}

const EnhancedLoadingSpinner: React.FC<EnhancedLoadingSpinnerProps> = React.memo(({ 
  size = 'md',
  color = 'blue',
  message = '読み込み中...'
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500'
  };

  const containerPadding = {
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerPadding[size]}`}>
      {/* Animated dots */}
      <div className="flex space-x-2 mb-4">
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{ animationDelay: '-0.3s' }}
        ></div>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{ animationDelay: '-0.15s' }}
        ></div>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        ></div>
      </div>
      
      {/* Pulsing ring */}
      <div className="relative">
        <div className={`w-8 h-8 border-2 border-${color}-200 rounded-full`}></div>
        <div className={`absolute top-0 left-0 w-8 h-8 border-2 border-${color}-500 rounded-full animate-ping`}></div>
      </div>
      
      {/* Loading message */}
      <p className="mt-4 text-sm text-gray-600 animate-pulse font-medium">
        {message}
      </p>
      
      {/* Progress bar simulation */}
      <div className="w-32 h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
        <div className={`h-full bg-${color}-500 rounded-full animate-pulse`}
             style={{
               animation: 'loadingProgress 2s ease-in-out infinite'
             }}>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loadingProgress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 100%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
});

EnhancedLoadingSpinner.displayName = 'EnhancedLoadingSpinner';

export default EnhancedLoadingSpinner;