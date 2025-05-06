// import React from 'react';
// function NavigationBar() {
//     return (
//       <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
//         <div className="font-bold text-xl">Sonatrach</div>
//         <div className="space-x-4">
//           <span>🔔 Notifications</span>
//           <span>👤 Profil</span>
//         </div>
//       </div>
//     );
//   }
// export default NavigationBar;

// import React from 'react';
// import './navbar.css';
// import { useNavigate } from 'react-router-dom'; // Si tu utilises react-router

// function Navbar() {
//   const navigate = useNavigate(); // Pour la navigation avec react-router

//   const goToDashboard = () => {
//     navigate('/dashboard'); // Change le chemin selon ta route
//   };

//   return (
//     <div className="navbar">
//       <div className="logo">
//         <h2>Sonatrach</h2>
//       </div>

//       <div className="navbar-right">
//         <button className="dashboard-button" onClick={goToDashboard}>
//           🧭 Dashboard
//         </button>

//         {/* <div className="notifications">
//           <span>🔔 Notifications (3)</span>
//           <div className="notification-dropdown">
//             <div className="notification-item">
//               <span>Notification 1</span>
//               <span>2023-04-05</span>
//             </div>
//             <div className="notification-item">
//               <span>Notification 2</span>
//               <span>2023-04-05</span>
//             </div>
//             <div className="notification-item">
//               <span>Notification 3</span>
//               <span>2023-04-05</span>
//             </div>
//           </div>
//         </div> */}

//         {/* <div className="profile">
//           <span>👤 Profil</span>
//           <div className="profile-dropdown">
//             <div className="profile-item">
//               <span>Profil</span>
//             </div>
//             <div className="profile-item">
//               <span>Déconnexion</span>
//             </div>
//           </div>
//         </div> */}

// <button className="icon-button">
//     <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
//     </svg>
//   </button>
//   <div className="user-avatar">A</div>
//       </div>
//     </div>
//   );
// }

// export default Navbar;


import React, { useState } from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false); // Close profile if open
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false); // Close notifications if open
  };

  return (
    <div className="navbar">
      <div className="logo">
        <h2>Sonatrach</h2>
      </div>

      <div className="navbar-right">
        <button className="dashboard-button" onClick={() => navigate('/dashboard')}>
          🧭 Dashboard
        </button>

        <div className="icon-wrapper">
          <button className="icon-button" onClick={toggleNotifications}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          {showNotifications && (
            <div className="dropdown">
              <div className="dropdown-item">Notification 1 — 2023-04-05</div>
              <div className="dropdown-item">Notification 2 — 2023-04-05</div>
              <div className="dropdown-item">Notification 3 — 2023-04-05</div>
            </div>
          )}
        </div>

        <div className="icon-wrapper">
          <div className="user-avatar" onClick={toggleProfile}>A</div>
          {showProfile && (
            <div className="dropdown">
              <div className="dropdown-item">Profil</div>
              <div className="dropdown-item">Déconnexion</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

