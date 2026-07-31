// src/pages/LoginAdmin.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  School,
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Shield,
  CheckCircle,
  XCircle,
  Loader,
  Database
} from 'lucide-react';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc
} from 'firebase/firestore';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initStatus, setInitStatus] = useState(null);
  const [initMessage, setInitMessage] = useState('');
  const [dbStatus, setDbStatus] = useState(null);

  // REF UNTUK MENCEGAH DUPLIKAT
  const isInitializing = useRef(false);
  const hasInitialized = useRef(false);

  // DATA DEFAULT USERS
  const DEFAULT_USERS = [
    // Kelas 1
    {
      username: "1_p_antasari",
      password: "admin123",
      email: "restu@sdsharapansejahtera.com",
      role: "wali_kelas",
      fullName: "RESTU GUSTI MAISA, S.Pd.",
      grade: "1",
      className: "Kelas 1 P. Antasari",
      classId: "1_p_antasari",
      path: "/admin/1-p-antasari",
      phoneNumber: "081234567890",
      isActive: true
    },
    {
      username: "1_p_diponegoro",
      password: "admin123",
      email: "risfi@sdsharapansejahtera.com",
      role: "wali_kelas",
      fullName: "RISFI MAZIDATUL WAFDAH, S.Pd.",
      grade: "1",
      className: "Kelas 1 P. Diponegoro",
      classId: "1_p_diponegoro",
      path: "/admin/1-p-diponegoro",
      phoneNumber: "081234567891",
      isActive: true
    },
    {
      username: "1_tjilik_riwut",
      password: "admin123",
      email: "malinda@sdsharapansejahtera.com",
      role: "wali_kelas",
      fullName: "MALINDA AYU NINGTIAS, S.Pd.",
      grade: "1",
      className: "Kelas 1 Tjilik Riwut",
      classId: "1_tjilik_riwut",
      path: "/admin/1-tjilik-riwut",
      phoneNumber: "081234567892",
      isActive: true
    },
    // Kelas 2
    {
      username: "2_dr_wahidin",
      password: "admin123",
      email: "andri@sdsharapansejahtera.com",
      role: "wali_kelas",
      fullName: "ANDRI KURNIAWAN, S.Pd.",
      grade: "2",
      className: "Kelas 2 Dr. Wahidin",
      classId: "2_dr_wahidin",
      path: "/admin/2-dr-wahidin",
      phoneNumber: "081234567893",
      isActive: true
    },
    {
      username: "2_dr_soetomo",
      password: "admin123",
      email: "ahikamtun@sdsharapansejahtera.com",
      role: "wali_kelas",
      fullName: "AHIKAMTUN HAYU PUSPORINI, S.Pd.",
      grade: "2",
      className: "Kelas 2 Dr. Soetomo",
      classId: "2_dr_soetomo",
      path: "/admin/2-dr-soetomo",
      phoneNumber: "081234567894",
      isActive: true
    },
    // Kelas 3
    {
      username: "3_dewi_sartika",
      password: "admin123",
      email: "khoyrur@sdsharapansejahtera.com",
      role: "wali_kelas",
      fullName: "KHOYRUR ROYKHAN, S.Pd.",
      grade: "3",
      className: "Kelas 3 Dewi Sartika",
      classId: "3_dewi_sartika",
      path: "/admin/3-dewi-sartika",
      phoneNumber: "081234567895",
      isActive: true
    },
    {
      username: "3_ra_kartini",
      password: "admin123",
      email: "supiansyah@sdsharapansejahtera.com",
      role: "wali_kelas",
      fullName: "SUPIANSYAH, S.Pd. I",
      grade: "3",
      className: "Kelas 3 R.A. Kartini",
      classId: "3_ra_kartini",
      path: "/admin/3-ra-kartini",
      phoneNumber: "081234567896",
      isActive: true
    },
    // Kelas 4
    {
      username: "4_tan_malaka",
      password: "admin123",
      email: "istafat@sdsharapansejahtera.com",
      role: "wali_kelas",
      fullName: "ISTAFAT DIFLATUL KHASANAH, S.Pd.",
      grade: "4",
      className: "Kelas 4 Tan Malaka",
      classId: "4_tan_malaka",
      path: "/admin/4-tan-malaka",
      phoneNumber: "081234567897",
      isActive: true
    },
    {
      username: "4_wahid_hasyim",
      password: "admin123",
      email: "istafat@sdsharapansejahtera.com",
      role: "wali_kelas",
      fullName: "ISTAFAT DIFLATUL KHASANAH, S.Pd.",
      grade: "4",
      className: "Kelas 4 Wahid Hasyim",
      classId: "4_wahid_hasyim",
      path: "/admin/4-wahid-hasyim",
      phoneNumber: "081234567898",
      isActive: true
    },
    // Kelas 5
    {
      username: "5_cut_meutia",
      password: "admin123",
      email: "rika@sdsharapansejahtera.com",
      role: "wali_kelas",
      fullName: "RIKA MARYANTI, S.Pd.",
      grade: "5",
      className: "Kelas 5 Cut Meutia",
      classId: "5_cut_meutia",
      path: "/admin/5-cut-meutia",
      phoneNumber: "081234567899",
      isActive: true
    },
    {
      username: "5_cut_nyak_dien",
      password: "admin123",
      email: "rika@sdsharapansejahtera.com",
      role: "wali_kelas",
      fullName: "RIKA MARYANTI, S.Pd.",
      grade: "5",
      className: "Kelas 5 Cut Nyak Dien",
      classId: "5_cut_nyak_dien",
      path: "/admin/5-cut-nyak-dien",
      phoneNumber: "081234567900",
      isActive: true
    },
    // Kelas 6
    {
      username: "6_soekarno",
      password: "admin123",
      email: "hanif@sdsharapansejahtera.com",
      role: "wali_kelas",
      fullName: "MUHAMAD HANIF, S.Pd.",
      grade: "6",
      className: "Kelas 6 Soekarno",
      classId: "6_soekarno",
      path: "/admin/6-soekarno",
      phoneNumber: "081234567901",
      isActive: true
    },
    {
      username: "6_hatta",
      password: "admin123",
      email: "rizky@sdsharapansejahtera.com",
      role: "wali_kelas",
      fullName: "RIZKY HERMAWAN, S.Pd.",
      grade: "6",
      className: "Kelas 6 Hatta",
      classId: "6_hatta",
      path: "/admin/6-hatta",
      phoneNumber: "081234567902",
      isActive: true
    },
    // Super Admin
    {
      username: "super_admin",
      password: "admin123",
      email: "admin@sdsharapansejahtera.com",
      role: "super_admin",
      fullName: "Super Administrator",
      grade: "all",
      className: "Super Admin",
      classId: "super_admin",
      path: "/admin/dashboard",
      phoneNumber: "081234567903",
      isActive: true
    }
  ];

  // FUNCTION: Inisialisasi Database dengan Pencegahan Duplikat
  const initializeDatabase = async () => {
    // CEK APAKAH SEDANG PROSES ATAU SUDAH SELESAI
    if (isInitializing.current || hasInitialized.current) {
      console.log('⏳ Proses inisialisasi sedang berjalan atau sudah selesai');
      return;
    }

    // TANDAI SEDANG PROSES
    isInitializing.current = true;

    try {
      setInitStatus('loading');
      setInitMessage('🔍 Mengecek koneksi database...');

      const usersRef = collection(db, 'users');
      
      // CEK APAKAH COLLECTION USERS SUDAH ADA DATA
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);

      setDbStatus('connected');
      setInitMessage('✅ Koneksi database berhasil');

      // JIKA SUDAH ADA DATA, TIDAK BUAT LAGI
      if (!querySnapshot.empty) {
        setInitStatus('success');
        setInitMessage(`✅ Database sudah terisi (${querySnapshot.size} akun tersedia).`);
        hasInitialized.current = true;
        isInitializing.current = false;
        return;
      }

      // JIKA KOSONG, BUAT DATA BARU
      setInitMessage('📝 Membuat data awal...');
      
      let addedCount = 0;
      
      // GUNAKAN BATCH ATAU LOOP DENGAN PENGECEKAN KETAT
      for (const userData of DEFAULT_USERS) {
        try {
          // CEK USERNAME SATU PER SATU
          const usernameQuery = query(usersRef, where('username', '==', userData.username));
          const usernameSnapshot = await getDocs(usernameQuery);
          
          // HANYA TAMBAHKAN JIKA BELUM ADA
          if (usernameSnapshot.empty) {
            await addDoc(usersRef, {
              ...userData,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLogin: null
            });
            addedCount++;
            console.log(`✅ User ${userData.username} berhasil ditambahkan`);
          } else {
            console.log(`ℹ️ User ${userData.username} sudah ada, dilewati`);
          }
        } catch (error) {
          console.error(`❌ Gagal menambahkan user ${userData.username}:`, error);
        }
      }
      
      setInitStatus('success');
      setInitMessage(`✅ Database berhasil diinisialisasi! ${addedCount} akun baru ditambahkan.`);
      hasInitialized.current = true;
      
      await logActivity(null, 'system', 'init_database', `Inisialisasi database dengan ${addedCount} user`);

    } catch (error) {
      console.error('Error inisialisasi:', error);
      setDbStatus('disconnected');
      setInitStatus('error');
      
      let errorMsg = error.message;
      if (error.code === 'permission-denied') {
        errorMsg = 'Izin ditolak! Silakan atur aturan keamanan Firestore terlebih dahulu.';
      } else if (error.code === 'unavailable') {
        errorMsg = 'Layanan tidak tersedia. Periksa koneksi internet Anda.';
      }
      
      setInitMessage(`❌ ${errorMsg}`);
    } finally {
      // PASTIKAN FLAG RESET
      isInitializing.current = false;
    }
  };

  // FUNCTION: Log Aktivitas
  const logActivity = async (userId, username, action, details) => {
    try {
      const logsRef = collection(db, 'activity_logs');
      await addDoc(logsRef, {
        userId: userId || null,
        username: username || 'system',
        action: action,
        details: details || '',
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent || 'unknown'
      });
    } catch (error) {
      console.error('Error logging:', error);
    }
  };

  // FUNCTION: Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        throw new Error('Username dan password harus diisi');
      }

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Username tidak ditemukan');
      }

      let userData = null;
      let userId = null;
      
      querySnapshot.forEach((doc) => {
        userData = doc.data();
        userId = doc.id;
      });

      if (userData.password !== password) {
        throw new Error('Password salah');
      }

      if (!userData.isActive) {
        throw new Error('Akun sedang tidak aktif. Hubungi administrator.');
      }

      await updateDoc(doc(db, 'users', userId), {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      await logActivity(userId, username, 'login', 'Login berhasil');

      const { password: _, ...userWithoutPassword } = userData;

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userClassId', userData.classId || '');
      localStorage.setItem('userName', userData.fullName);
      localStorage.setItem('userPath', userData.path || '/admin/dashboard');

      const redirectPath = userData.path || '/admin/dashboard';
      navigate(redirectPath);

    } catch (error) {
      setError(error.message);
      await logActivity(null, username, 'login_failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // EFFECT: Auto-inisialisasi saat halaman dimuat
  useEffect(() => {
    // PASTIKAN HANYA DIJALANKAN SEKALI
    if (!hasInitialized.current && !isInitializing.current) {
      initializeDatabase();
    }
    
    // CLEANUP FUNCTION
    return () => {
      // TIDAK ADA CLEANUP YANG DIPERLUKAN
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Status styles
  const getInitStatusStyle = () => {
    switch(initStatus) {
      case 'success': return 'bg-green-50 border-green-200 text-green-700';
      case 'error': return 'bg-red-50 border-red-200 text-red-700';
      case 'loading': return 'bg-blue-50 border-blue-200 text-blue-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getInitStatusIcon = () => {
    switch(initStatus) {
      case 'success': return <CheckCircle className="w-5 h-5 flex-shrink-0" />;
      case 'error': return <XCircle className="w-5 h-5 flex-shrink-0" />;
      case 'loading': return <Loader className="w-5 h-5 animate-spin flex-shrink-0" />;
      default: return <Database className="w-5 h-5 flex-shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-500 text-sm">SDS Harapan Sejahtera</p>
            <p className="text-xs text-gray-400 mt-1">SiManLas Harta v1.0</p>
          </div>

          {/* Status Inisialisasi Database */}
          {initStatus && (
            <div className={`mb-4 p-3 rounded-xl border ${getInitStatusStyle()} flex items-start space-x-2`}>
              {getInitStatusIcon()}
              <span className="text-sm flex-1">{initMessage}</span>
              {initStatus === 'error' && (
                <button
                  onClick={() => {
                    hasInitialized.current = false;
                    isInitializing.current = false;
                    initializeDatabase();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium underline flex-shrink-0"
                >
                  Coba lagi
                </button>
              )}
            </div>
          )}

          {/* Status Koneksi */}
          {dbStatus && (
            <div className={`mb-4 text-xs flex items-center gap-2 ${
              dbStatus === 'connected' ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className={`inline-block w-2 h-2 rounded-full ${
                dbStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {dbStatus === 'connected' ? 'Terhubung ke database' : 'Tidak terhubung ke database'}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                  placeholder="Masukkan username"
                  required
                  disabled={initStatus === 'loading' || dbStatus === 'disconnected'}
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                  placeholder="Masukkan password"
                  required
                  disabled={initStatus === 'loading' || dbStatus === 'disconnected'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || initStatus === 'loading' || dbStatus === 'disconnected'}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200/50 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <School className="w-3.5 h-3.5" />
              SDS Harapan Sejahtera
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;