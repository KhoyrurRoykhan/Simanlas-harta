import React, { useState } from 'react';
import { 
  Calendar, 
  BookOpen, 
  Users, 
  ChevronLeft,
  Download,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import jadwalKelas from '../../assets/JadwalKelas3.jpeg';
import jadwalPiket from '../../assets/JadwalPiket.png';

const JadwalPage = () => {
  const [activeTab, setActiveTab] = useState('pelajaran');
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = (imageUrl, filename) => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Navbar */}
      <nav className="bg-amber-50/90 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-700">
                Jadwal Kelas 3
              </span>
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
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTab('pelajaran')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'pelajaran'
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-white/70 text-gray-600 hover:bg-white/90 hover:shadow-md'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Jadwal Pelajaran</span>
          </button>
          <button
            onClick={() => setActiveTab('piket')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'piket'
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-white/70 text-gray-600 hover:bg-white/90 hover:shadow-md'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Jadwal Piket</span>
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-orange-100 p-6 shadow-lg">
          {activeTab === 'pelajaran' ? (
            // Jadwal Pelajaran
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700 flex items-center space-x-2">
                    <Calendar className="w-6 h-6 text-orange-500" />
                    <span>Jadwal Pelajaran</span>
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Kelas 3 Dewi Sartika & R.A. Kartini</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleZoom}
                    className="p-2 bg-white rounded-lg hover:bg-orange-50 transition-colors shadow-sm"
                    title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                  >
                    {isZoomed ? <ZoomOut className="w-5 h-5 text-gray-600" /> : <ZoomIn className="w-5 h-5 text-gray-600" />}
                  </button>
                  <button
                    onClick={handleRotate}
                    className="p-2 bg-white rounded-lg hover:bg-orange-50 transition-colors shadow-sm"
                    title="Rotate"
                  >
                    <RotateCw className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDownload(jadwalKelas, 'Jadwal_Kelas_3.jpeg')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Image Display */}
              <div className={`relative ${isZoomed ? 'fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4' : ''}`}>
                <div 
                  className={`relative group ${isZoomed ? 'max-w-5xl w-full' : ''}`}
                  style={isZoomed ? {} : { maxHeight: '700px', overflow: 'hidden' }}
                >
                  <img 
                    src={jadwalKelas}
                    alt="Jadwal Pelajaran Kelas 3"
                    className={`w-full object-contain rounded-xl shadow-lg border border-orange-100 transition-all duration-300 ${
                      isZoomed ? 'max-h-[90vh]' : ''
                    }`}
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      cursor: 'pointer'
                    }}
                    onClick={() => !isZoomed && handleZoom()}
                  />
                  
                  {/* Hover Overlay */}
                  {!isZoomed && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button 
                        onClick={handleZoom}
                        className="px-4 py-2 bg-white rounded-lg shadow-lg text-gray-700 font-medium hover:bg-orange-50 transition-colors"
                      >
                        <Eye className="w-5 h-5 inline mr-2" />
                        Lihat Fullscreen
                      </button>
                    </div>
                  )}

                  {/* Close button for zoomed mode */}
                  {isZoomed && (
                    <button
                      onClick={handleZoom}
                      className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                      <span className="text-2xl">✕</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center space-x-2 text-orange-600">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">Semester</span>
                  </div>
                  <p className="text-gray-600 mt-1">Semester I • 2026-2027</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center space-x-2 text-rose-600">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">Kelas</span>
                  </div>
                  <p className="text-gray-600 mt-1">3 Dewi Sartika & R.A. Kartini</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center space-x-2 text-amber-600">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-semibold">Status</span>
                  </div>
                  <p className="text-green-600 mt-1">✓ Aktif</p>
                </div>
              </div>
            </div>
          ) : (
            // Jadwal Piket
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700 flex items-center space-x-2">
                    <Users className="w-6 h-6 text-rose-500" />
                    <span>Jadwal Piket</span>
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Kelas 3 Dewi Sartika & R.A. Kartini</p>
                </div>
                <button
                  onClick={() => handleDownload(jadwalPiket, 'Jadwal_Piket.png')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>

              {/* Image Display for Piket */}
              <div className="relative group" style={{ maxHeight: '700px', overflow: 'hidden' }}>
                <img 
                  src={jadwalPiket}
                  alt="Jadwal Piket Kelas 3"
                  className="w-full object-contain rounded-xl shadow-lg border border-rose-100"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button 
                    onClick={() => window.open(jadwalPiket, '_blank')}
                    className="px-4 py-2 bg-white rounded-lg shadow-lg text-gray-700 font-medium hover:bg-rose-50 transition-colors"
                  >
                    <Eye className="w-5 h-5 inline mr-2" />
                    Lihat Fullscreen
                  </button>
                </div>
              </div>

              {/* Info Cards for Piket */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-xl p-4 border border-rose-100">
                  <div className="flex items-center space-x-2 text-rose-600">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">Jadwal</span>
                  </div>
                  <p className="text-gray-600 mt-1">Piket Harian</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-rose-100">
                  <div className="flex items-center space-x-2 text-rose-600">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">Kelas</span>
                  </div>
                  <p className="text-gray-600 mt-1">3 Dewi Sartika & R.A. Kartini</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-rose-100">
                  <div className="flex items-center space-x-2 text-amber-600">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-semibold">Status</span>
                  </div>
                  <p className="text-green-600 mt-1">✓ Aktif</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>📌 Jadwal dapat berubah sewaktu-waktu sesuai dengan kebijakan sekolah</p>
          <p className="mt-1">SDS Harapan Sejahtera • Pangkalan Banteng, Juli 2026</p>
        </div>
      </div>
    </div>
  );
};

export default JadwalPage;