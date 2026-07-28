import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  BookOpen, 
  Users, 
  School, 
  Sparkles,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Home,
  Book,
  Star,
  Award,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage6Hatta = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
      menuSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const menuItems = [
    { 
      id: 'jadwal', 
      icon: Calendar, 
      label: 'Jadwal', 
      color: 'from-blue-400 to-blue-600',
      path: '/6-hatta/jadwal',
      description: 'Lihat jadwal pelajaran harian dan mingguan Kelas 6 Hatta'
    },
    { 
      id: 'mata-pelajaran', 
      icon: BookOpen, 
      label: 'Mata Pelajaran', 
      color: 'from-cyan-400 to-blue-500',
      path: '/6-hatta/mata-pelajaran',
      description: 'Daftar lengkap mata pelajaran dan materi pembelajaran semester ini'
    },
    { 
      id: 'daftar-hadir', 
      icon: Users, 
      label: 'Daftar Hadir', 
      color: 'from-indigo-400 to-blue-600',
      path: '/6-hatta/daftar-hadir',
      description: 'Cek kehadiran siswa dan rekap absensi kelas secara real-time'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-blue-50/90 backdrop-blur-lg shadow-lg' : 'bg-blue-50/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <School className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold text-gray-700">
                Kelas 6 Hatta
              </span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="group relative flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Beranda</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="group relative flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-blue-100 transition-colors"
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
          <div className="md:hidden bg-blue-50/95 backdrop-blur-lg border-t border-blue-100">
            <div className="px-4 py-4 space-y-2">
              <Link
                to="/"
                className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Beranda</span>
              </Link>
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Tahun Ajaran 2026</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-700 mb-6 leading-tight">
              Selamat Datang di
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 animate-gradient">
                Kelas 6 Hatta
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto mb-10 leading-relaxed">
              Dengan integritas dan kebijaksanaan, 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold"> wujudkan cita-cita bangsa</span>
            </p>

            {/* Tombol Menu Utama */}
            <button
              onClick={scrollToMenu}
              className="group relative inline-flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1"
            >
              <span>Menu Utama</span>
              <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Cards Section */}
      <div id="menu-section" className="relative py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-4">
              Menu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Utama</span>
            </h2>
            <p className="text-gray-400 text-lg">Akses fitur-fitur penting Kelas 6 Hatta</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className="group relative"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-blue-100 hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
                    <div className={`bg-gradient-to-br ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">{item.label}</h3>
                    <p className="text-gray-500 mb-6 leading-relaxed">{item.description}</p>
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                      <span className="font-medium">Lihat {item.label}</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Tombol ke Portal */}
          <div className="text-center mt-12">
            <Link to="/">
              <button className="group inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/25 hover:-translate-y-1">
                <Home className="w-5 h-5" />
                <span>Ke Portal Kelas</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-blue-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <School className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-600 font-medium">Kelas 6 Hatta</span>
            </div>
            <div className="text-gray-400 text-sm">
              Dev by Khoyrur Roykhan
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage6Hatta;