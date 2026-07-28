import React, { useState } from 'react';
import {
  ChevronLeft,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Calendar,
  FolderTree,
  FileText,
  Link as LinkIcon,
  Eye,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  Save,
  Download,
  Upload,
  Settings,
  Users,
  School,
  Calculator,
  Book,
  Globe,
  Microscope,
  Palette,
  Heart,
  Shield,
  Mosque
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
  // State untuk navigasi
  const [selectedMapel, setSelectedMapel] = useState(null);
  const [selectedPertemuan, setSelectedPertemuan] = useState(null);
  const [selectedBab, setSelectedBab] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'mapel', 'pertemuan', 'bab', 'subbab'
  const [editingItem, setEditingItem] = useState(null);

  // State untuk form
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    tanggal: '',
    bab: '',
    subBab: '',
    linkDrive: '',
    materi: ''
  });

  // Data awal - semua mata pelajaran dengan pertemuan kosong
  const [data, setData] = useState({
    mapel: [
      {
        id: 1,
        nama: 'Matematika',
        deskripsi: 'Mempelajari konsep bilangan, operasi hitung, geometri, dan pengukuran',
        icon: '📐',
        pertemuan: []
      },
      {
        id: 2,
        nama: 'Bahasa Indonesia',
        deskripsi: 'Mengembangkan kemampuan berbahasa dan bersastra Indonesia',
        icon: '📚',
        pertemuan: []
      },
      {
        id: 3,
        nama: 'Bahasa Inggris',
        deskripsi: 'Mempelajari bahasa Inggris dasar untuk komunikasi sehari-hari',
        icon: '🌍',
        pertemuan: []
      },
      {
        id: 4,
        nama: 'IPAS',
        deskripsi: 'Ilmu Pengetahuan Alam dan Sosial - Memahami alam dan lingkungan sosial',
        icon: '🔬',
        pertemuan: []
      },
      {
        id: 5,
        nama: 'SBdP',
        deskripsi: 'Seni Budaya dan Prakarya - Mengembangkan kreativitas dan apresiasi seni',
        icon: '🎨',
        pertemuan: []
      },
      {
        id: 6,
        nama: 'PLKS',
        deskripsi: 'Pendidikan Lingkungan dan Kesehatan Sekolah - Menjaga kebersihan dan kesehatan',
        icon: '❤️',
        pertemuan: []
      },
      {
        id: 7,
        nama: 'Pendidikan Pancasila',
        deskripsi: 'Mempelajari nilai-nilai Pancasila dan karakter kebangsaan',
        icon: '🛡️',
        pertemuan: []
      },
      {
        id: 8,
        nama: 'Agama',
        deskripsi: 'Pendidikan Agama Islam - Mempelajari ajaran Islam dan akhlak mulia',
        icon: '🕌',
        pertemuan: []
      }
    ]
  });

  // Fungsi CRUD
  const handleAdd = (type, parentId = null) => {
    setModalType(type);
    setEditingItem(null);
    setFormData({
      nama: '',
      deskripsi: '',
      tanggal: '',
      bab: '',
      subBab: '',
      linkDrive: '',
      materi: ''
    });
    setShowModal(true);
  };

  const handleEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setFormData({
      nama: item.nama || '',
      deskripsi: item.deskripsi || '',
      tanggal: item.tanggal || '',
      bab: item.nama || '',
      subBab: item.nama || '',
      linkDrive: item.linkDrive || '',
      materi: item.materi || ''
    });
    setShowModal(true);
  };

  const handleDelete = (type, id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      // Logic delete
      console.log(`Delete ${type} with id ${id}`);
    }
  };

  const handleSave = () => {
    // Logic save
    console.log('Saving:', formData);
    setShowModal(false);
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Render modal
  const renderModal = () => {
    if (!showModal) return null;

    const getTitle = () => {
      switch(modalType) {
        case 'mapel': return `${editingItem ? 'Edit' : 'Tambah'} Mata Pelajaran`;
        case 'pertemuan': return `${editingItem ? 'Edit' : 'Tambah'} Pertemuan`;
        case 'bab': return `${editingItem ? 'Edit' : 'Tambah'} Bab`;
        case 'subbab': return `${editingItem ? 'Edit' : 'Tambah'} Sub Bab`;
        default: return 'Form';
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">{getTitle()}</h3>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="space-y-4">
              {(modalType === 'mapel' || modalType === 'bab' || modalType === 'subbab') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Masukkan nama"
                    required
                  />
                </div>
              )}

              {modalType === 'mapel' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Masukkan deskripsi"
                  />
                </div>
              )}

              {modalType === 'pertemuan' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Pertemuan</label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Masukkan judul pertemuan"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              {modalType === 'subbab' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link Drive</label>
                    <input
                      type="url"
                      value={formData.linkDrive}
                      onChange={(e) => setFormData({...formData, linkDrive: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="https://drive.google.com/file/d/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Materi</label>
                    <textarea
                      value={formData.materi}
                      onChange={(e) => setFormData({...formData, materi: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows="4"
                      placeholder="Masukkan materi pembelajaran"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Save className="w-5 h-5 inline mr-2" />
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Render tree view
  const renderTree = () => {
    return (
      <div className="space-y-4">
        {data.mapel.map((mapel) => (
          <div key={mapel.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header Mata Pelajaran */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-rose-50 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleExpand(`mapel-${mapel.id}`)}
                  className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                >
                  {expandedItems[`mapel-${mapel.id}`] ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <span className="text-2xl">{mapel.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-800">{mapel.nama}</h3>
                  <p className="text-sm text-gray-500">{mapel.deskripsi}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAdd('pertemuan')}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Tambah Pertemuan"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEdit('mapel', mapel)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit Mapel"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete('mapel', mapel.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Mapel"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Pertemuan */}
            {expandedItems[`mapel-${mapel.id}`] && (
              <div className="p-4">
                {mapel.pertemuan.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex p-4 bg-gray-50 rounded-full mb-3">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Belum ada pertemuan</p>
                    <button
                      onClick={() => handleAdd('pertemuan')}
                      className="mt-3 inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Pertemuan</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mapel.pertemuan.map((pertemuan) => (
                      <div key={pertemuan.id} className="border border-gray-100 rounded-lg">
                        <div className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleExpand(`pertemuan-${pertemuan.id}`)}
                              className="p-1 hover:bg-white rounded-lg transition-colors"
                            >
                              {expandedItems[`pertemuan-${pertemuan.id}`] ? (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <div>
                              <span className="font-medium text-gray-800">{pertemuan.judul}</span>
                              <span className="text-sm text-gray-500 ml-2">
                                {new Date(pertemuan.tanggal).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleAdd('bab')}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Tambah Bab"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit('pertemuan', pertemuan)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Pertemuan"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete('pertemuan', pertemuan.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus Pertemuan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Bab */}
                        {expandedItems[`pertemuan-${pertemuan.id}`] && (
                          <div className="p-3 space-y-3">
                            {pertemuan.bab && pertemuan.bab.length === 0 ? (
                              <div className="text-center py-4">
                                <p className="text-sm text-gray-400">Belum ada bab</p>
                                <button
                                  onClick={() => handleAdd('bab')}
                                  className="mt-2 inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Tambah Bab</span>
                                </button>
                              </div>
                            ) : (
                              pertemuan.bab.map((bab) => (
                                <div key={bab.id} className="border-l-2 border-orange-300 pl-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <button
                                        onClick={() => toggleExpand(`bab-${bab.id}`)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                      >
                                        {expandedItems[`bab-${bab.id}`] ? (
                                          <ChevronDown className="w-4 h-4 text-gray-600" />
                                        ) : (
                                          <ChevronRight className="w-4 h-4 text-gray-600" />
                                        )}
                                      </button>
                                      <FolderTree className="w-4 h-4 text-purple-500" />
                                      <span className="font-medium text-gray-700">{bab.nama}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleAdd('subbab')}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Tambah Sub Bab"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleEdit('bab', bab)}
                                        className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Edit Bab"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDelete('bab', bab.id)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Hapus Bab"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Sub Bab */}
                                  {expandedItems[`bab-${bab.id}`] && (
                                    <div className="mt-3 space-y-3 ml-6">
                                      {bab.subBab && bab.subBab.length === 0 ? (
                                        <div className="text-center py-3">
                                          <p className="text-sm text-gray-400">Belum ada sub bab</p>
                                          <button
                                            onClick={() => handleAdd('subbab')}
                                            className="mt-2 inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                          >
                                            <Plus className="w-3 h-3" />
                                            <span>Tambah Sub Bab</span>
                                          </button>
                                        </div>
                                      ) : (
                                        bab.subBab.map((sub) => (
                                          <div key={sub.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                            <div className="flex items-start justify-between">
                                              <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                  <FileText className="w-4 h-4 text-green-500" />
                                                  <span className="font-medium text-gray-700">{sub.nama}</span>
                                                </div>
                                                {sub.materi && (
                                                  <p className="text-sm text-gray-600 mt-1 ml-6">{sub.materi}</p>
                                                )}
                                                {sub.linkDrive && (
                                                  <div className="mt-2 ml-6">
                                                    <a
                                                      href={sub.linkDrive}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                                    >
                                                      <LinkIcon className="w-4 h-4" />
                                                      <span>Lihat Materi</span>
                                                      <Eye className="w-4 h-4" />
                                                    </a>
                                                    <div className="mt-2">
                                                      <iframe
                                                        src={sub.linkDrive}
                                                        className="w-full h-48 rounded-lg border border-gray-200"
                                                        title={sub.nama}
                                                      />
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <div className="flex items-center space-x-2 ml-4">
                                                <button
                                                  onClick={() => handleEdit('subbab', sub)}
                                                  className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                  title="Edit Sub Bab"
                                                >
                                                  <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                  onClick={() => handleDelete('subbab', sub.id)}
                                                  className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                  title="Hapus Sub Bab"
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ))}
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-700">Admin Panel</span>
                <span className="block text-xs text-gray-400">Manajemen Mata Pelajaran</span>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manajemen Mata Pelajaran
            </h1>
            <p className="text-gray-500 mt-1">Kelola semua mata pelajaran, pertemuan, dan materi pembelajaran</p>
          </div>
          <button
            onClick={() => handleAdd('mapel')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Mapel</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Mapel</p>
                <p className="text-2xl font-bold text-gray-800">{data.mapel.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pertemuan</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.mapel.reduce((acc, m) => acc + m.pertemuan.length, 0)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bab</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.mapel.reduce((acc, m) => 
                    acc + m.pertemuan.reduce((a, p) => a + (p.bab ? p.bab.length : 0), 0), 0
                  )}
                </p>
              </div>
              <FolderTree className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sub Bab</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.mapel.reduce((acc, m) => 
                    acc + m.pertemuan.reduce((a, p) => 
                      a + (p.bab ? p.bab.reduce((b, bab) => b + (bab.subBab ? bab.subBab.length : 0), 0) : 0), 0), 0
                  )}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Tree View */}
        {renderTree()}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>© 2026 Admin Panel - Sistem Informasi Manajemen Kelas 3</p>
          <p className="mt-1">SDS Harapan Sejahtera</p>
        </div>
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default Admin;