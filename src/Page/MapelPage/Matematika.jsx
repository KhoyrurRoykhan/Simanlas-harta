import React, { useState } from 'react';
import {
  ChevronLeft,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Link as LinkIcon,
  Eye,
  ChevronDown,
  ChevronRight,
  Download,
  Play,
  File,
  Image,
  Video,
  FolderTree,
  Users,
  School,
  Star,
  Calculator
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Matematika = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedPertemuan, setSelectedPertemuan] = useState(null);

  // Data dummy - nanti akan diganti dengan data dari database
  const [data, setData] = useState({
    mapel: {
      id: 1,
      nama: 'Matematika',
      deskripsi: 'Mempelajari konsep bilangan, operasi hitung, geometri, dan pengukuran',
      icon: '📐',
      totalPertemuan: 0,
      totalBab: 0,
      totalSubBab: 0,
      pertemuan: [] // Kosong, nanti diisi dari database
    }
  });

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Render list pertemuan
  const renderPertemuanList = () => {
    if (data.mapel.pertemuan.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="inline-flex p-6 bg-blue-100 rounded-full mb-4">
            <Calculator className="w-16 h-16 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Belum Ada Pertemuan</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Pertemuan akan segera ditambahkan. Silakan cek kembali nanti.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Segera hadir</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {data.mapel.pertemuan.map((pertemuan) => (
          <div key={pertemuan.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header Pertemuan */}
            <div 
              className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
              onClick={() => toggleExpand(`pertemuan-${pertemuan.id}`)}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{pertemuan.judul}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(pertemuan.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FolderTree className="w-3 h-3" />
                      <span>{pertemuan.bab ? pertemuan.bab.length : 0} Bab</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {expandedItems[`pertemuan-${pertemuan.id}`] ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Content Pertemuan */}
            {expandedItems[`pertemuan-${pertemuan.id}`] && (
              <div className="p-4 space-y-4">
                {/* Bab List */}
                {pertemuan.bab && pertemuan.bab.length > 0 ? (
                  pertemuan.bab.map((bab) => (
                    <div key={bab.id} className="border-l-4 border-blue-300 pl-4">
                      <div 
                        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        onClick={() => toggleExpand(`bab-${bab.id}`)}
                      >
                        <div className="flex items-center space-x-3">
                          <FolderTree className="w-5 h-5 text-purple-500" />
                          <span className="font-semibold text-gray-700">{bab.nama}</span>
                          <span className="text-sm text-gray-400">
                            ({bab.subBab ? bab.subBab.length : 0} sub bab)
                          </span>
                        </div>
                        {expandedItems[`bab-${bab.id}`] ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>

                      {/* Sub Bab List */}
                      {expandedItems[`bab-${bab.id}`] && (
                        <div className="mt-3 space-y-3 ml-8">
                          {bab.subBab && bab.subBab.length > 0 ? (
                            bab.subBab.map((sub) => (
                              <div key={sub.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <FileText className="w-4 h-4 text-green-500" />
                                      <h4 className="font-medium text-gray-800">{sub.nama}</h4>
                                    </div>
                                    
                                    {/* Materi */}
                                    {sub.materi && (
                                      <div className="bg-white rounded-lg p-3 mb-3 border border-gray-100">
                                        <p className="text-sm text-gray-600 leading-relaxed">{sub.materi}</p>
                                      </div>
                                    )}

                                    {/* Link Drive */}
                                    {sub.linkDrive && (
                                      <div className="space-y-2">
                                        <a
                                          href={sub.linkDrive}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                          <LinkIcon className="w-4 h-4" />
                                          <span>Lihat Materi Lengkap</span>
                                          <Eye className="w-4 h-4" />
                                        </a>
                                        
                                        {/* Preview */}
                                        <div className="mt-2">
                                          <iframe
                                            src={sub.linkDrive}
                                            className="w-full h-64 rounded-lg border border-gray-200"
                                            title={sub.nama}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-gray-400">Belum ada sub bab</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400">Belum ada bab untuk pertemuan ini</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-700">Matematika</span>
                <span className="block text-xs text-gray-400">Kelas 3 Dewi Sartika</span>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                to="/mata-pelajaran" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Kembali</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-5xl">{data.mapel.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {data.mapel.nama}
              </h1>
              <p className="text-gray-500 mt-1">{data.mapel.deskripsi}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pertemuan</p>
                <p className="text-2xl font-bold text-gray-800">{data.mapel.totalPertemuan}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bab</p>
                <p className="text-2xl font-bold text-gray-800">{data.mapel.totalBab}</p>
              </div>
              <FolderTree className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sub Bab</p>
                <p className="text-2xl font-bold text-gray-800">{data.mapel.totalSubBab}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-2xl font-bold text-green-500">✓ Aktif</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Pertemuan List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-700 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>Daftar Pertemuan</span>
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{data.mapel.pertemuan.length} pertemuan</span>
            </div>
          </div>

          {renderPertemuanList()}
        </div>

        {/* Info Tambahan */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Guru Pengampu</p>
                <p className="font-semibold text-gray-700">Bapak/Ibu Guru Matematika</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <School className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Sekolah</p>
                <p className="font-semibold text-gray-700">SDS Harapan Sejahtera</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>© 2026 Matematika - Kelas 3 Dewi Sartika</p>
          <p className="mt-1">SDS Harapan Sejahtera</p>
        </div>
      </div>
    </div>
  );
};

export default Matematika;