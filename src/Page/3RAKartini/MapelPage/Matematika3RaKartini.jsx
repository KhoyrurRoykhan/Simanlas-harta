// src/pages/Matematika3RaKartini.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Eye,
  ChevronDown,
  ChevronRight,
  File,
  FolderTree,
  Users,
  School,
  Star,
  Calculator,
  Loader,
  AlertTriangle,
  FileSpreadsheet,
  ExternalLink,
  X
} from 'lucide-react';
import { db } from '../../../firebase/config';
import {
  collection,
  query,
  getDocs,
  where
} from 'firebase/firestore';

const Matematika3RaKartini = () => {
  const [data, setData] = useState({
    mapel: {
      id: null,
      nama: 'Matematika',
      deskripsi: '',
      icon: '📐',
      totalPertemuan: 0,
      pertemuan: [],
      createdBy: '',
      kelas: '',
      namaKelas: ''
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // ============================================
  // FUNGSI UTILITY GOOGLE DRIVE
  // ============================================

  const extractDriveFileId = (url) => {
    if (!url) return null;
    
    const cleanUrl = url.split('?')[0];
    
    const patterns = [
      { regex: /drive\.google\.com\/file\/d\/([^\/]+)/, type: 'file' },
      { regex: /drive\.google\.com\/open\?id=([^&]+)/, type: 'file' },
      { regex: /drive\.google\.com\/uc\?id=([^&]+)/, type: 'file' },
      { regex: /drive\.google\.com\/drive\/folders\/([^\/]+)/, type: 'folder' },
      { regex: /drive\.google\.com\/folderview\?id=([^&]+)/, type: 'folder' },
      { regex: /drive\.google\.com\/drive\/u\/\d+\/folders\/([^\/]+)/, type: 'folder' },
      { regex: /drive\.google\.com\/file\/d\/([^\/]+)\/edit/, type: 'file' },
      { regex: /drive\.google\.com\/d\/([^\/]+)/, type: 'file' },
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern.regex);
      if (match) {
        return {
          id: match[1],
          type: pattern.type
        };
      }
    }
    
    return null;
  };

  const convertDriveLink = (url, format = 'preview') => {
    if (!url) return null;
    
    const fileInfo = extractDriveFileId(url);
    if (!fileInfo) {
      return url;
    }
    
    const { id, type } = fileInfo;
    
    if (type === 'folder') {
      return `https://drive.google.com/drive/folders/${id}`;
    }
    
    switch (format) {
      case 'preview':
        return `https://drive.google.com/file/d/${id}/preview`;
      case 'view':
        return `https://drive.google.com/file/d/${id}/view`;
      case 'download':
        return `https://drive.google.com/uc?id=${id}&export=download`;
      case 'direct':
        return `https://drive.google.com/uc?export=view&id=${id}`;
      default:
        return `https://drive.google.com/file/d/${id}/view`;
    }
  };

  const getDriveLinks = (url) => {
    if (!url) return null;
    
    const fileInfo = extractDriveFileId(url);
    if (!fileInfo) {
      return {
        original: url,
        type: 'external'
      };
    }
    
    const { id, type } = fileInfo;
    
    if (type === 'folder') {
      return {
        original: url,
        folder: `https://drive.google.com/drive/folders/${id}`,
        type: 'folder',
        id: id
      };
    }
    
    return {
      original: url,
      preview: `https://drive.google.com/file/d/${id}/preview`,
      view: `https://drive.google.com/file/d/${id}/view`,
      download: `https://drive.google.com/uc?id=${id}&export=download`,
      direct: `https://drive.google.com/uc?export=view&id=${id}`,
      type: 'file',
      id: id
    };
  };

  const isGoogleDriveLink = (url) => {
    if (!url) return false;
    return url.includes('drive.google.com') || url.includes('docs.google.com');
  };

  // ============================================
  // FUNGSI PREVIEW
  // ============================================

  const openPreview = (title, link, type) => {
    if (!link) return;
    
    const links = getDriveLinks(link);
    const previewLink = links?.preview || link;
    
    setPreviewData({
      title: title,
      link: previewLink,
      originalLink: link,
      type: type,
      isDrive: isGoogleDriveLink(link),
      links: links
    });
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  // ============================================
  // RENDER PREVIEW MODAL
  // ============================================

  const renderPreview = () => {
    if (!showPreview || !previewData) return null;

    const { title, link, originalLink, type, isDrive, links } = previewData;
    const isFolder = links?.type === 'folder';
    const isFile = links?.type === 'file';
    
    let previewLink = link;
    let viewLink = originalLink;
    let downloadLink = originalLink;
    
    if (isDrive && isFile && links) {
      previewLink = links.preview || links.view;
      viewLink = links.view || links.preview;
      downloadLink = links.download || links.view;
    } else if (isDrive && isFolder && links) {
      previewLink = links.folder;
      viewLink = links.folder;
    }

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
              <p className="text-xs text-gray-500">
                {type === 'bahanAjar' ? '📎 Bahan Ajar' : '📄 LKPD'}
                {isDrive && (
                  <span className="ml-2 text-green-600">
                    • {isFolder ? '📁 Folder' : '📄 File'} Google Drive
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {downloadLink && downloadLink !== originalLink && (
                <a
                  href={downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <File className="w-4 h-4" />
                  Download
                </a>
              )}
              <a
                href={viewLink || originalLink}
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
            {isDrive && isFile && links ? (
              <iframe
                src={previewLink}
                className="w-full h-full rounded-lg border border-gray-200 bg-white"
                title={title}
                allow="autoplay; encrypted-media; fullscreen"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
              />
            ) : isDrive && isFolder ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-lg border border-gray-300">
                <FolderTree className="w-16 h-16 text-blue-500 mb-4" />
                <p className="text-gray-700 text-center px-4">
                  <span className="font-medium">Ini adalah folder Google Drive</span>
                  <br />
                  <span className="text-sm text-gray-500">Klik tombol "Buka di Tab Baru" untuk melihat isi folder</span>
                </p>
                <a
                  href={viewLink || originalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Buka Folder
                </a>
              </div>
            ) : (
              <iframe
                src={originalLink}
                className="w-full h-full rounded-lg border border-gray-200 bg-white"
                title={title}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // AMBIL DATA DARI DATABASE
  // ============================================

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const mapelRef = collection(db, 'mata_pelajaran');
        
        const q = query(
          mapelRef,
          where('nama', '==', 'Matematika'),
          where('kelas', '==', '3_ra_kartini')
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError('Data Matematika untuk Kelas 3 RA Kartini tidak ditemukan');
          setIsLoading(false);
          return;
        }
        
        let mapelData = null;
        let mapelId = null;
        
        querySnapshot.forEach((doc) => {
          mapelData = doc.data();
          mapelId = doc.id;
        });
        
        const pertemuanList = mapelData.pertemuan || [];
        
        pertemuanList.sort((a, b) => {
          return new Date(b.tanggal) - new Date(a.tanggal);
        });
        
        console.log('📝 Data Matematika RA Kartini:', {
          nama: mapelData.nama,
          pertemuan: pertemuanList.length
        });
        
        setData({
          mapel: {
            id: mapelId,
            nama: mapelData.nama || 'Matematika',
            deskripsi: mapelData.deskripsi || 'Mempelajari konsep dasar matematika, meliputi bilangan, operasi hitung, pengukuran, geometri sederhana, dan pemecahan masalah',
            icon: mapelData.icon || '📐',
            totalPertemuan: pertemuanList.length,
            pertemuan: pertemuanList,
            createdBy: mapelData.createdBy || 'Wali Kelas',
            kelas: mapelData.kelas || '3_ra_kartini',
            namaKelas: mapelData.namaKelas || 'Kelas 3 RA Kartini'
          }
        });
        
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

  // ============================================
  // RENDER PERTEMUAN LIST
  // ============================================

  const renderPertemuanList = () => {
    const pertemuanList = data.mapel.pertemuan;
    
    if (pertemuanList.length === 0) {
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
        {pertemuanList.map((pertemuan) => {
          // Cek semua kemungkinan field
          const bahanAjarValue = pertemuan.bahanAjar || '';
          const lkpdValue = pertemuan.lKpd || pertemuan.lkpd || pertemuan.Lkpd || pertemuan.LKPD || '';
          
          const hasBahanAjar = bahanAjarValue && bahanAjarValue.trim() !== '';
          const hasLkpd = lkpdValue && lkpdValue.trim() !== '';
          
          const bahanAjarPreview = hasBahanAjar ? convertDriveLink(bahanAjarValue, 'preview') : null;
          const lkpdPreview = hasLkpd ? convertDriveLink(lkpdValue, 'preview') : null;
          
          return (
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
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{pertemuan.tanggal ? new Date(pertemuan.tanggal).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : 'Tanggal belum diatur'}</span>
                      </span>
                      {hasBahanAjar && (
                        <span className="flex items-center space-x-1 text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full text-xs">
                          <File className="w-3 h-3" />
                          <span>Bahan Ajar</span>
                        </span>
                      )}
                      {hasLkpd && (
                        <span className="flex items-center space-x-1 text-green-500 bg-green-50 px-2 py-0.5 rounded-full text-xs">
                          <FileSpreadsheet className="w-3 h-3" />
                          <span>LKPD</span>
                        </span>
                      )}
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
                  {/* Materi */}
                  {pertemuan.materi && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Materi Pembelajaran
                      </h4>
                      <p className="text-blue-700 whitespace-pre-wrap">{pertemuan.materi}</p>
                    </div>
                  )}

                  {/* Deskripsi */}
                  {pertemuan.deskripsi && (
                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                      {pertemuan.deskripsi}
                    </div>
                  )}

                  {/* Preview Bahan Ajar */}
                  {hasBahanAjar && bahanAjarPreview && (
                    <div className="border border-blue-200 rounded-lg overflow-hidden">
                      <div className="bg-blue-50 px-4 py-2 flex items-center justify-between border-b border-blue-200">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-blue-700">Bahan Ajar</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openPreview(pertemuan.judul + ' - Bahan Ajar', bahanAjarValue, 'bahanAjar')}
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Preview Full
                          </button>
                          <a
                            href={bahanAjarValue}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Buka
                          </a>
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50">
                        <iframe
                          src={bahanAjarPreview}
                          className="w-full h-96 rounded-lg border border-gray-200"
                          title={pertemuan.judul + ' - Bahan Ajar'}
                          allow="autoplay; encrypted-media; fullscreen"
                          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                        />
                      </div>
                    </div>
                  )}

                  {/* Preview LKPD */}
                  {hasLkpd && lkpdPreview && (
                    <div className="border border-green-200 rounded-lg overflow-hidden">
                      <div className="bg-green-50 px-4 py-2 flex items-center justify-between border-b border-green-200">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-green-700">LKPD</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openPreview(pertemuan.judul + ' - LKPD', lkpdValue, 'lkpd')}
                            className="text-xs text-green-600 hover:text-green-800 hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Preview Full
                          </button>
                          <a
                            href={lkpdValue}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-600 hover:text-green-800 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Buka
                          </a>
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50">
                        <iframe
                          src={lkpdPreview}
                          className="w-full h-96 rounded-lg border border-gray-200"
                          title={pertemuan.judul + ' - LKPD'}
                          allow="autoplay; encrypted-media; fullscreen"
                          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                        />
                      </div>
                    </div>
                  )}

                  {/* Jika tidak ada bahan ajar dan lkpd */}
                  {!hasBahanAjar && !hasLkpd && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400">Belum ada bahan ajar atau LKPD untuk pertemuan ini</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Memuat data Matematika...</p>
          <p className="text-xs text-gray-400 mt-2">Kelas 3 RA Kartini</p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER UTAMA
  // ============================================

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
                <span className="block text-xs text-blue-600 font-medium">{data.mapel.namaKelas}</span>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                to="/3-ra-kartini/mata-pelajaran" 
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
              <p className="text-sm text-blue-600 mt-1">
                {data.mapel.namaKelas} • {data.mapel.createdBy}
              </p>
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
                <p className="text-sm text-gray-500">Total Bahan Ajar</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.mapel.pertemuan.filter(p => p.bahanAjar && p.bahanAjar.trim() !== '').length}
                </p>
              </div>
              <File className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total LKPD</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.mapel.pertemuan.filter(p => {
                    const val = p.lKpd || p.lkpd || p.Lkpd || p.LKPD || '';
                    return val && val.trim() !== '';
                  }).length}
                </p>
              </div>
              <FileSpreadsheet className="w-8 h-8 text-green-500" />
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
                <p className="font-semibold text-gray-700">{data.mapel.createdBy}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <School className="w-5 h-5 text-indigo-600" />
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
          <p>© 2026 Matematika - {data.mapel.namaKelas}</p>
          <p className="mt-1">SDS Harapan Sejahtera</p>
        </div>
      </div>

      {/* Preview Modal */}
      {renderPreview()}
    </div>
  );
};

export default Matematika3RaKartini;