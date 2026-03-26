import React, { useEffect, useState } from 'react';
import { listEmployees, deleteEmployee } from '../services/EmployeeService';
import { useNavigate } from 'react-router-dom';

const ListEmployeeComponent = () => {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllEmployees();
    }, []);

    const getAllEmployees = () => {
        listEmployees().then((response) => {
            setEmployees(response.data);
        }).catch(error => {
            console.error(error);
        });
    };

    const addNewEmployee = () => {
        navigate('/add-employee');
    };

    const updateEmployee = (id) => {
        navigate(`/edit-employee/${id}`);
    };

    const removeEmployee = (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            deleteEmployee(id).then((response) => {
                getAllEmployees();
            }).catch(error => {
                console.error(error);
            });
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Employees List</h2>
                <button className="btn btn-primary" onClick={addNewEmployee}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                    Add Employee
                </button>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email Id</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(employee => (
                            <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.firstName}</td>
                                <td>{employee.lastName}</td>
                                <td>{employee.email}</td>
                                <td>
                                    <div className="table-actions">
                                        <button 
                                            className="btn btn-secondary" 
                                            onClick={() => updateEmployee(employee.id)}
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn btn-danger" 
                                            onClick={() => removeEmployee(employee.id)}
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {employees.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                    No employees found. Add one to get started!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListEmployeeComponent;
