// import React from 'react';
// import { NavLink } from "react-router-dom";

// function HorizontalMenu() {
//   return (
//     <div className="bg-gray-200 px-4 py-2 flex space-x-4">
//       <NavLink to="/" className="hover:text-orange-500">Accueil</NavLink>
//       <NavLink to="/perimetres" className="hover:text-orange-500">Périmètres</NavLink>
//       <NavLink to="/planning" className="hover:text-orange-500">Planning</NavLink>
//       <NavLink to="/programmes" className="hover:text-orange-500">Programmes</NavLink>
//       <NavLink to="/surfaces" className="hover:text-orange-500">Surfaces</NavLink>
//       <NavLink to="/avenants" className="hover:text-orange-500">Avenants & Demandes</NavLink>
//     </div>
//   );
// }
// export default HorizontalMenu;

import React from 'react';
import { Link } from 'react-router-dom';
import './HorizontalMenu.css';

function HorizontalMenu() {
  return (
    <div className="horizontal-menu">
      <Link to="/" className="menu-item">Accueil</Link>

      <Link to="/PerimetreList" className="menu-item">Périmètres</Link>
      
      {/* <Link to="/perimeters" className="menu-item">Périmètres</Link> */}
      <div className="dropdownn">
      <button className="menu-item">Planning</button>
      <div className="dropdown-content">
          <Link to="/planning" className="dropdown-itemm">Planing sismique mensuel</Link>
          <Link to="/planning/sismique" className="dropdown-itemm">Planing Forage mensuel</Link>
          <Link to="/planning/geologique" className="dropdown-itemm">PMT</Link>
      </div>
      </div>
      {/* <Link to="/planning" className="menu-item">Planning</Link> */}
      {/* <Link to="/programs" className="menu-item">Programmes</Link> */}

      <div className="dropdownn">
        <button className="menu-item">Programmes</button>
        <div className="dropdown-content">
          <Link to="/programs/P_sismiques" className="dropdown-itemm">Programmes sismiques</Link>
          <Link to="/programs/P_puits" className="dropdown-itemm">Programmes puits</Link>
          <Link to="/programs/P_Etude_GG" className="dropdown-itemm">Programmes Etude G&G</Link>
          <Link to="/programs/P_F_Hydraulique" className="dropdown-itemm">Programmes Facturation Hydraulique</Link>
        </div>
      </div>

      <Link to="/surfaces" className="menu-item">Surfaces</Link>
      <Link to="/Avenants" className="menu-item">Avenants & Demandes</Link>
    </div>
  );
}
export default HorizontalMenu;