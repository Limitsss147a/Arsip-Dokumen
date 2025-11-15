import React, { useState } from 'react';

// Tidak perlu 'styles' atau impor CSS

function Search({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchYear, setSearchYear] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm, searchYear);
  };

  return (
    <div className="form-card">
      <h3>Cari File</h3>
      <form onSubmit={handleSearch} className="form-layout">
        <input
          type="text"
          placeholder="Cari berdasarkan nama file..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
        <input
          type="number"
          placeholder="Cari berdasarkan tahun (Contoh: 2024)"
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
          className="form-input"
        />
        <button type="submit" className="form-button">
          Cari
        </button>
      </form>
    </div>
  );
}

// Hapus 'const styles' yang lama

export default Search;