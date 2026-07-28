import React, { useState } from 'react';
import {
  ChevronLeft,
  School,
  Users,
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Award,
  ArrowRight,
  Menu,
  X,
  Home,
  User,
  Settings,
  Star,
  Crown,
  Book,
  Globe,
  Microscope,
  Palette,
  Heart,
  Shield,
  Mosque,
  Calculator,
  MapPin,
  UserCircle,
  BadgeCheck,
  Sparkles,
  Info,
  HeartHandshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Portal = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredClass, setHoveredClass] = useState(null);

  const classes = [
    {
      id: 1,
      grade: '1',
      name: 'P. Antasari',
      fullName: 'Kelas 1 P. Antasari',
      waliKelas: 'RESTU GUSTI MAISA, S.Pd.',
      students: 24,
      room: '1A',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      icon: Star,
      path: '/1-p-antasari'
    },
    {
      id: 2,
      grade: '1',
      name: 'P. Diponegoro',
      fullName: 'Kelas 1 P. Diponegoro',
      waliKelas: 'RISFI MAZIDATUL WAFDAH, S.Pd.',
      students: 24,
      room: '1B',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      icon: Star,
      path: '/1-p-diponegoro'
    },
    {
      id: 3,
      grade: '1',
      name: 'Tjilik Riwut',
      fullName: 'Kelas 1 Tjilik Riwut',
      waliKelas: 'MALINDA AYU NINGTIAS, S.Pd.',
      students: 24,
      room: '1C',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      icon: Star,
      path: '/1-tjilik-riwut'
    },
    {
      id: 4,
      grade: '2',
      name: 'Dr. Wahidin',
      fullName: 'Kelas 2 Dr. Wahidin',
      waliKelas: 'ANDRI KURNIAWAN, S.Pd.',
      students: 29,
      room: '2A',
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-600',
      icon: Book,
      path: '/2-dr-wahidin'
    },
    {
      id: 5,
      grade: '2',
      name: 'Dr. Soetomo',
      fullName: 'Kelas 2 Dr. Soetomo',
      waliKelas: 'AHIKAMTUN HAYU PUSPORINI, S.Pd.',
      students: 29,
      room: '2B',
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-600',
      icon: Book,
      path: '/2-dr-soetomo'
    },
    {
      id: 6,
      grade: '3',
      name: 'Dewi Sartika',
      fullName: 'Kelas 3 Dewi Sartika',
      waliKelas: 'KHOYRUR ROYKHAN, S.Pd.',
      students: 26,
      room: '3A',
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-600',
      icon: Crown,
      path: '/3-dewi-sartika'
    },
    {
      id: 7,
      grade: '3',
      name: 'R.A. Kartini',
      fullName: 'Kelas 3 R.A. Kartini',
      waliKelas: 'SUPIANSYAH, S.Pd. I',
      students: 27,
      room: '3B',
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-600',
      icon: Crown,
      path: '/3-ra-kartini'
    },
    {
      id: 8,
      grade: '4',
      name: 'Tan Malaka',
      fullName: 'Kelas 4 Tan Malaka',
      waliKelas: 'ISTAFAT DIFLATUL KHASANAH, S.Pd.',
      students: 26,
      room: '4A',
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-600',
      icon: Globe,
      path: '/4-tan-malaka'
    },
    {
      id: 9,
      grade: '4',
      name: 'Wahid Hasyim',
      fullName: 'Kelas 4 Wahid Hasyim',
      waliKelas: 'ISTAFAT DIFLATUL KHASANAH, S.Pd.',
      students: 25,
      room: '4B',
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-600',
      icon: Globe,
      path: '/4-wahid-hasyim'
    },
    {
      id: 10,
      grade: '5',
      name: 'Cut Meutia',
      fullName: 'Kelas 5 Cut Meutia',
      waliKelas: 'RIKA MARYANTI, S.Pd.',
      students: 19,
      room: '5A',
      color: 'from-pink-500 to-pink-700',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-600',
      icon: Sparkles,
      path: '/5-cut-meutia'
    },
    {
      id: 11,
      grade: '5',
      name: 'Cut Nyak Dien',
      fullName: 'Kelas 5 Cut Nyak Dien',
      waliKelas: 'RIKA MARYANTI, S.Pd.',
      students: 22,
      room: '5B',
      color: 'from-pink-500 to-pink-700',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-600',
      icon: Sparkles,
      path: '/5-cut-nyak-dien'
    },
    {
      id: 12,
      grade: '6',
      name: 'Soekarno',
      fullName: 'Kelas 6 Soekarno',
      waliKelas: 'MUHAMAD HANIF, S.Pd.',
      students: 24,
      room: '6A',
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-600',
      icon: Award,
      path: '/6-soekarno'
    },
    {
      id: 13,
      grade: '6',
      name: 'Hatta',
      fullName: 'Kelas 6 Hatta',
      waliKelas: 'RIZKY HERMAWAN, S.Pd.',
      students: 24,
      room: '6B',
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-600',
      icon: Award,
      path: '/6-hatta'
    }
  ];

  // Group classes by grade
  const groupedClasses = classes.reduce((acc, cls) => {
    if (!acc[cls.grade]) {
      acc[cls.grade] = [];
    }
    acc[cls.grade].push(cls);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <School className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-700">SiManLas Harta</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                Beranda
              </Link>
              <Link to="/login-admin" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                Admin
              </Link>
              <Link 
                to="/" 
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </Link>
            </div>

            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100">
            <div className="px-4 py-3 space-y-2">
              <Link to="/" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-blue-50 text-sm">
                <Home className="w-4 h-4" />
                <span>Beranda</span>
              </Link>
              <Link to="/admin" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-blue-50 text-sm">
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <HeartHandshake className="w-10 h-10 text-white/80" />
            <h1 className="text-4xl md:text-5xl font-bold">
              SiManLas Harta
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-4">
            Sistem Informasi Manajemen Kelas dan Pembelajaran
          </p>
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-start space-x-3 text-left">
              <Info className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-50 leading-relaxed">
                Aplikasi ini digunakan untuk membantu orang tua dalam mengajari anak di rumah. 
                Materi pembelajaran <span className="font-semibold">diupdate setiap hari</span> oleh guru 
                sehingga orang tua dapat memantau dan mendampingi proses belajar anak dengan lebih mudah.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <span className="inline-flex items-center px-4 py-1.5 bg-white/20 rounded-full text-sm">
              📚 SDS Harapan Sejahtera
            </span>
            <span className="inline-flex items-center px-4 py-1.5 bg-white/20 rounded-full text-sm">
              🏫 2026-2027
            </span>
          </div>
        </div>
      </div>

      {/* Daftar Kelas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {Object.keys(groupedClasses).map((grade) => (
          <div key={grade} className="mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className={`w-12 h-1 rounded-full bg-gradient-to-r ${
                grade === '1' ? 'from-blue-400 to-blue-600' :
                grade === '2' ? 'from-green-400 to-green-600' :
                grade === '3' ? 'from-purple-400 to-purple-600' :
                grade === '4' ? 'from-orange-400 to-orange-600' :
                grade === '5' ? 'from-pink-400 to-pink-600' :
                'from-red-400 to-red-600'
              }`}></div>
              <h2 className="text-2xl font-bold text-gray-700">Kelas {grade}</h2>
              <div className={`w-12 h-1 rounded-full bg-gradient-to-l ${
                grade === '1' ? 'from-blue-400 to-blue-600' :
                grade === '2' ? 'from-green-400 to-green-600' :
                grade === '3' ? 'from-purple-400 to-purple-600' :
                grade === '4' ? 'from-orange-400 to-orange-600' :
                grade === '5' ? 'from-pink-400 to-pink-600' :
                'from-red-400 to-red-600'
              }`}></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {groupedClasses[grade].map((cls) => {
                const Icon = cls.icon;
                return (
                  <Link
                    key={cls.id}
                    to={cls.path}
                    className="group relative bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-300 text-center"
                    onMouseEnter={() => setHoveredClass(cls.id)}
                    onMouseLeave={() => setHoveredClass(null)}
                  >
                    {/* Badge */}
                    {/* <div className="absolute top-3 right-3">
                      <span className={`text-xs px-2.5 py-1 ${cls.bgColor} ${cls.textColor} rounded-full font-medium`}>
                        {cls.room}
                      </span>
                    </div> */}

                    {/* Icon */}
                    <div className={`bg-gradient-to-br ${cls.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Nama Kelas */}
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {cls.name}
                    </h3>
                    
                    {/* Wali Kelas */}
                    <div className="flex items-center justify-center space-x-1.5 text-sm text-gray-500 mb-3">
                      <UserCircle className="w-4 h-4 text-gray-400" />
                      <span>{cls.waliKelas}</span>
                    </div>

                    {/* Info tambahan */}
                    <div className="flex justify-center items-center space-x-4 text-xs text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{cls.students} Siswa</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{cls.room}</span>
                      </span>
                    </div>

                    {/* Hover Effect - Link Detail */}
                    <div className={`mt-4 pt-4 border-t border-gray-100 transition-all duration-300 ${
                      hoveredClass === cls.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <span className={`inline-flex items-center space-x-1 text-sm font-medium ${cls.textColor} group-hover:translate-x-1 transition-transform`}>
                        <span>Lihat Kelas</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-100 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center">
            <div className="flex items-center space-x-3 mb-3 md:mb-0">
              <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <School className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600 font-medium">SiManLas Harta</span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">SDS Harapan Sejahtera</span>
            </div>
            <div className="text-xs text-gray-400">
              © 2026 SiManLas Harta • Pangkalan Banteng, Juli 2026
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portal;