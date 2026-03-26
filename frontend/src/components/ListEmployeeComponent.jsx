import React, { useEffect, useState } from 'react';
import { listEmployees, searchEmployees, deleteEmployee } from '../services/EmployeeService';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ListEmployeeComponent = () => {
    const [employees, setEmployees] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState({ name: '', department: '', minSalary: '', maxSalary: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const pageSize = 10;
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    useEffect(() => {
        if (!isSearching) {
            loadPage(currentPage);
        }
    }, [currentPage, isSearching]);

    const loadPage = (page) => {
        listEmployees().then(res => {
            // The API returns a Page object
            const data = res.data;
            if (data && data.content) {
                setEmployees(data.content);
                setTotalPages(data.totalPages);
                setTotalItems(data.totalElements);
            } else if (Array.isArray(data)) {
                setEmployees(data);
                setTotalItems(data.length);
                setTotalPages(1);
            }
        }).catch(console.error);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const { name, department, minSalary, maxSalary } = search;
        const hasFilter = name || department || minSalary || maxSalary;
        if (!hasFilter) {
            setIsSearching(false);
            setCurrentPage(0);
            loadPage(0);
            return;
        }
        setIsSearching(true);
        searchEmployees(name, department, minSalary || null, maxSalary || null).then(res => {
            setEmployees(res.data);
            setTotalItems(res.data.length);
            setTotalPages(1);
        }).catch(console.error);
    };

    const handleClear = () => {
        setSearch({ name: '', department: '', minSalary: '', maxSalary: '' });
        setIsSearching(false);
        setCurrentPage(0);
        loadPage(0);
    };

    const removeEmployee = (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            deleteEmployee(id).then(() => {
                setIsSearching(false);
                loadPage(currentPage);
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
                            <button type="submit" className="btn btn-primary">Search</button>
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

                {/* Pagination */}
                {totalPages > 1 && !isSearching && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                        <button className="btn btn-secondary" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0} style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i} onClick={() => setCurrentPage(i)}
                                className={`btn ${i === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                                {i + 1}
                            </button>
                        ))}
                        <button className="btn btn-secondary" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages - 1} style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListEmployeeComponent;
