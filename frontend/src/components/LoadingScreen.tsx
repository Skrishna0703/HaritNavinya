import React from 'react';

interface LoadingScreenProps {
  isVisible: boolean;
  message?: string;
  gifUrl?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible, message = "Loading...", gifUrl }) => {

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-95 z-50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="w-64 h-64 flex items-center justify-center">
          {gifUrl ? (
            // Display GIF image
            <img 
              src={gifUrl} 
              alt="Loading animation" 
              className="w-full h-full object-contain animate-bounce"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
            </div>
          )}
        </div>
        {message && (
          <div className="text-center">
            <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
