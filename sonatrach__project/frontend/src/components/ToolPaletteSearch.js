import React from 'react';
function ToolPaletteSearch() {
    return (
      <div className="bg-gray-100 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Recherche & Filtres</h2>
        <input type="text" placeholder="🔍 Rechercher..." className="w-full p-2 rounded border" />
        <div className="mt-4">
          <label className="block mb-1">Catégorie</label>
          <select className="w-full p-2 rounded border">
            <option>Tout</option>
            <option>Production</option>
            <option>Maintenance</option>
          </select>
        </div>
      </div>
    );
  }

// import React from 'react';

// function ToolPaletteSearch() {
//   return (
//     <div className="tool-palette-search">
//       <input type="text" placeholder="Search..." />
//     </div>
//   );
// }

export default ToolPaletteSearch;