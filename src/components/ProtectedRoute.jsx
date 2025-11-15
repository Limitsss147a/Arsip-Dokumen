import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Coba ambil sesi yang ada (jika user baru saja login/refresh)
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    // 2. Dengarkan perubahan status auth (saat login atau logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // 3. Bersihkan listener saat komponen dilepas
    return () => {
      subscription?.unsubscribe();
    };
  }, []); // [] berarti efek ini hanya berjalan sekali

  if (loading) {
    // Tampilkan "Loading..." selagi kita mengecek status login
    return <div>Loading, please wait...</div>;
  }

  if (!session) {
    // Jika tidak ada sesi (belum login),
    // "tendang" mereka kembali ke halaman /login
    return <Navigate to="/login" />;
  }

  // Jika ada sesi (sudah login), tampilkan "children"
  // (yaitu <DashboardPage />)
  return children;
}

export default ProtectedRoute;