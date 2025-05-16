import React from 'react';

const StateCard = ({ title, status }) => {
  let bgGradient = 'from-gray-500 to-gray-600'; // Default gradient (gray)
  let statusText = status || 'Indisponível'; // Default text
  let statusIcon = null;

  // Map status values to correct states
  if (status === 'running' || status === 1 || status === '1') {
    bgGradient = 'from-green-500 to-green-700';
    statusText = 'Running';
    statusIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else if (status === 'stopped' || status === 0 || status === '0') {
    bgGradient = 'from-red-500 to-red-700';
    statusText = 'Stopped';
    statusIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    );
  } else if (status === 'sem_trabalho' || status === 'Sem Trabalho' || status === null) {
    bgGradient = 'from-gray-500 to-gray-700';
    statusText = 'Sem Trabalho';
    statusIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    );
  }

  // Don't render the card if title doesn't exist
  if (!title) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-br ${bgGradient} p-6 rounded-xl shadow-lg text-white text-center flex flex-col justify-between items-center min-h-[150px] w-[300px] hover:shadow-xl transition-all duration-300`}>
      <h3 className="text-lg font-semibold uppercase tracking-wider">{title}</h3>
      <div className="flex flex-col items-center justify-center flex-grow">
        {statusIcon}
        <p className="text-2xl font-bold">{statusText}</p>
      </div>
      <div className="h-2"></div> {/* Empty space at bottom for balance */}
    </div>
  );
};

export default StateCard;