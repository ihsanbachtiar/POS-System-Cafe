import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/login', { username, password });
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError('Username atau password salah!');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-surface-container-highest border border-outline-variant rounded-2xl shadow-[0px_8px_24px_rgba(31,21,18,0.1)] p-8 relative overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        
        <div className="text-center mb-8">
          <h1 className="font-headline-xl text-3xl font-bold text-primary mb-2">Artisan Brew</h1>
          <p className="font-body-md text-on-surface-variant">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl font-body-md text-sm text-center border border-error/20">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-label-lg text-on-surface-variant">Username</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">person</span>
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter your username"
                required 
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-lg text-on-surface-variant">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">lock</span>
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password"
                required 
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="mt-4 w-full bg-primary text-on-primary py-4 rounded-xl font-label-lg text-[16px] tracking-wide font-semibold hover:bg-inverse-surface active:scale-95 transition-all shadow-sm"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center font-body-md text-sm">
          <span className="text-on-surface-variant">Belum punya akun? </span>
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
