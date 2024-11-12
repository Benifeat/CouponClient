// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../auth/api';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await api.users.getAll();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const addUser = async (userData) => {
        try {
            const newUser = await api.users.create(userData);
            setUsers(prev => [...prev, newUser]);
            return newUser;
        } catch (err) {
            throw new Error(err.message || 'Failed to create user');
        }
    };

    const updateUser = async (id, userData) => {
        try {
            const updatedUser = await api.users.update(id, userData);
            setUsers(prev => prev.map(user =>
                user.id === id ? updatedUser : user
            ));
            return updatedUser;
        } catch (err) {
            throw new Error(err.message || 'Failed to update user');
        }
    };

    const deleteUser = async (id) => {
        try {
            await api.users.delete(id);
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch (err) {
            throw new Error(err.message || 'Failed to delete user');
        }
    };

    return (
        <UserContext.Provider value={{
            users,
            loading,
            error,
            fetchUsers,
            addUser,
            updateUser,
            deleteUser
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUsers must be used within a UserProvider');
    }
    return context;
};