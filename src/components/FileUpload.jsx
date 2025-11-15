import React, { useState } from 'react';
import { supabase } from '../supabaseClient.js';

// Tidak perlu 'styles' atau impor CSS di sini
// Karena style-nya sudah diimpor oleh DashboardPage

function FileUpload() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    // ... (logika sama)
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    // ... (Logika upload Anda tetap sama)
    e.preventDefault();
    if (!file) {
      setMessage('Silakan pilih file terlebih dahulu.');
      return;
    }
    setLoading(true);
    setMessage('Mengunggah file...');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Anda harus login untuk mengunggah file.");
      const filePath = `${user.id}/${file.name}_${Date.now()}`;
      await supabase.storage.from('files').upload(filePath, file);
      await supabase.from('files').insert({
        userId: user.id,
        fileName: file.name,
        description: description,
        fileURL: filePath,
        year: year ? parseInt(year) : null
      });
      setFile(null);
      setDescription('');
      setYear('');
      document.getElementById('file-input').value = null;
      setMessage('File berhasil diunggah!');
    } catch (error) {
      setMessage(`Gagal mengunggah: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h3>📤Upload File Baru</h3>
      <form onSubmit={handleUpload} className="form-layout">
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          className="form-input" // Ganti class
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tambahkan deskripsi"
          className="form-input" // Ganti class
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Tahun (Contoh: 2024)"
          className="form-input" // Ganti class
          min="1900"
          max="2100"
        />
        <button
          type="submit"
          disabled={loading}
          className="form-button" // Ganti class
        >
          {loading ? 'Mengunggah...' : 'Upload'}
        </button>
      </form>
      {message && (
        <p className={`upload-message ${message.includes('berhasil') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default FileUpload;