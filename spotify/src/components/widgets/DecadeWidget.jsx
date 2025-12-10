'use client';

import { useState } from 'react';

const decades = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

const DecadeWidget = ({ onSelectDecade }) => {
  const [selectedDecade, setSelectedDecade] = useState('');

  const handleSelectDecade = (decade) => {
    setSelectedDecade(decade);
    onSelectDecade(decade); 
  };

  return (
    <div className="widget p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">Selecciona una década</h2>
      <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <select
          value={selectedDecade}
          onChange={(e) => handleSelectDecade(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg bg-gray-700 text-white"
        >
          <option value="">Seleccionar década</option>
          {decades.map((decade) => (
            <option key={decade} value={decade}>
              {decade}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DecadeWidget;
