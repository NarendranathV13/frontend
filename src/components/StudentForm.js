import React, { useState, useEffect } from 'react';
import api from '../api';

const StudentForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', mark: '' });
    const [students, setStudents] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/students');
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await api.put(`/students/${currentId}`, formData);
                setEditMode(false);
                setCurrentId(null);
            } else {
                await api.post('/students', formData);
            }
            fetchStudents();
            setFormData({ name: '', email: '', mark: '' }); // Reset form after submit
        } catch (error) {
            console.error("Error saving student:", error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/students/${id}`);
            fetchStudents();
        } catch (error) {
            console.error("Error deleting student:", error.message);
        }
    };

    const handleEdit = (student) => {
        setFormData({ name: student.name, email: student.email, mark: student.mark });
        setEditMode(true);
        setCurrentId(student._id);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Student Management</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="mark" className="form-label">Mark</label>
                    <input
                        type="number"
                        className="form-control"
                        id="mark"
                        name="mark"
                        placeholder="Enter mark"
                        value={formData.mark}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {editMode ? 'Update Student' : 'Add Student'}
                </button>
            </form>
            <h3 className="my-4">Student List</h3>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mark</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.mark}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(student)}>
                                    Edit
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(student._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentForm;