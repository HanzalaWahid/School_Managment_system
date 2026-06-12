import React from 'react';

const GenericPage = ({ title }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          Add New
        </button>
      </div>

      <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
        <p>{title} module ready for backend integration.</p>
        <p className="text-sm mt-2">Displaying placeholder table structure.</p>
      </div>
    </div>
  );
};

export default GenericPage;
