// components/Front/Login.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login = ({ onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div>
                <a href="#" className="text-blue-600 text-sm">
                    Forgot the password?
                </a>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                Sign in
            </button>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="keep-logged"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="keep-logged" className="text-sm text-gray-600">
                    Keep me logged-in
                </label>
            </div>
        </form>
    );
};

export default Login;