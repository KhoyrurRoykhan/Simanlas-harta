// src/pages/MataPelajaran.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft,
  BookOpen,
  Calendar,
  Clock,
  Users,
  Award,
  ChevronRight,
  Loader,
  AlertTriangle,
  School,
  File,
  FileSpreadsheet,
  Eye,
  ExternalLink
} from 'lucide-react';
import { db } from '../../firebase/config';
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  getDoc
} from 'firebase/firestore';

// Mapping icon berdasarkan nama mata pelajaran
const getIconForSubject = (nama) => {
  const iconMap = {
    'matematika': '📐',
    'bahasa indonesia': '📚',
    'bahasa inggris': '🌍',
    'ipas': '🔬',
    'sbdp': '🎨',
    'plks': '❤️',
    'pendidikan pancasila': '🛡️',
    'agama': '🕌',
    'pkn': '📖',
    'tik': '💻',
    'olahraga': '🏃',
    'musik': '🎵'
  };
  
  const key = nama?.toLowerCase() || '';
  for (const [k, v] of Object.entries(iconMap)) {
    if (key.includes(k)) {
      return v;
    }
  }
  return '📚';
};

// Mapping warna berdasarkan nama mata pelajaran
const getColorForSubject = (nama) => {
  const colorMap = {
    'matematika': { from: 'from-blue-500', to: 'to-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
    'bahasa indonesia': { from: 'from-green-500', to: 'to-green-600', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
    'bahasa inggris': { from: 'from-red-500', to: 'to-red-600', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
    'ipas': { from: 'from-cyan-500', to: 'to-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600' },
    'sbdp': { from: 'from-purple-500', to: 'to-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
    'plks': { from: 'from-pink-500', to: 'to-pink-600', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' },
    'pendidikan pancasila': { from: 'from-orange-500', to: 'to-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
    'agama': { from: 'from-emerald-500', to: 'to-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
    'pkn': { from: 'from-indigo-500', to: 'to-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' },
    'tik': { from: 'from-sky-500', to: 'to-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600' },
    'olahraga': { from: 'from-lime-500', to: 'to-lime-600', bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-600' },
    'musik': { from: 'from-rose-500', to: 'to-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' }
  };
  
  const key = nama?.toLowerCase() || '';
  for (const [k, v] of Object.entries(colorMap)) {
    if (key.includes(k)) {
      return v;
    }
  }
  return { from: 'from-gray-500', to: 'to-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' };
};

// Fungsi untuk mendapatkan jadwal dari pertemuan
const getScheduleFromPertemuan = (pertemuan) => {
  if (!pertemuan || pertemuan.length === 0) return 'Belum ada jadwal';
  
  const days = pertemuan.map(p => {
    if (p.tanggal) {
      const date = new Date(p.tanggal);
      return date.toLocaleDateString('id-ID', { weekday: 'long' });
    }
    return null;
  }).filter(Boolean);
  
  const uniqueDays = [...new Set(days)];
  if (uniqueDays.length === 0) return 'Jadwal belum diatur';
  if (uniqueDays.length === 1) return uniqueDays[0];
  return uniqueDays.slice(0, 2).join(' & ');
};

// Fungsi untuk mendapatkan materi dari pertemuan
const getTopicsFromPertemuan = (pertemuan) => {
  if (!pertemuan || pertemuan.length === 0) return ['Belum ada materi'];
  
  const topics = pertemuan.map(p => p.judul).filter(Boolean);
  if (topics.length === 0) return ['Belum ada materi'];
  
  return topics.slice(0, 5);
};

const MataPelajaran = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [kelasInfo, setKelasInfo] = useState({
    nama: 'Kelas 3 Dewi Sartika',
    kode: '3_dewi_sartika'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // Ambil data dari database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const mapelRef = collection(db, 'mata_pelajaran');
        
        const q = query(
          mapelRef,
          where('kelas', '==', '3_dewi_sartika')
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError('Belum ada mata pelajaran untuk Kelas 3 Dewi Sartika');
          setIsLoading(false);
          return;
        }
        
        const mapelList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          mapelList.push({
            id: doc.id,
            ...data
          });
        });
        
        // Sorting di client side
        mapelList.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });
        
        // Proses data untuk ditampilkan
        const processedSubjects = mapelList.map((item) => {
          const colors = getColorForSubject(item.nama);
          const icon = getIconForSubject(item.nama);
          const pertemuan = item.pertemuan || [];
          const schedule = getScheduleFromPertemuan(pertemuan);
          const topics = getTopicsFromPertemuan(pertemuan);
          const totalPertemuan = pertemuan.length;
          
          // Ambil nama kelas dari data
          const namaKelas = item.namaKelas || 'Kelas 3 Dewi Sartika';
          
          return {
            id: item.id,
            name: item.nama || 'Mata Pelajaran',
            icon: icon,
            color: colors,
            bgColor: colors.bg,
            borderColor: colors.border,
            textColor: colors.text,
            description: item.deskripsi || 'Tidak ada deskripsi',
            teacher: item.createdBy || 'Wali Kelas',
            schedule: schedule,
            topics: topics,
            totalPertemuan: totalPertemuan,
            path: `/3-dewi-sartika/mata-pelajaran/${item.nama?.toLowerCase().replace(/\s+/g, '-') || item.id}`,
            pertemuan: pertemuan,
            // Simpan data kelas
            namaKelas: namaKelas,
            kelas: item.kelas
          };
        });
        
        // Set kelas info dari data pertama
        if (processedSubjects.length > 0) {
          setKelasInfo({
            nama: processedSubjects[0].namaKelas || 'Kelas 3 Dewi Sartika',
            kode: processedSubjects[0].kelas || '3_dewi_sartika'
          });
        }
        
        setSubjects(processedSubjects);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.code === 'permission-denied') {
          setError('Tidak dapat mengakses database. Periksa aturan keamanan Firestore.');
        } else {
          setError('Gagal memuat data: ' + error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fungsi preview
  const openPreview = (title, link, type) => {
    if (!link) return;
    setPreviewData({
      title: title,
      link: link,
      type: type
    });
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  // Render Preview Modal
  const renderPreview = () => {
    if (!showPreview || !previewData) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h3 className="text-lg font-bold text-gray-800">{previewData.title}</h3>
              <p className="text-xs text-gray-500">
                {previewData.type === 'bahanAjar' ? '📎 Bahan Ajar' : '📄 LKPD'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={previewData.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Buka di Tab Baru
              </a>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="p-4 h-[70vh] bg-gray-100">
            <iframe
              src={previewData.link}
              className="w-full h-full rounded-lg border border-gray-200 bg-white"
              title={previewData.title}
              allow="autoplay; encrypted-media; fullscreen"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
            />
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="text-center">
          <Loader className="w-16 h-16 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-500">Memuat data mata pelajaran...</p>
          <p className="text-xs text-gray-400 mt-2">{kelasInfo.nama}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (subjects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Belum Ada Mata Pelajaran</h2>
          <p className="text-gray-600 mb-2">Untuk {kelasInfo.nama}</p>
          <p className="text-gray-500 text-sm">Data mata pelajaran akan muncul setelah diinput oleh wali kelas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-700">
                  Mata Pelajaran
                </span>
                <span className="block text-xs text-orange-600 font-medium">
                  {kelasInfo.nama}
                </span>
              </div>
            </Link>
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
            <School className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">{kelasInfo.nama}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-4">
            Mata Pelajaran <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600">Kelas 3</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Daftar lengkap mata pelajaran untuk {kelasInfo.nama}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {subjects.length} Mata Pelajaran • Total {subjects.reduce((acc, s) => acc + s.totalPertemuan, 0)} Pertemuan
          </p>
        </div>

        {/* Grid Mata Pelajaran */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => {
            const isSelected = selectedSubject === subject.id;
            const colors = subject.color;
            
            return (
              <div
                key={subject.id}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer ${
                  isSelected 
                    ? `border-orange-400 shadow-lg` 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => setSelectedSubject(isSelected ? null : subject.id)}
              >
                {/* Icon */}
                <div className={`bg-gradient-to-br ${colors.from} ${colors.to} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-3xl">{subject.icon}</span>
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">{subject.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{subject.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-xs px-3 py-1 ${subject.bgColor} ${subject.textColor} rounded-full font-medium`}>
                    📅 {subject.schedule}
                  </span>
                  <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                    📖 {subject.totalPertemuan} pertemuan
                  </span>
                </div>

                {/* Link ke halaman detail */}
                <Link
                  to={subject.path}
                  className={`flex items-center space-x-1 text-sm ${subject.textColor} font-medium group-hover:translate-x-2 transition-transform`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Lihat Detail</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                {/* Expanded Details */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 animate-fadeIn">
                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span>Jadwal: {subject.schedule}</span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span>{subject.teacher}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span>Materi:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {subject.topics.map((topic, index) => (
                          <span 
                            key={index} 
                            className={`text-xs px-3 py-1 ${subject.bgColor} ${subject.textColor} rounded-full`}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    {subject.totalPertemuan > 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        Total {subject.totalPertemuan} pertemuan tersedia
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm border-t border-gray-200 pt-6">
          <p>📚 Data mata pelajaran dari {kelasInfo.nama}</p>
          <p className="mt-1">SDS Harapan Sejahtera • {kelasInfo.nama}</p>
          <p className="mt-1 text-xs text-gray-300">
            Data tersimpan di Firebase Firestore
          </p>
        </div>
      </div>

      {/* Preview Modal */}
      {renderPreview()}

      {/* Custom CSS */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MataPelajaran;