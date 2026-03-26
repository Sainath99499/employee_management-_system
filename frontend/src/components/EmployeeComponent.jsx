import React, { useState, useEffect } from 'react';
import { createEmployee, getEmployee, updateEmployee } from '../services/EmployeeService';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeComponent = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '' });
    
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getEmployee(id).then((response) => {
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);
            }).catch(error => {
                console.error(error);
            });
        }
    }, [id]);

    const handleFirstName = (e) => setFirstName(e.target.value);
    const handleLastName = (e) => setLastName(e.target.value);
    const handleEmail = (e) => setEmail(e.target.value);

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (!firstName.trim()) {
            errorsCopy.firstName = 'First name is required';
            valid = false;
        } else {
            errorsCopy.firstName = '';
        }

        if (!lastName.trim()) {
            errorsCopy.lastName = 'Last name is required';
            valid = false;
        } else {
            errorsCopy.lastName = '';
        }

        if (!email.trim()) {
            errorsCopy.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errorsCopy.email = 'Email is invalid';
            valid = false;
        } else {
            errorsCopy.email = '';
        }

        setErrors(errorsCopy);
        return valid;
    };

    const saveOrUpdateEmployee = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            const employee = { firstName, lastName, email };
            
            if (id) {
                updateEmployee(id, employee).then((response) => {
                    navigate('/employees');
                }).catch(error => {
                    console.error(error);
                });
            } else {
                createEmployee(employee).then((response) => {
                    navigate('/employees');
                }).catch(error => {
                    console.error(error);
                });
            }
        }
    };

    const pageTitle = () => {
        if (id) {
            return <h2>Update Employee</h2>;
        } else {
            return <h2>Add Employee</h2>;
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    {pageTitle()}
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {id ? 'Update the details for this employee' : 'Enter the details to create a new employee record'}
                    </p>
                </div>
                
                <form>
                    <div className="form-group">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            placeholder="Enter first name"
                            name="firstName"
                            value={firstName}
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                            onChange={handleFirstName}
                            style={errors.firstName ? { borderColor: 'var(--danger)' } : {}}
                        />
                        {errors.firstName && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem' }}>{errors.firstName}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            placeholder="Enter last name"
                            name="lastName"
                            value={lastName}
                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                            onChange={handleLastName}
                            style={errors.lastName ? { borderColor: 'var(--danger)' } : {}}
                        />
                        {errors.lastName && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem' }}>{errors.lastName}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            name="email"
                            value={email}
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            onChange={handleEmail}
                            style={errors.email ? { borderColor: 'var(--danger)' } : {}}
                        />
                        {errors.email && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem' }}>{errors.email}</div>}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button className="btn btn-primary" onClick={saveOrUpdateEmployee} style={{ flex: 1 }}>
                            Submit
                        </button>
                        <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); navigate('/employees'); }} style={{ flex: 1 }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeComponent;
