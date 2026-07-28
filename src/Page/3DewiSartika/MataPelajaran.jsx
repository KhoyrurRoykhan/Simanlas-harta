import React, { useState } from 'react';
import { 
  ChevronLeft,
  BookOpen,
  Calculator,
  Book,
  Globe,
  Microscope,
  Palette,
  Heart,
  Shield,
  Mosque,
  Star,
  Clock,
  Users,
  Award,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MataPelajaran = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = [
    {
      id: 1,
      name: 'Matematika',
      icon: Calculator,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      description: 'Mempelajari konsep bilangan, operasi hitung, geometri, dan pengukuran',
      teacher: 'Bapak/Ibu Guru Matematika',
      schedule: 'Senin & Selasa',
      topics: ['Bilangan Cacah', 'Operasi Hitung', 'Pecahan', 'Geometri', 'Pengukuran'],
      path: '/3-dewi-sartika/mata-pelajaran/matematika'
    },
    {
      id: 2,
      name: 'Bahasa Indonesia',
      icon: Book,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-600',
      description: 'Mengembangkan kemampuan berbahasa dan bersastra Indonesia',
      teacher: 'Bapak/Ibu Guru Bahasa Indonesia',
      schedule: 'Selasa & Rabu',
      topics: ['Membaca', 'Menulis', 'Berbicara', 'Tata Bahasa', 'Kesusastraan'],
      path: '/3-dewi-sartika/mata-pelajaran/bahasa-indonesia'
    },
    {
      id: 3,
      name: 'Bahasa Inggris',
      icon: Globe,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-600',
      description: 'Mempelajari bahasa Inggris dasar untuk komunikasi sehari-hari',
      teacher: 'Bapak/Ibu Guru Bahasa Inggris',
      schedule: 'Senin & Jumat',
      topics: ['Vocabulary', 'Grammar', 'Speaking', 'Reading', 'Writing'],
      path: '/3-dewi-sartika/mata-pelajaran/bahasa-inggris'
    },
    {
      id: 4,
      name: 'IPAS',
      icon: Microscope,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-600',
      description: 'Ilmu Pengetahuan Alam dan Sosial - Memahami alam dan lingkungan sosial',
      teacher: 'Bapak/Ibu Guru IPAS',
      schedule: 'Selasa & Kamis',
      topics: ['Makhluk Hidup', 'Lingkungan', 'Sumber Daya Alam', 'Sosial Budaya', 'Sejarah'],
      path: '/3-dewi-sartika/mata-pelajaran/ipas'
    },
    {
      id: 5,
      name: 'SBdP',
      icon: Palette,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-600',
      description: 'Seni Budaya dan Prakarya - Mengembangkan kreativitas dan apresiasi seni',
      teacher: 'Bapak/Ibu Guru SBdP',
      schedule: 'Rabu',
      topics: ['Seni Rupa', 'Seni Musik', 'Seni Tari', 'Prakarya', 'Kerajinan Tangan'],
      path: '/3-dewi-sartika/mata-pelajaran/sbdp'
    },
    {
      id: 6,
      name: 'PLKS',
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-600',
      description: 'Pendidikan Lingkungan dan Kesehatan Sekolah - Menjaga kebersihan dan kesehatan',
      teacher: 'Bapak/Ibu Guru PLKS',
      schedule: 'Senin',
      topics: ['Kebersihan Diri', 'Lingkungan Sekolah', 'Kesehatan', 'Gizi', 'Pola Hidup Sehat'],
      path: '/3-dewi-sartika/mata-pelajaran/plks'
    },
    {
      id: 7,
      name: 'Pendidikan Pancasila',
      icon: Shield,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-600',
      description: 'Mempelajari nilai-nilai Pancasila dan karakter kebangsaan',
      teacher: 'Bapak/Ibu Guru Pendidikan Pancasila',
      schedule: 'Jumat',
      topics: ['Pancasila', 'Bhineka Tunggal Ika', 'Hak dan Kewajiban', 'Karakter', 'Kewarganegaraan'],
      path: '/3-dewi-sartika/mata-pelajaran/pendidikan-pancasila'
    },
    {
      id: 8,
      name: 'Agama',
      icon: Mosque,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-600',
      description: 'Pendidikan Agama Islam - Mempelajari ajaran Islam dan akhlak mulia',
      teacher: 'Bapak/Ibu Guru Agama',
      schedule: 'Rabu',
      topics: ['Al-Quran', 'Hadits', 'Akhlak', 'Ibadah', 'Sejarah Islam'],
      path: '/3-dewi-sartika/mata-pelajaran/agama'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Navbar */}
      <nav className="bg-amber-50/90 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-700">
                Mata Pelajaran
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-4">
            Mata Pelajaran <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600">Kelas 3</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Daftar lengkap mata pelajaran yang diajarkan di Kelas 3 Dewi Sartika & R.A. Kartini
          </p>
        </div>

        {/* Grid Mata Pelajaran */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            const isSelected = selectedSubject === subject.id;
            
            return (
              <Link
                key={subject.id}
                to={subject.path}
                className={`group relative bg-white/70 backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  isSelected 
                    ? `border-${subject.color.split(' ')[1].replace('to-', '')} shadow-lg` 
                    : 'border-orange-100 hover:border-orange-200'
                }`}
                onClick={() => setSelectedSubject(isSelected ? null : subject.id)}
              >
                {/* Icon */}
                <div className={`bg-gradient-to-br ${subject.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-gray-700 mb-2">{subject.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{subject.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-xs px-3 py-1 ${subject.bgColor} ${subject.textColor} rounded-full font-medium`}>
                    {subject.schedule}
                  </span>
                </div>

                {/* Link ke halaman detail */}
                <div className={`flex items-center space-x-1 text-sm ${subject.textColor} font-medium group-hover:translate-x-2 transition-transform`}>
                  <span>Lihat Detail</span>
                  <ChevronRight className="w-4 h-4" />
                </div>

                {/* Expanded Details */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-fadeIn">
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
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>📚 Kurikulum Merdeka • Semester I Tahun Ajaran 2026-2027</p>
          <p className="mt-1">SDS Harapan Sejahtera • Kelas 3 Dewi Sartika & R.A. Kartini</p>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default MataPelajaran;