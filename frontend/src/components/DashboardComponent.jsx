import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/DashboardService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardComponent = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const deptLabels = stats ? Object.keys(stats.employeesPerDept) : [];
  const deptCounts = stats ? Object.values(stats.employeesPerDept) : [];

  const chartData = {
    labels: deptLabels,
    datasets: [
      {
        label: 'Employees per Department',
        data: deptCounts,
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, precision: 0, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <div className="text-muted" style={{ fontSize: '0.875rem', marginTop: '4px' }}>Company overview</div>
        </div>
        <Link to="/" className="btn btn-secondary">Back to Employees</Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Employees</div>
          <div className="stat-value">{stats?.totalEmployees ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Salary</div>
          <div className="stat-value">
            ₹{stats?.averageSalary ? Number(stats.averageSalary).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Departments</div>
          <div className="stat-value">{deptLabels.length}</div>
        </div>
      </div>

      {/* Department Chart */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-body">
          <div className="fw-semibold" style={{ marginBottom: '1rem', fontWeight: 600 }}>Employees per Department</div>
          {deptLabels.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>No department data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
