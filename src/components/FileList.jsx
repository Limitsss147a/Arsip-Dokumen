import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

function FileList({ searchQuery }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null); // { type: 'image' | 'text', url?: string, content?: string, name: string }
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [searchQuery]);

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

  // === HANDLE DOWNLOAD (untuk file yang tidak bisa di-preview) ===
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

  // === HANDLE PREVIEW (klik file) ===
  const handlePreview = async (file) => {
    const ext = file.fileName.split('.').pop()?.toLowerCase() || '';

    // Jenis file yang bisa di-preview: gambar & teks
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'txt', 'md'].includes(ext)) {
      setPreviewLoading(true);
      try {
        const { data, error } = await supabase.storage
          .from('files')
          .createSignedUrl(file.fileURL, 300); // URL berlaku 5 menit

        if (error) throw error;

        if (['txt', 'md'].includes(ext)) {
          const response = await fetch(data.signedUrl);
          const text = await response.text();
          setPreview({ type: 'text', content: text, name: file.fileName });
        } else {
          setPreview({ type: 'image', url: data.signedUrl, name: file.fileName });
        }
      } catch (err) {
        alert('Gagal memuat preview.');
      } finally {
        setPreviewLoading(false);
      }
    } else {
      // File lain (PDF, DOCX, ZIP, dll) → buka di tab baru
      handleDownload(file.fileURL);
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

  // === GET ICON BY EXTENSION ===
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp': return '🖼️';
      case 'txt':
      case 'md': return '📃';
      case 'zip':
      case 'rar':
      case '7z': return '📦';
      default: return '📎';
    }
  };

  // === LOADING SKELETON ===
  if (loading) {
    return (
      <div className="skeleton-table">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-row"></div>
        ))}
      </div>
    );
  }

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
                        onClick={() => handlePreview(file)}
                        className="file-name-link"
                      >
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

      {/* === MODAL PREVIEW === */}
      {preview && (
        <div className="preview-modal-overlay" onClick={() => setPreview(null)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>👁️ Preview: {preview.name}</h3>
              <button className="close-preview" onClick={() => setPreview(null)}>
                ×
              </button>
            </div>
            <div className="preview-content">
              {previewLoading ? (
                <p>Memuat preview...</p>
              ) : preview.type === 'image' ? (
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="preview-image"
                />
              ) : preview.type === 'text' ? (
                <pre className="preview-text">{preview.content}</pre>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileList;