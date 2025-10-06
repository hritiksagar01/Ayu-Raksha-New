// src/components/common/LoadingSpinner.tsx
'use client';

interface LoadingSpinnerProps {
  isOverlay?: boolean;
  text?: string;
}

export default function LoadingSpinner({ 
  isOverlay = false, 
  text = 'Loading...' 
}: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      {text && <p className="text-gray-700 font-medium">{text}</p>}
    </div>
  );

  if (isOverlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 shadow-xl">
          {content}
        </div>
      </div>
    );
  }

  return <div className="flex items-center justify-center min-h-screen">{content}</div>;
}