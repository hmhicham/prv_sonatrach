import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { IoBarChartOutline, IoPieChartOutline, IoTrendingUpOutline, IoPulseOutline, IoHomeOutline } from 'react-icons/io5';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  // Data for "Répartition des périmètres par Bassin" (Bar Chart)
  const barChartData = {
    labels: ['Asset Nord', 'Asset Est', 'Asset Ouest','Asset Center'],
    datasets: [
      {
        label: 'Tell Offshore',
        data: [14, 0, 0],
        backgroundColor: '#1d4ed8',
      },
      {
        label: 'Oued Mya',
        data: [0, 0, 0],
        backgroundColor: '#f97316',
      },
      {
        label: 'Amguid Messaoud',
        data: [2, 1, 0],
        backgroundColor: '#16a34a',
      },
      {
        label: 'Berkine Est',
        data: [3, 0, 0],
        backgroundColor: '#eab308',
      },
      {
        label: 'ILLIZI',
        data: [1, 0, 0],
        backgroundColor: '#22d3ee',
      },
      {
        label: 'Bechar O Namous',
        data: [0, 0, 0],
        backgroundColor: '#a3e635',
      },
      {
        label: 'Ahnet Gourara',
        data: [1, 0, 0],
        backgroundColor: '#f43f5e',
      },
      {
        label: 'Tind Reggane Sbaa',
        data: [1, 0, 0],
        backgroundColor: '#d946ef',
      },
      {
        label: 'Berkine Ouest',
        data: [0, 0, 0],
        backgroundColor: '#6b7280',
      },
      {
        label: 'Atlas SE Constantinios',
        data: [2, 0, 0],
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const barChartOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        max: 15,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Data for "Répartition des périmètres par Asset" (Pie Chart)
  const pieChartAssetData = {
    labels: ['Asset Nord', 'Asset Est', 'Asset Ouest', 'Asset Centre'],
    datasets: [
      {
        data: [30, 36, 18, 14],
        backgroundColor: ['#ef4444', '#8b5cf6', '#d97706', '#1d4ed8'],
      },
    ],
  };

  const pieChartAssetOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Data for "Répartition des périmètres par Catégorie" (Pie Chart)
  const pieChartCategoryData = {
    labels: ['Near field emergent', 'Near field mature', 'Frontier emergent', 'Frontier mature'],
    datasets: [
      {
        data: [85.4, 0, 14.6, 0],
        backgroundColor: ['#ef4444', '#d97706', '#1d4ed8', '#3b82f6'],
      },
    ],
  };

  const pieChartCategoryOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Data for "Contrats dont l’engagement n’est pas honoré par Bassin" (Bar Chart)
  const barChartEngagementData = {
    labels: ['Phase 1', 'Phase 3', 'Phase 2'],
    datasets: [
      {
        label: 'Tell Offshore',
        data: [14, 0, 0],
        backgroundColor: '#1d4ed8',
      },
      {
        label: 'Oued Mya',
        data: [0, 0, 0],
        backgroundColor: '#f97316',
      },
      {
        label: 'Amguid Messaoud',
        data: [2, 0, 0],
        backgroundColor: '#16a34a',
      },
      {
        label: 'Berkine Est',
        data: [3, 0, 0],
        backgroundColor: '#eab308',
      },
      {
        label: 'ILLIZI',
        data: [1, 0, 0],
        backgroundColor: '#22d3ee',
      },
      {
        label: 'Bechar O Namous',
        data: [0, 0, 0],
        backgroundColor: '#a3e635',
      },
      {
        label: 'Ahnet Gourara',
        data: [1, 0, 0],
        backgroundColor: '#f43f5e',
      },
      {
        label: 'Tind Reggane Sbaa',
        data: [1, 0, 0],
        backgroundColor: '#d946ef',
      },
      {
        label: 'Berkine Ouest',
        data: [0, 0, 0],
        backgroundColor: '#6b7280',
      },
      {
        label: 'Atlas SE Constantinios',
        data: [2, 0, 0],
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const barChartEngagementOptions = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        max: 15,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Porte feuille de l’Activité 2025</h2>
          <nav className="sidebar-nav">
          <a href="#" className="active">
              <IoBarChartOutline className="sidebar-icon" />
              <span>Portefeuille Exploration</span>
            </a>
            <a href="#">
              <IoPieChartOutline className="sidebar-icon" />
              <span>Synthèse des travaux</span>
            </a>
            <a href="#">
              <IoTrendingUpOutline className ="sidebar-icon" />
              <span>Activité forage Exploration</span>
            </a>
            <a href="#">
              <IoPulseOutline className="sidebar-icon" />
              <span>Activité Sismique</span>
            </a>
            <a href="#">
              <IoHomeOutline className="sidebar-icon" />
              <span>Retour à la page d’accueil</span>
            </a>
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <h1>Tableau de bord</h1>

          {/* Key Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Nombre de Découvertes</h3>
              <p className="metric-value">17</p>
              <p className="metric-subtext">dont 0 en Association</p>
            </div>
            <div className="metric-card">
              <h3>Apport des délinéations</h3>
              <p className="metric-value">98,71</p>
            </div>
            <div className="metric-card">
              <h3>Volume 2P MTEP</h3>
              <p className="metric-value">52,94</p>
            </div>
            <div className="metric-card">
              <h3>Volume 3P MTEP</h3>
              <p className="metric-value">26.29</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-layout">
            {/* Bar Chart: Répartition des périmètres par Bassin */}
            <div className="chart-card full-width">
              <h3>Répartition des périmètres par Bassin</h3>
              <div className="chart-container">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>

            {/* Pie Chart: Répartition des périmètres par Asset */}
            <div className="row">
            <div className="chart-card">
              <h3>Répartition des périmètres par Asset</h3>
              <div className="chart-container pie-chart">
                <Pie data={pieChartAssetData} options={pieChartAssetOptions} />
              </div>
              <p className="chart-total">Total portefeuille 49</p>
            </div>

            {/* Pie Chart: Répartition des périmètres par Catégorie */}
            <div className="chart-card">
              <h3>Répartition des périmètres par Catégorie</h3>
              <div className="chart-container pie-chart">
                <Pie data={pieChartCategoryData} options={pieChartCategoryOptions} />
              </div>
              <p className="chart-total">Total portefeuille 49</p>
            </div>
            </div>
          </div>

          {/* Bar Chart: Contrats dont l’engagement n’est pas honoré par Bassin */}
          

          {/* Bottom Cards */}
          
        </div>
      </div>
    </div>
  );
}

export default Dashboard;