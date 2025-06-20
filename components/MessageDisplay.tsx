
import React from 'react';

interface MessageDisplayProps {
  type: 'info' | 'error';
  message: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = React.memo(({ type, message }) => {
  const baseClasses = "p-4 rounded-md text-center my-4";
  const typeClasses = type === 'error' 
    ? "bg-red-100 border border-red-300 text-red-700" 
    : "bg-blue-50 border border-blue-200 text-blue-700";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
    </div>
  );
});

MessageDisplay.displayName = 'MessageDisplay';

export default MessageDisplay;
