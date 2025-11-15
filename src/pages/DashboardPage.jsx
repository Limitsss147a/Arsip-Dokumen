import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import FileUpload from '../components/FileUpload.jsx';
import FileList from '../components/FileList.jsx';
import Search from '../components/Search.jsx';
import './Dashboard.css';

function DashboardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState({ name: '', year: '' });
  const [darkMode, setDarkMode] = useState(false);

  // Load preferensi dark mode dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
  }, []);

  // Terapkan class ke body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleSearch = (name, year) => {
    setSearchQuery({ name, year });
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error saat logout:", error.message);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">📁 Dashboard Penyimpanan Pribadi</h1>
        <div className="header-actions">
          <button
            onClick={toggleDarkMode}
            className="dark-mode-toggle"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main>
        <div className="form-wrapper">
          <FileUpload />
          <Search onSearch={handleSearch} />
        </div>

        <FileList searchQuery={searchQuery} />
      </main>
    </div>
  );
}

export default DashboardPage;