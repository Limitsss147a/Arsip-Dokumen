import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

// Tidak perlu 'styles' atau impor CSS

function FileList({ searchQuery }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, [searchQuery]);

  const fetchFiles = async () => {
    // ... (Logika fetchFiles Anda tetap sama)
    setLoading(true);
    try {
      let query = supabase.from('files').select('*');
      if (searchQuery.name) {
        query = query.ilike('fileName', `%${searchQuery.name}%`);
      }
      if (searchQuery.year) {
        query = query.eq('year', parseInt(searchQuery.year));
      }
      const { data, error } = await query;
      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error("Error mengambil file:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filePath) => {
    // ... (Logika handleDownload Anda tetap sama)
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .createSignedUrl(filePath, 60);
      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      alert('Gagal membuka file.');
    }
  };

  const handleDelete = async (file) => {
    // ... (Logika handleDelete Anda tetap sama)
    if (!window.confirm(`Anda yakin ingin menghapus ${file.fileName}?`)) {
      return;
    }
    try {
      await supabase.storage.from('files').remove([file.fileURL]);
      await supabase.from('files').delete().eq('id', file.id);
      setFiles(files.filter(f => f.id !== file.id));
      alert('File berhasil dihapus!');
    } catch (error) {
      alert(`Gagal menghapus file: ${error.message}`);
    }
  };

  if (loading) {
    return <p className="loading-text">Memuat file...</p>;
  }

  return (
    <div className="file-list-container">
      <h2>File Saya</h2>
      {files.length === 0 ? (
        <p className="empty-text">Tidak ada file yang cocok dengan pencarian Anda.</p>
      ) : (
        <ul className="file-list">
          {files.map(file => (
            <li key={file.id} className="file-item">
              <div className="file-info">
                <span
                  onClick={() => handleDownload(file.fileURL)}
                  className="file-name"
                >
                  {file.fileName}
                </span>
                <p className="file-details">
                  {file.description || '(Tidak ada deskripsi)'} - <strong>Tahun: {file.year || 'N/A'}</strong>
                </p>
              </div>
              <div className="file-actions">
                <button
                  onClick={() => handleDelete(file)}
                  className="delete-button"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileList;