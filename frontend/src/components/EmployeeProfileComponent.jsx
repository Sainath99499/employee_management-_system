import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getEmployee, deleteEmployee } from '../services/EmployeeService';
import { useAuth } from '../context/AuthContext';

const EmployeeProfileComponent = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getEmployee(id)
      .then(res => setEmployee(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Delete this employee?')) {
      deleteEmployee(id).then(() => navigate('/'));
    }
  };

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!employee) return <div className="loading">Employee not found.</div>;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Employee Profile</h2>
          <div className="text-muted" style={{ fontSize: '0.875rem', marginTop: '4px' }}>ID: {employee.id}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isAdmin() ? (
            <Link to="/" className="btn btn-secondary">Back to List</Link>
          ) : null}
          <Link to={`/employees/${id}/attendance`} className="btn btn-secondary">Attendance</Link>
          {isAdmin() && (
            <Link to={`/edit-employee/${id}`} className="btn btn-primary">Edit</Link>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem' }}>
        {/* Left: Avatar */}
        <div style={{ textAlign: 'center' }}>
          {employee.profileImage ? (
            <img
              src={`http://localhost:8080/${employee.profileImage}`}
              alt="Profile"
              style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border-color)' }}
            />
          ) : (
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'var(--primary)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', fontWeight: 700, margin: '0 auto'
            }}>
              {getInitials(employee.firstName)}
            </div>
          )}
          <h4 style={{ marginTop: '0.75rem', fontWeight: 600 }}>
            {employee.firstName} {employee.lastName}
          </h4>
          <span className="badge">
            {employee.department ?? 'Unassigned'}
          </span>
        </div>

        {/* Right: Details */}
        <div>
          {/* Contact Card */}
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-body">
              <div style={{ fontWeight: 600, marginBottom: '1rem' }}>Contact</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Email</div>
                  <div>{employee.email ?? '—'}</div>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Phone</div>
                  <div>{employee.phone ?? '—'}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Address</div>
                  <div>{employee.address ?? '—'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Card */}
          <div className="card">
            <div className="card-body">
              <div style={{ fontWeight: 600, marginBottom: '1rem' }}>Employment</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Department</div>
                  <div>{employee.department ?? '—'}</div>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Joining Date</div>
                  <div>{employee.joiningDate ?? '—'}</div>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Salary</div>
                  <div>{employee.salary ? `₹${Number(employee.salary).toLocaleString('en-IN')}` : '—'}</div>
                </div>
              </div>
            </div>
          </div>

          {isAdmin() && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <Link to={`/edit-employee/${id}`} className="btn btn-primary">Edit Employee</Link>
              <button className="btn btn-danger" onClick={handleDelete}>Delete Employee</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileComponent;
