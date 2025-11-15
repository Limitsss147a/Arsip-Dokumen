import React, { useState } from 'react';
import { supabase } from '../supabaseClient.js'; 
import { useNavigate } from 'react-router-dom';

// LANGKAH 1: Impor file CSS baru kita
import './LoginPage.css'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Akun berhasil dibuat! Silakan login.');
        setIsRegistering(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard'); 
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // LANGKAH 2: Ganti 'style={...}' dengan 'className="..."'
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{isRegistering ? 'Daftar Akun Baru' : 'Masuk'}</h2>
        
        {error && <p className="login-error-message">{error}</p>}
        
        <form onSubmit={handleAuth} className="login-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="login-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="login-input"
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Memproses...' : (isRegistering ? 'Daftar' : 'Masuk')}
          </button>
        </form>

        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="login-toggle-button"
        >
          {isRegistering ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar di sini'}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;