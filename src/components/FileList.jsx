import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

function FileList({ searchQuery }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, [searchQuery]);

  const [preview, setPreview] = useState(null); // { url, type, name }
  const [previewLoading, setPreviewLoading] = useState(false);

  const fetchFiles = async () => {
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

  // Tampilkan skeleton saat loading
  if (loading) {
    return (
      <div className="skeleton-table">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-row"></div>
        ))}
      </div>
    );
  }

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return '🖼️';
      case 'txt':
      case 'md':
        return '📃';
      case 'zip':
      case 'rar':
      case '7z':
        return '📦';
      default:
        return '📎';
    }
  };

  return (
    <div className="file-list-container">
      <h2>📄 File Saya</h2>
      {files.length === 0 ? (
        <p className="empty-text">Tidak ada file yang cocok dengan pencarian Anda.</p>
      ) : (
        <div className="table-responsive">
          <table className="file-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nama File</th>
                <th>Deskripsi</th>
                <th>Tahun</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {files
                .slice()
                .sort((a, b) => a.fileName.localeCompare(b.fileName))
                .map((file, index) => (
                  <tr key={file.id}>
                    <td>{index + 1}</td>
                    <td>
                        <span
                            onClick={() => handleDownload(file.fileURL)}
                            className="file-name-link">
                            {getFileIcon(file.fileName)} {file.fileName}
                        </span>
                    </td>
                    <td>{file.description || '—'}</td>
                    <td>{file.year || 'N/A'}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(file)}
                        className="delete-button small"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FileList;