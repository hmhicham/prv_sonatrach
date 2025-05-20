import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { IoBarChartOutline, IoPieChartOutline, IoTrendingUpOutline, IoPulseOutline, IoHomeOutline } from 'react-icons/io5';
// Import CSS module with error handling
let styles = {};
try {
  styles = require('./Dashboard.module.css');
  console.log('CSS Module loaded successfully:', styles);
} catch (error) {
  console.error('Failed to load CSS module:', error);
  // Fallback styles if CSS module fails to load
  styles = {
    dashboard: 'dashboard',
    dashboard__main: 'dashboard__main',
    dashboard__sidebar: 'dashboard__sidebar',
    sidebar__title: 'sidebar__title',
    sidebar__nav: 'sidebar__nav',
    sidebar__link: 'sidebar__link',
    active: 'active',
  };
}

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
   
    <div className={styles.dashboard}>
      <div className={styles.dashboard__main}>
        <div className={styles.dashboard__sidebar}>
          <h2 className={styles.sidebar__title}>Porte feuille de l’Activité 2025</h2>
          <nav className={styles.sidebar__nav}>
            <a href="#" className={`${styles.sidebar__link} ${styles.active}`}>
              <IoBarChartOutline className={styles.sidebar__icon} />
              <span>Portefeuille Exploration</span>
            </a>
            <a href="#" className={styles.sidebar__link}>
              <IoPieChartOutline className={styles.sidebar__icon} />
              <span>Synthèse des travaux</span>
            </a>
            <a href="#" className={styles.sidebar__link}>
              <IoTrendingUpOutline className={styles.sidebar__icon} />
              <span>Activité forage Exploration</span>
            </a>
            <a href="#" className={styles.sidebar__link}>
              <IoPulseOutline className={styles.sidebar__icon} />
              <span>Activité Sismique</span>
            </a>
            <a href="#" className={styles.sidebar__link}>
              <IoHomeOutline className={styles.sidebar__icon} />
              <span>Retour à la page d’accueil</span>
            </a>
          </nav>
        </div>

        <div className={styles.dashboard__content}>
          <h1 className={styles.content__title}>Tableau de bord</h1>

          <div className={styles.metrics}>
            <div className={styles.metric}>
              <h3 className={styles.metric__title}>Nombre de Découvertes</h3>
              <p className={styles.metric__value}>17</p>
              <p className={styles.metric__subtext}>dont 0 en Association</p>
            </div>
            <div className={styles.metric}>
              <h3 className={styles.metric__title}>Apport des délinéations</h3>
              <p className={styles.metric__value}>98,71</p>
            </div>
            <div className={styles.metric}>
              <h3 className={styles.metric__title}>Volume 2P MTEP</h3>
              <p className={styles.metric__value}>52,94</p>
            </div>
            <div className={styles.metric}>
              <h3 className={styles.metric__title}>Volume 3P MTEP</h3>
              <p className={styles.metric__value}>26.29</p>
            </div>
          </div>

          <div className={styles.charts}>
            <div className={`${styles.chart__card} ${styles.fullWidth}`}>
              <h3 className={styles.chart__title}>Répartition des périmètres par Bassin</h3>
              <div className={styles.chart__container}>
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>

            <div className={styles.charts__row}>
              <div className={styles.chart__card}>
                <h3 className={styles.chart__title}>Répartition des périmètres par Asset</h3>
                <div className={`${styles.chart__container} ${styles.pie}`}>
                  <Pie data={pieChartAssetData} options={pieChartAssetOptions} />
                </div>
                <p className={styles.chart__total}>Total portefeuille 49</p>
              </div>
              <div className={styles.chart__card}>
                <h3 className={styles.chart__title}>Répartition des périmètres par Catégorie</h3>
                <div className={`${styles.chart__container} ${styles.pie}`}>
                  <Pie data={pieChartCategoryData} options={pieChartCategoryOptions} />
                </div>
                <p className={styles.chart__total}>Total portefeuille 49</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;