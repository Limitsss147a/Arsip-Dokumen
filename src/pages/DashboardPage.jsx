import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import FileUpload from '../components/FileUpload.jsx';
import FileList from '../components/FileList.jsx';
import Search from '../components/Search.jsx';
import './Dashboard.css';

function DashboardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState({ name: '', year: '' });

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

  return (
    // Gunakan class names baru
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Penyimpanan Pribadi</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <main>
        {/* Kita akan bungkus ini agar rapi */}
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