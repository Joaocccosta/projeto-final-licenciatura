// Simple placeholder Card component
const Card = ({ title, value }) => (
    <div className="bg-gray-100 p-4 rounded-lg shadow text-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );

export default Card;