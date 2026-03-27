import React, { useEffect, useState } from 'react';
import { listEmployees, searchEmployees, deleteEmployee } from '../services/EmployeeService';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ListEmployeeComponent = () => {
    const [employees, setEmployees] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState({ name: '', department: '', minSalary: '', maxSalary: '' });
    const [isSearching, setIsSearching] = useState(false);
    
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    const loadAllEmployees = () => {
        setLoading(true);
        setError(null);
        console.log('DEBUG: Fetching all employees...');
        listEmployees().then(res => {
            const data = res.data;
            console.log('DEBUG: Received employee data:', data);
            
            if (Array.isArray(data)) {
                setEmployees(data);
                setTotalItems(data.length);
            } else if (data && data.content && Array.isArray(data.content)) {
                // Secondary check in case backend is still paginated
                setEmployees(data.content);
                setTotalItems(data.totalElements || data.content.length);
            } else {
                console.error('DEBUG: Data is not an array:', data);
                setEmployees([]);
                setTotalItems(0);
            }
        }).catch(err => {
            console.error('DEBUG: Failed to load employees:', err);
            setError('Failed to connect to the server. Please check your connection.');
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        if (!isSearching) {
            loadAllEmployees();
        }
    }, [isSearching]);

    const handleSearch = (e) => {
        e.preventDefault();
        const { name, department, minSalary, maxSalary } = search;
        const hasFilter = name || department || minSalary || maxSalary;
        if (!hasFilter) {
            setIsSearching(false);
            loadAllEmployees();
            return;
        }
        setIsSearching(true);
        setLoading(true);
        console.log('DEBUG: Searching employees with filters:', search);
        searchEmployees(name, department, minSalary || null, maxSalary || null).then(res => {
            const data = res.data;
            if (Array.isArray(data)) {
                setEmployees(data);
                setTotalItems(data.length);
            } else {
                setEmployees([]);
                setTotalItems(0);
            }
        }).catch(err => {
            console.error('DEBUG: Search failed:', err);
            setError('Search failed. Please try again.');
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleClear = () => {
        setSearch({ name: '', department: '', minSalary: '', maxSalary: '' });
        setIsSearching(false);
        loadAllEmployees();
    };

    const removeEmployee = (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            deleteEmployee(id).then(() => {
                setIsSearching(false);
                loadAllEmployees();
            }).catch(console.error);
        }
    };

    const badgeColor = (dept) => {
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];
        if (!dept) return '#6b7280';
        let hash = 0;
        for (let c of dept) hash = c.charCodeAt(0) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    if (loading && employees.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div className="spinner" style={{ marginBottom: '1rem' }} />
                <p className="text-muted">Loading employees...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card text-center" style={{ padding: '3rem' }}>
                <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>
                <button className="btn btn-primary" onClick={loadAllEmployees}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Employees</h2>
                    <div className="text-muted" style={{ fontSize: '0.875rem', marginTop: '4px' }}>{totalItems} total</div>
                </div>
                {isAdmin() && (
                    <button className="btn btn-primary" onClick={() => navigate('/add-employee')}>
                        + Add Employee
                    </button>
                )}
            </div>

            {/* Search Card */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-body">
                    <form onSubmit={handleSearch} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ margin: 0, minWidth: '160px', flex: 1 }}>
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" placeholder="Search by name..."
                                value={search.name} onChange={e => setSearch({ ...search, name: e.target.value })} />
                        </div>
                        <div className="form-group" style={{ margin: 0, minWidth: '140px', flex: 1 }}>
                            <label className="form-label">Department</label>
                            <input type="text" className="form-control" placeholder="e.g. HR, IT"
                                value={search.department} onChange={e => setSearch({ ...search, department: e.target.value })} />
                        </div>
                        <div className="form-group" style={{ margin: 0, minWidth: '120px', flex: 1 }}>
                            <label className="form-label">Min Salary</label>
                            <input type="number" className="form-control"
                                value={search.minSalary} onChange={e => setSearch({ ...search, minSalary: e.target.value })} />
                        </div>
                        <div className="form-group" style={{ margin: 0, minWidth: '120px', flex: 1 }}>
                            <label className="form-label">Max Salary</label>
                            <input type="number" className="form-control"
                                value={search.maxSalary} onChange={e => setSearch({ ...search, maxSalary: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={loading}>Search</button>
                            <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Table */}
            <div className="card">
                <div className="table-container" style={{ margin: 0 }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Department</th>
                                <th>Joining Date</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id}>
                                    <td style={{ color: 'var(--text-secondary)' }}>{emp.id}</td>
                                    <td>
                                        <Link to={`/employees/${emp.id}`} style={{ fontWeight: 600, textDecoration: 'none', color: 'var(--primary)' }}>
                                            {emp.firstName} {emp.lastName}
                                        </Link>
                                        {emp.phone && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.phone}</div>}
                                    </td>
                                    <td>{emp.email}</td>
                                    <td>{emp.phone ?? '—'}</td>
                                    <td>
                                        {emp.department ? (
                                            <span style={{
                                                padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem',
                                                fontWeight: 600, background: badgeColor(emp.department) + '22',
                                                color: badgeColor(emp.department),
                                                border: `1px solid ${badgeColor(emp.department)}44`
                                            }}>
                                                {emp.department}
                                            </span>
                                        ) : <span className="text-muted">—</span>}
                                    </td>
                                    <td>{emp.joiningDate ?? '—'}</td>
                                    <td>
                                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                                            <Link to={`/employees/${emp.id}`} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>View</Link>
                                            {isAdmin() && (
                                                <>
                                                    <Link to={`/edit-employee/${emp.id}`} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Edit</Link>
                                                    <button className="btn btn-danger" onClick={() => removeEmployee(emp.id)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Delete</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListEmployeeComponent;
