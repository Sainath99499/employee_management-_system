import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAttendance, markAttendance } from '../services/AttendanceService';
import { getEmployee } from '../services/EmployeeService';

const AttendanceComponent = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState('PRESENT');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getEmployee(id).then(res => setEmployee(res.data)).catch(console.error);
    loadAttendance();
  }, [id]);

  const loadAttendance = () => {
    getAttendance(id).then(res => setRecords(res.data)).catch(console.error);
  };

  const handleMark = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await markAttendance(id, status);
      setMessage('Attendance marked successfully!');
      loadAttendance();
    } catch (err) {
      setMessage('Failed to mark attendance.');
    } finally {
      setSaving(false);
    }
  };

  const statusColor = (s) => {
    if (s === 'PRESENT') return '#22c55e';
    if (s === 'ABSENT') return '#ef4444';
    if (s === 'LEAVE') return '#f59e0b';
    return '#6b7280';
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Attendance</h2>
          {employee && (
            <div className="text-muted" style={{ fontSize: '0.875rem', marginTop: '4px' }}>
              {employee.firstName} {employee.lastName}
            </div>
          )}
        </div>
        <Link to={`/employees/${id}`} className="btn btn-secondary">Back to Profile</Link>
      </div>

      {/* Mark Attendance */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body">
          <div style={{ fontWeight: 600, marginBottom: '1rem' }}>Mark Today's Attendance</div>
          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1rem' }}>
              {message}
            </div>
          )}
          <form onSubmit={handleMark} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LEAVE">Leave</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      </div>

      {/* Records Table */}
      <div className="card">
        <div className="table-container" style={{ margin: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No attendance records yet.
                  </td>
                </tr>
              ) : (
                records.map(r => (
                  <tr key={r.id}>
                    <td>{r.date}</td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: statusColor(r.status) + '22',
                        color: statusColor(r.status),
                        border: `1px solid ${statusColor(r.status)}44`
                      }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceComponent;
