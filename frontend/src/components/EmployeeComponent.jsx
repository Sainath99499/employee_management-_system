import React, { useState, useEffect } from 'react';
import { createEmployee, getEmployee, updateEmployee } from '../services/EmployeeService';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeComponent = () => {
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '',
        phone: '', address: '', department: '',
        joiningDate: '', salary: '',
    });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getEmployee(id).then((response) => {
                const d = response.data;
                setForm({
                    firstName: d.firstName ?? '',
                    lastName: d.lastName ?? '',
                    email: d.email ?? '',
                    phone: d.phone ?? '',
                    address: d.address ?? '',
                    department: d.department ?? '',
                    joiningDate: d.joiningDate ?? '',
                    salary: d.salary ?? '',
                });
            }).catch(console.error);
        }
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const validateForm = () => {
        const errs = {};
        if (!form.firstName.trim()) errs.firstName = 'First name is required';
        if (!form.email.trim()) {
            errs.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            errs.email = 'Email is invalid';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const saveOrUpdateEmployee = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const employee = {
            ...form,
            salary: form.salary !== '' ? parseFloat(form.salary) : null,
            joiningDate: form.joiningDate || null,
        };

        if (id) {
            updateEmployee(id, employee).then(() => navigate('/employees')).catch(console.error);
        } else {
            createEmployee(employee).then(() => navigate('/employees')).catch(console.error);
        }
    };

    const field = (label, name, type = 'text', placeholder = '') => (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <input
                type={type}
                name={name}
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                value={form[name]}
                className="form-control"
                onChange={handleChange}
                style={errors[name] ? { borderColor: 'var(--danger)' } : {}}
            />
            {errors[name] && (
                <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                    {errors[name]}
                </div>
            )}
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    <h2>{id ? 'Update Employee' : 'Add Employee'}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {id ? 'Update the details for this employee' : 'Enter the details to create a new employee record'}
                    </p>
                </div>

                <form onSubmit={saveOrUpdateEmployee}>
                    {/* Name row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {field('First Name', 'firstName')}
                        {field('Last Name', 'lastName')}
                    </div>

                    {/* Contact row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {field('Email Address', 'email', 'email')}
                        {field('Phone', 'phone', 'tel')}
                    </div>

                    {field('Address', 'address', 'text', 'Street, City, State')}

                    {/* Employment row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        {field('Department', 'department', 'text', 'e.g. HR, IT')}
                        {field('Joining Date', 'joiningDate', 'date')}
                        {field('Salary (₹)', 'salary', 'number')}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            {id ? 'Update Employee' : 'Add Employee'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/employees')}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeComponent;
