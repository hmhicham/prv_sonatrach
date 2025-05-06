
import React from 'react';
function ToolPaletteMap() {
    return (
      <div className="bg-gray-100 mt-4 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Outils Carte</h2>
        <div className="flex space-x-2">
          <button className="bg-orange-500 text-white px-4 py-2 rounded">Zoom</button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded">Pan</button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded">Dessin</button>
        </div>
      </div>
    );
  }



// function ToolPaletteMap() {
//   return (
//     <div className="tool-palette-map">
//       {/* Add your map component here */}
//       <h3>Map Placeholder</h3>
//     </div>
//   );
// }

export default ToolPaletteMap;