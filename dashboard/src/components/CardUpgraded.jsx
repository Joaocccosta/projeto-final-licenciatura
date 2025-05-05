import React from 'react';

// Placeholder for a simple bar chart
const HourlyChart = () => (
  <div className="flex items-end h-16 space-x-1 px-2">
    {/* Example bars */}
    <div className="bg-green-700 w-4 h-12"></div>
    <div className="bg-green-700 w-4 h-16"></div>
    <div className="bg-green-700 w-4 h-14"></div>
    <div className="bg-green-700 w-4 h-8"></div>
    <div className="bg-green-700 w-4 h-4"></div>
    {/* Add more bars based on data */}
  </div>
);

// Placeholder for a circular progress indicator
const CircularProgress = ({ percentage, label, value }) => (
  <div className="relative w-32 h-32 mx-auto my-4">
    {/* Basic circle representation */}
    <div className="absolute inset-0 border-8 border-green-700 rounded-full"></div>
    {/* Add progress arc logic here if needed */}
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-3xl font-bold text-white">{percentage}%</span>
      {label && <span className="text-xs text-gray-200">{label}</span>}
      {value && <span className="text-lg font-semibold text-white">{value}</span>}
    </div>
  </div>
);

const CardUpgraded = ({
  title,
  status,
  performancePercentage,
  performanceLabel,
  performanceValue,
  additionalInfo,
  showChart = false, // Prop to control chart visibility
  isDowntimeView = false // Prop for the simpler downtime view
}) => {
  return (
    <div className="bg-green-500 rounded-lg shadow-md text-white overflow-hidden">
      {/* Header */}
      <div className="bg-green-600 p-3 text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        {status && <p className="text-sm text-gray-200">{status}</p>}
      </div>

      {/* Performance Section */}
      <div className="p-4 text-center">
        {isDowntimeView ? (
          // Simplified view for Downtime
          <div className="my-4">
            <p className="text-5xl font-bold">{performancePercentage}%</p>
            {performanceLabel && <p className="text-sm text-gray-200 mt-1">{performanceLabel}</p>}
          </div>
        ) : (
          // Standard view with circular progress
          <CircularProgress
            percentage={performancePercentage}
            label={performanceLabel}
            value={performanceValue}
          />
        )}
        {additionalInfo && <p className="text-sm text-gray-200 mt-2">{additionalInfo}</p>}
      </div>

      {/* Hourly Chart Section (Optional) */}
      {showChart && !isDowntimeView && (
        <div className="bg-green-400 p-2">
          <HourlyChart />
          <div className="flex justify-between text-xs text-green-800 px-2 mt-1">
            <span>6:00 AM</span>
            <span>2:00 PM</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardUpgraded;