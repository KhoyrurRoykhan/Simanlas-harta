// src/pages/admin/kelas3/Admin3DewiSartika.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Calendar,
  FileText,
  Link as LinkIcon,
  Eye,
  ChevronDown,
  ChevronRight,
  X,
  Save,
  Settings,
  AlertTriangle,
  LogOut,
  Loader,
  RefreshCw,
  School,
  GraduationCap,
  Clock,
  File,
  FileSpreadsheet,
  ExternalLink,
  Download
} from 'lucide-react';
import { db } from '../../firebase/config';
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  where,
  getDoc
} from 'firebase/firestore';

const Admin3DewiSartika = () => {
  const navigate = useNavigate();
  
  // ============================================
  // STATE
  // ============================================
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [data, setData] = useState({ mapel: [] });
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [currentMapelId, setCurrentMapelId] = useState(null);
  const [currentPertemuanId, setCurrentPertemuanId] = useState(null);
  
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    tanggal: '',
    materi: '',
    bahanAjar: '',
    lkpd: '',
    icon: '📚'
  });

  // ============================================
  // KONSTANTA
  // ============================================
  
  const COLLECTION_NAME = 'mata_pelajaran';
  const KELAS = '3_dewi_sartika';
  const NAMA_KELAS = 'Kelas 3 Dewi Sartika';
  
  const ICON_OPTIONS = [
    { value: '📐', label: '📐 Matematika' },
    { value: '📚', label: '📚 Bahasa' },
    { value: '🌍', label: '🌍 Bahasa Inggris' },
    { value: '🔬', label: '🔬 IPA' },
    { value: '🎨', label: '🎨 Seni' },
    { value: '❤️', label: '❤️ Kesehatan' },
    { value: '🛡️', label: '🛡️ Pancasila' },
    { value: '🕌', label: '🕌 Agama' },
    { value: '💻', label: '💻 TIK' },
    { value: '🏃', label: '🏃 Olahraga' },
    { value: '🎵', label: '🎵 Musik' },
    { value: '📖', label: '📖 PKN' },
    { value: '🧮', label: '🧮 Aritmatika' },
    { value: '🔭', label: '🔭 Astronomi' },
    { value: '🧬', label: '🧬 Biologi' },
    { value: '⚗️', label: '⚗️ Kimia' },
    { value: '⚡', label: '⚡ Fisika' },
    { value: '🌿', label: '🌿 Ekologi' },
  ];

  // ============================================
  // FUNGSI UTILITY GOOGLE DRIVE
  // ============================================

  /**
   * Ekstrak File ID dari berbagai format link Google Drive
   * Support: view, preview, open, uc, folder, dan share link
   */
  const extractDriveFileId = (url) => {
    if (!url) return null;
    
    // Bersihkan URL dari parameter tambahan
    const cleanUrl = url.split('?')[0];
    
    // Pola-pola link Google Drive
    const patterns = [
      // https://drive.google.com/file/d/FILE_ID/view
      { regex: /drive\.google\.com\/file\/d\/([^\/]+)/, type: 'file' },
      // https://drive.google.com/open?id=FILE_ID
      { regex: /drive\.google\.com\/open\?id=([^&]+)/, type: 'file' },
      // https://drive.google.com/uc?id=FILE_ID
      { regex: /drive\.google\.com\/uc\?id=([^&]+)/, type: 'file' },
      // https://drive.google.com/drive/folders/FOLDER_ID
      { regex: /drive\.google\.com\/drive\/folders\/([^\/]+)/, type: 'folder' },
      // https://drive.google.com/folderview?id=FOLDER_ID
      { regex: /drive\.google\.com\/folderview\?id=([^&]+)/, type: 'folder' },
      // https://drive.google.com/drive/u/0/folders/FOLDER_ID
      { regex: /drive\.google\.com\/drive\/u\/\d+\/folders\/([^\/]+)/, type: 'folder' },
      // https://drive.google.com/file/d/FILE_ID/edit
      { regex: /drive\.google\.com\/file\/d\/([^\/]+)\/edit/, type: 'file' },
      // Short URL: https://drive.google.com/d/FILE_ID
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

  /**
   * Konversi berbagai format link Google Drive ke format yang diinginkan
   */
  const convertDriveLink = (url, format = 'preview') => {
    if (!url) return null;
    
    const fileInfo = extractDriveFileId(url);
    if (!fileInfo) {
      // Jika bukan link Google Drive, return URL asli
      return url;
    }
    
    const { id, type } = fileInfo;
    
    // Untuk folder, gunakan link folder biasa
    if (type === 'folder') {
      return `https://drive.google.com/drive/folders/${id}`;
    }
    
    // Untuk file, konversi ke format yang diminta
    switch (format) {
      case 'preview':
        return `https://drive.google.com/file/d/${id}/preview`;
      case 'view':
        return `https://drive.google.com/file/d/${id}/view`;
      case 'download':
        return `https://drive.google.com/uc?id=${id}&export=download`;
      case 'direct':
        return `https://drive.google.com/uc?export=view&id=${id}`;
      case 'thumbnail':
        return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
      default:
        return `https://drive.google.com/file/d/${id}/view`;
    }
  };

  /**
   * Mendapatkan semua format link dari satu URL Google Drive
   */
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
      thumbnail: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
      type: 'file',
      id: id
    };
  };

  /**
   * Cek apakah link adalah Google Drive
   */
  const isGoogleDriveLink = (url) => {
    if (!url) return false;
    return url.includes('drive.google.com') || url.includes('docs.google.com');
  };

  // ============================================
  // FUNGSI DATABASE
  // ============================================

  const getAllMapel = async () => {
    try {
      const mapelRef = collection(db, COLLECTION_NAME);
      const q = query(mapelRef);
      const querySnapshot = await getDocs(q);
      
      const mapelList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.kelas === KELAS) {
          mapelList.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      mapelList.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
      
      return { success: true, data: mapelList };
    } catch (error) {
      console.error('Error getting mapel:', error);
      return { success: false, error: error.message };
    }
  };

  const addMapel = async (mapelData) => {
    try {
      const mapelRef = collection(db, COLLECTION_NAME);
      const q = query(mapelRef);
      const querySnapshot = await getDocs(q);
      
      let isExist = false;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.nama === mapelData.nama && data.kelas === KELAS) {
          isExist = true;
        }
      });
      
      if (isExist) {
        return { success: false, error: 'Nama mata pelajaran sudah ada di kelas ini' };
      }
      
      const docRef = await addDoc(mapelRef, {
        ...mapelData,
        kelas: KELAS,
        namaKelas: NAMA_KELAS,
        pertemuan: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userData?.fullName || 'Wali Kelas',
        createdByUsername: userData?.username || 'unknown'
      });
      
      return { success: true, id: docRef.id, data: { id: docRef.id, ...mapelData } };
    } catch (error) {
      console.error('Error adding mapel:', error);
      return { success: false, error: error.message };
    }
  };

  const updateMapel = async (id, mapelData) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      
      const q = query(collection(db, COLLECTION_NAME));
      const querySnapshot = await getDocs(q);
      
      let isNameTaken = false;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.nama === mapelData.nama && data.kelas === KELAS && doc.id !== id) {
          isNameTaken = true;
        }
      });
      
      if (isNameTaken) {
        return { success: false, error: 'Nama mata pelajaran sudah digunakan di kelas ini' };
      }
      
      await updateDoc(docRef, {
        ...mapelData,
        kelas: KELAS,
        namaKelas: NAMA_KELAS,
        updatedAt: serverTimestamp(),
        updatedBy: userData?.fullName || 'Wali Kelas'
      });
      
      return { success: true, data: { id, ...mapelData } };
    } catch (error) {
      console.error('Error updating mapel:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteMapel = async (id) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().kelas !== KELAS) {
        return { success: false, error: 'Anda tidak memiliki izin untuk menghapus data ini' };
      }
      
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting mapel:', error);
      return { success: false, error: error.message };
    }
  };

  // ============================================
  // FUNGSI PERTEMUAN
  // ============================================

  const addPertemuan = async (mapelId, pertemuanData) => {
    try {
      console.log('📝 Menambahkan pertemuan untuk mapel ID:', mapelId);
      
      if (!mapelId) {
        return { success: false, error: 'ID Mata Pelajaran tidak ditemukan' };
      }
      
      const docRef = doc(db, COLLECTION_NAME, mapelId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return { success: false, error: 'Mata pelajaran tidak ditemukan' };
      }
      
      const mapelData = docSnap.data();
      if (mapelData.kelas !== KELAS) {
        return { success: false, error: 'Anda tidak memiliki izin untuk menambah data di kelas ini' };
      }
      
      const newPertemuan = {
        id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5),
        judul: pertemuanData.judul || 'Pertemuan Baru',
        tanggal: pertemuanData.tanggal || new Date().toISOString().split('T')[0],
        deskripsi: pertemuanData.deskripsi || '',
        materi: pertemuanData.materi || '',
        bahanAjar: pertemuanData.bahanAjar || '',
        lkpd: pertemuanData.lkpd || '',
        kelas: KELAS,
        namaKelas: NAMA_KELAS,
        createdAt: new Date().toISOString(),
        createdBy: userData?.fullName || 'Wali Kelas'
      };
      
      console.log('📝 Data pertemuan baru:', newPertemuan);
      
      const pertemuanList = mapelData.pertemuan || [];
      pertemuanList.push(newPertemuan);
      
      await updateDoc(docRef, {
        pertemuan: pertemuanList,
        updatedAt: serverTimestamp(),
        updatedBy: userData?.fullName || 'Wali Kelas'
      });
      
      console.log('✅ Pertemuan berhasil ditambahkan!');
      return { success: true, data: newPertemuan };
      
    } catch (error) {
      console.error('❌ Error adding pertemuan:', error);
      return { success: false, error: error.message };
    }
  };

  const updatePertemuan = async (mapelId, pertemuanId, pertemuanData) => {
    try {
      console.log('📝 Mengupdate pertemuan:', pertemuanId);
      
      const docRef = doc(db, COLLECTION_NAME, mapelId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return { success: false, error: 'Mata pelajaran tidak ditemukan' };
      }
      
      if (docSnap.data().kelas !== KELAS) {
        return { success: false, error: 'Anda tidak memiliki izin untuk mengupdate data ini' };
      }
      
      const data = docSnap.data();
      const pertemuanList = data.pertemuan || [];
      
      const index = pertemuanList.findIndex(p => p.id === pertemuanId);
      if (index === -1) {
        return { success: false, error: 'Pertemuan tidak ditemukan' };
      }
      
      pertemuanList[index] = {
        ...pertemuanList[index],
        judul: pertemuanData.judul || pertemuanList[index].judul,
        tanggal: pertemuanData.tanggal || pertemuanList[index].tanggal,
        deskripsi: pertemuanData.deskripsi || '',
        materi: pertemuanData.materi || '',
        bahanAjar: pertemuanData.bahanAjar || '',
        lkpd: pertemuanData.lkpd || '',
        updatedAt: new Date().toISOString(),
        updatedBy: userData?.fullName || 'Wali Kelas'
      };
      
      await updateDoc(docRef, {
        pertemuan: pertemuanList,
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ Pertemuan berhasil diupdate!');
      return { success: true, data: pertemuanList[index] };
      
    } catch (error) {
      console.error('❌ Error updating pertemuan:', error);
      return { success: false, error: error.message };
    }
  };

  const deletePertemuan = async (mapelId, pertemuanId) => {
    try {
      console.log('🗑️ Menghapus pertemuan:', pertemuanId);
      
      const docRef = doc(db, COLLECTION_NAME, mapelId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return { success: false, error: 'Mata pelajaran tidak ditemukan' };
      }
      
      if (docSnap.data().kelas !== KELAS) {
        return { success: false, error: 'Anda tidak memiliki izin untuk menghapus data ini' };
      }
      
      const data = docSnap.data();
      const pertemuanList = data.pertemuan || [];
      const newPertemuanList = pertemuanList.filter(p => p.id !== pertemuanId);
      
      await updateDoc(docRef, {
        pertemuan: newPertemuanList,
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ Pertemuan berhasil dihapus!');
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting pertemuan:', error);
      return { success: false, error: error.message };
    }
  };

  // ============================================
  // FUNGSI PREVIEW - DENGAN CONVERTER LINK
  // ============================================

  const openPreview = (title, link, type) => {
    if (!link) return;
    
    const links = getDriveLinks(link);
    console.log('📎 Link info:', links);
    
    setPreviewData({
      title: title,
      type: type,
      links: links,
      isDrive: isGoogleDriveLink(link),
      originalLink: link
    });
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  // ============================================
  // FUNGSI UTAMA
  // ============================================

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = localStorage.getItem('user');
    
    if (!isLoggedIn || !user) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
      
      if (parsedUser.username === '3_dewi_sartika') {
        setIsAuthorized(true);
        loadData();
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const loadData = async () => {
    setIsLoadingData(true);
    setError('');
    
    try {
      const result = await getAllMapel();
      
      if (result.success) {
        setData({ mapel: result.data });
        console.log(`✅ Loaded ${result.data.length} mata pelajaran untuk ${NAMA_KELAS}`);
      } else {
        setError('Gagal memuat data: ' + result.error);
      }
    } catch (error) {
      setError('Terjadi kesalahan: ' + error.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  // ============================================
  // HANDLER CRUD
  // ============================================

  const handleAddMapel = async () => {
    try {
      const result = await addMapel({
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        icon: formData.icon || '📚'
      });
      
      if (result.success) {
        setSuccess(`✅ Mata pelajaran "${formData.nama}" berhasil ditambahkan!`);
        setShowModal(false);
        loadData();
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Terjadi kesalahan: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEditMapel = async () => {
    try {
      const result = await updateMapel(editingItem.id, {
        nama: formData.nama,
        deskripsi: formData.deskripsi,
        icon: formData.icon || editingItem.icon || '📚'
      });
      
      if (result.success) {
        setSuccess(`✅ Mata pelajaran "${formData.nama}" berhasil diupdate!`);
        setShowModal(false);
        loadData();
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Terjadi kesalahan: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteMapel = async (id, nama) => {
    if (!window.confirm(`⚠️ Apakah Anda yakin ingin menghapus mata pelajaran "${nama}"?`)) return;
    
    try {
      const result = await deleteMapel(id);
      
      if (result.success) {
        setSuccess(`✅ Mata pelajaran "${nama}" berhasil dihapus!`);
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Terjadi kesalahan: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAddPertemuan = async () => {
    try {
      console.log('📝 Menambahkan pertemuan untuk mapel ID:', currentMapelId);
      
      if (!currentMapelId) {
        setError('ID Mata Pelajaran tidak ditemukan. Silakan coba lagi.');
        return;
      }
      
      // Link akan disimpan dalam format asli, nanti akan dikonversi saat preview
      const result = await addPertemuan(currentMapelId, {
        judul: formData.nama,
        tanggal: formData.tanggal,
        deskripsi: formData.deskripsi || '',
        materi: formData.materi || '',
        bahanAjar: formData.bahanAjar || '',
        lkpd: formData.lkpd || ''
      });
      
      if (result.success) {
        setSuccess(`✅ Pertemuan "${formData.nama}" berhasil ditambahkan!`);
        setShowModal(false);
        loadData();
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('❌ Error handleAddPertemuan:', error);
      setError('Terjadi kesalahan: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEditPertemuan = async () => {
    try {
      console.log('📝 Mengupdate pertemuan:', currentPertemuanId);
      
      if (!currentMapelId || !currentPertemuanId) {
        setError('Data tidak lengkap. Silakan coba lagi.');
        return;
      }
      
      const result = await updatePertemuan(currentMapelId, currentPertemuanId, {
        judul: formData.nama,
        tanggal: formData.tanggal,
        deskripsi: formData.deskripsi || '',
        materi: formData.materi || '',
        bahanAjar: formData.bahanAjar || '',
        lkpd: formData.lkpd || ''
      });
      
      if (result.success) {
        setSuccess(`✅ Pertemuan "${formData.nama}" berhasil diupdate!`);
        setShowModal(false);
        loadData();
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('❌ Error handleEditPertemuan:', error);
      setError('Terjadi kesalahan: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeletePertemuan = async (mapelId, pertemuanId, judul) => {
    if (!window.confirm(`⚠️ Apakah Anda yakin ingin menghapus pertemuan "${judul}"?`)) return;
    
    try {
      const result = await deletePertemuan(mapelId, pertemuanId);
      
      if (result.success) {
        setSuccess(`✅ Pertemuan "${judul}" berhasil dihapus!`);
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Terjadi kesalahan: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  const resetForm = () => {
    setFormData({
      nama: '',
      deskripsi: '',
      tanggal: '',
      materi: '',
      bahanAjar: '',
      lkpd: '',
      icon: '📚'
    });
    setEditingItem(null);
    setCurrentMapelId(null);
    setCurrentPertemuanId(null);
  };

  const openModal = (type, item = null, ids = {}) => {
    console.log('📝 Opening modal:', { type, item, ids });
    
    setModalType(type);
    setEditingItem(item);
    
    const mapelId = ids.mapelId || null;
    const pertemuanId = ids.pertemuanId || null;
    
    setCurrentMapelId(mapelId);
    setCurrentPertemuanId(pertemuanId);
    
    if (item) {
      setFormData({
        nama: item.nama || item.judul || '',
        deskripsi: item.deskripsi || '',
        tanggal: item.tanggal || '',
        materi: item.materi || '',
        bahanAjar: item.bahanAjar || '',
        lkpd: item.lkpd || '',
        icon: item.icon || '📚'
      });
    } else {
      setFormData({
        nama: '',
        deskripsi: '',
        tanggal: '',
        materi: '',
        bahanAjar: '',
        lkpd: '',
        icon: '📚'
      });
    }
    
    setShowModal(true);
  };

  const handleSave = () => {
    console.log('💾 Saving with modalType:', modalType);
    
    switch(modalType) {
      case 'mapel':
        if (editingItem) {
          handleEditMapel();
        } else {
          handleAddMapel();
        }
        break;
      case 'pertemuan':
        handleAddPertemuan();
        break;
      case 'editPertemuan':
        handleEditPertemuan();
        break;
      default:
        console.log('⚠️ Unknown modal type:', modalType);
        break;
    }
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // ============================================
  // GET STATS
  // ============================================

  const getStats = () => {
    let totalPertemuan = 0;
    let totalBahanAjar = 0;
    let totalLkpd = 0;
    
    data.mapel.forEach(mapel => {
      if (mapel.pertemuan) {
        totalPertemuan += mapel.pertemuan.length;
        mapel.pertemuan.forEach(p => {
          if (p.bahanAjar) totalBahanAjar++;
          if (p.lkpd) totalLkpd++;
        });
      }
    });
    
    return { totalPertemuan, totalBahanAjar, totalLkpd };
  };

  // ============================================
  // RENDER PREVIEW MODAL
  // ============================================

  const renderPreview = () => {
    if (!showPreview || !previewData) return null;

    const { title, type, links, isDrive, originalLink } = previewData;
    const isFolder = links?.type === 'folder';
    const isFile = links?.type === 'file';
    
    // Tentukan link yang akan digunakan untuk preview
    let previewLink = originalLink;
    let downloadLink = originalLink;
    let viewLink = originalLink;
    
    if (isDrive && isFile && links) {
      previewLink = links.preview || links.view;
      downloadLink = links.download || links.view;
      viewLink = links.view || links.preview;
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
                {!isDrive && (
                  <span className="ml-2 text-blue-600">• Link Eksternal</span>
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
                  <Download className="w-4 h-4" />
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
              // File Google Drive
              <iframe
                src={previewLink}
                className="w-full h-full rounded-lg border border-gray-200 bg-white"
                title={title}
                allow="autoplay; encrypted-media; fullscreen"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
              />
            ) : isDrive && isFolder ? (
              // Folder Google Drive
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
              // Link eksternal atau non-Drive
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
  // RENDER MODAL
  // ============================================

  const renderModal = () => {
    if (!showModal) return null;

    const getTitle = () => {
      switch(modalType) {
        case 'mapel': return `${editingItem ? 'Edit' : 'Tambah'} Mata Pelajaran - ${NAMA_KELAS}`;
        case 'pertemuan': return `Tambah Pertemuan - ${NAMA_KELAS}`;
        case 'editPertemuan': return `Edit Pertemuan - ${NAMA_KELAS}`;
        default: return 'Form';
      }
    };

    const mapelName = data.mapel.find(m => m.id === currentMapelId)?.nama || '';

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{getTitle()}</h3>
              <p className="text-sm text-orange-600 mt-1 flex items-center gap-2">
                <School className="w-4 h-4" />
                {NAMA_KELAS}
              </p>
              {(modalType === 'pertemuan' || modalType === 'editPertemuan') && currentMapelId && (
                <p className="text-xs text-blue-600 mt-1 bg-blue-50 px-3 py-1 rounded-full inline-block">
                  📚 Untuk Mata Pelajaran: <strong>{mapelName || 'Loading...'}</strong>
                </p>
              )}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="space-y-4">
              {/* FORM MAPEL */}
              {modalType === 'mapel' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mata Pelajaran</label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Masukkan nama mata pelajaran"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon.value} value={icon.value}>
                          {icon.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <textarea
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows="3"
                      placeholder="Masukkan deskripsi mata pelajaran"
                    />
                  </div>
                </>
              )}

              {/* FORM PERTEMUAN */}
              {(modalType === 'pertemuan' || modalType === 'editPertemuan') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Judul Pertemuan <span className="text-red-500">*</span>
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Materi Pembelajaran <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.materi}
                      onChange={(e) => setFormData({...formData, materi: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows="4"
                      placeholder="Masukkan materi pembelajaran yang akan disampaikan"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">Deskripsikan materi yang akan diajarkan pada pertemuan ini</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bahan Ajar <span className="text-gray-400 text-xs">(Opsional)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.bahanAjar}
                        onChange={(e) => setFormData({...formData, bahanAjar: e.target.value})}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="https://drive.google.com/file/d/xxx/view"
                      />
                      {formData.bahanAjar && (
                        <button
                          type="button"
                          onClick={() => openPreview('Bahan Ajar', formData.bahanAjar, 'bahanAjar')}
                          className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Preview Bahan Ajar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Copy link dari Google Drive (bisa dari tombol share atau URL di browser)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LKPD <span className="text-gray-400 text-xs">(Opsional)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.lkpd}
                        onChange={(e) => setFormData({...formData, lkpd: e.target.value})}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="https://drive.google.com/file/d/xxx/view"
                      />
                      {formData.lkpd && (
                        <button
                          type="button"
                          onClick={() => openPreview('LKPD', formData.lkpd, 'lkpd')}
                          className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                          title="Preview LKPD"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Copy link dari Google Drive (bisa dari tombol share atau URL di browser)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan / Deskripsi <span className="text-gray-400 text-xs">(Opsional)</span>
                    </label>
                    <textarea
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows="2"
                      placeholder="Tambahkan catatan atau deskripsi tambahan"
                    />
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {modalType === 'editPertemuan' ? 'Mengupdate pertemuan di:' : 'Pertemuan akan ditambahkan ke:'} 
                      <strong>{mapelName || 'Mata Pelajaran'}</strong>
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
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

  // ============================================
  // RENDER TREE VIEW
  // ============================================

  const renderTree = () => {
    if (isLoadingData) {
      return (
        <div className="text-center py-12">
          <Loader className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-500">Memuat data...</p>
        </div>
      );
    }

    if (data.mapel.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Belum Ada Mata Pelajaran</h3>
          <p className="text-gray-500 mb-2">Untuk <strong>{NAMA_KELAS}</strong></p>
          <p className="text-gray-500 mb-4">Mulai dengan menambahkan mata pelajaran pertama</p>
          <button
            onClick={() => openModal('mapel')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Tambah Mapel
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {data.mapel.map((mapel) => (
          <div key={mapel.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Header Mapel */}
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
                <span className="text-3xl">{mapel.icon || '📚'}</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{mapel.nama}</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-orange-600 font-medium bg-orange-100 px-2 py-0.5 rounded-full">
                      {NAMA_KELAS}
                    </span>
                    {mapel.deskripsi && (
                      <span className="text-gray-500">• {mapel.deskripsi}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 mr-2">
                  {mapel.pertemuan?.length || 0} pertemuan
                </span>
                <button
                  onClick={() => openModal('pertemuan', null, { mapelId: mapel.id })}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Tambah Pertemuan"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openModal('mapel', mapel)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit Mapel"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteMapel(mapel.id, mapel.nama)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Mapel"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Daftar Pertemuan */}
            {expandedItems[`mapel-${mapel.id}`] && (
              <div className="p-4">
                {!mapel.pertemuan || mapel.pertemuan.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex p-4 bg-gray-50 rounded-full mb-3">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Belum ada pertemuan</p>
                    <button
                      onClick={() => openModal('pertemuan', null, { mapelId: mapel.id })}
                      className="mt-3 inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Pertemuan</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {mapel.pertemuan.map((pertemuan) => {
                      // Cek apakah link adalah Google Drive
                      const isDriveBahanAjar = isGoogleDriveLink(pertemuan.bahanAjar);
                      const isDriveLkpd = isGoogleDriveLink(pertemuan.lkpd);
                      
                      return (
                        <div key={pertemuan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-500" />
                                <h4 className="font-semibold text-gray-800">{pertemuan.judul}</h4>
                                <span className="text-xs text-gray-400">
                                  {pertemuan.tanggal ? new Date(pertemuan.tanggal).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  }) : 'Tanggal belum diatur'}
                                </span>
                              </div>
                              
                              {/* Materi */}
                              {pertemuan.materi && (
                                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{pertemuan.materi}</p>
                                </div>
                              )}
                              
                              {/* Bahan Ajar & LKPD */}
                              <div className="mt-3 flex flex-wrap gap-3">
                                {pertemuan.bahanAjar && (
                                  <div className="flex items-center gap-2">
                                    <File className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs text-gray-500">Bahan Ajar:</span>
                                    {isDriveBahanAjar ? (
                                      <>
                                        <button
                                          onClick={() => openPreview(pertemuan.judul + ' - Bahan Ajar', pertemuan.bahanAjar, 'bahanAjar')}
                                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                        >
                                          <Eye className="w-3 h-3" />
                                          Preview
                                        </button>
                                        <a
                                          href={convertDriveLink(pertemuan.bahanAjar, 'view')}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          Buka
                                        </a>
                                      </>
                                    ) : (
                                      <a
                                        href={pertemuan.bahanAjar}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        Buka Link
                                      </a>
                                    )}
                                  </div>
                                )}
                                {pertemuan.lkpd && (
                                  <div className="flex items-center gap-2">
                                    <FileSpreadsheet className="w-4 h-4 text-green-500" />
                                    <span className="text-xs text-gray-500">LKPD:</span>
                                    {isDriveLkpd ? (
                                      <>
                                        <button
                                          onClick={() => openPreview(pertemuan.judul + ' - LKPD', pertemuan.lkpd, 'lkpd')}
                                          className="text-xs text-green-600 hover:text-green-800 hover:underline flex items-center gap-1"
                                        >
                                          <Eye className="w-3 h-3" />
                                          Preview
                                        </button>
                                        <a
                                          href={convertDriveLink(pertemuan.lkpd, 'view')}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-green-600 hover:text-green-800 hover:underline flex items-center gap-1"
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          Buka
                                        </a>
                                      </>
                                    ) : (
                                      <a
                                        href={pertemuan.lkpd}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-green-600 hover:text-green-800 hover:underline flex items-center gap-1"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        Buka Link
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Deskripsi */}
                              {pertemuan.deskripsi && (
                                <p className="mt-2 text-xs text-gray-400">{pertemuan.deskripsi}</p>
                              )}
                            </div>
                            
                            {/* Tombol Aksi */}
                            <div className="flex items-center space-x-1 ml-4">
                              <button
                                onClick={() => {
                                  setEditingItem(pertemuan);
                                  setCurrentMapelId(mapel.id);
                                  setCurrentPertemuanId(pertemuan.id);
                                  setFormData({
                                    nama: pertemuan.judul || '',
                                    deskripsi: pertemuan.deskripsi || '',
                                    tanggal: pertemuan.tanggal || '',
                                    materi: pertemuan.materi || '',
                                    bahanAjar: pertemuan.bahanAjar || '',
                                    lkpd: pertemuan.lkpd || '',
                                    icon: '📚'
                                  });
                                  setModalType('editPertemuan');
                                  setShowModal(true);
                                }}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit Pertemuan"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePertemuan(mapel.id, pertemuan.id, pertemuan.judul)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus Pertemuan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // ============================================
  // CONDITIONAL RENDER
  // ============================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Memeriksa akses...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak!</h2>
          <p className="text-gray-600 mb-6">
            Halaman ini hanya dapat diakses oleh Wali Kelas <strong>{NAMA_KELAS}</strong>.<br />
            Akun Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Kembali ke Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-left">
            <p className="text-xs text-gray-500">
              <strong>Info Akun:</strong><br />
              Username: {userData?.username || 'Tidak diketahui'}<br />
              Role: {userData?.role || 'Tidak diketahui'}<br />
              Kelas: {userData?.className || 'Tidak diketahui'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStats();

  // ============================================
  // RENDER UTAMA
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <nav className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-700">Admin Panel</span>
                <span className="block text-xs text-orange-600 font-medium">{NAMA_KELAS}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-200">
                <School className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">{NAMA_KELAS}</span>
              </div>
              
              <button
                onClick={loadData}
                className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className={`w-5 h-5 ${isLoadingData ? 'animate-spin' : ''}`} />
              </button>
              
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-700">{userData?.fullName || 'Wali Kelas'}</p>
                <p className="text-xs text-gray-400">{userData?.className || NAMA_KELAS}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Manajemen Mata Pelajaran
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <School className="w-4 h-4 text-orange-500" />
              Kelola semua mata pelajaran untuk <strong className="text-orange-600">{NAMA_KELAS}</strong>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-orange-50 rounded-lg border border-orange-200">
              <span className="text-sm text-orange-700">
                📚 {data.mapel.length} Mata Pelajaran
              </span>
            </div>
            <button
              onClick={() => openModal('mapel')}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Mapel</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
            <span className="text-xl">✅</span>
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Mapel</p>
                <p className="text-2xl font-bold text-gray-800">{data.mapel.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pertemuan</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalPertemuan}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bahan Ajar</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalBahanAjar}</p>
              </div>
              <File className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total LKPD</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalLkpd}</p>
              </div>
              <FileSpreadsheet className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {renderTree()}

        <div className="mt-12 text-center text-gray-400 text-sm border-t border-gray-200 pt-6">
          <p>© 2026 Admin Panel - Sistem Informasi Manajemen {NAMA_KELAS}</p>
          <p className="mt-1">SDS Harapan Sejahtera</p>
          <p className="mt-1 text-xs text-gray-300">
            Data tersimpan di Firebase Firestore • Collection: {COLLECTION_NAME}
          </p>
        </div>
      </div>

      {renderModal()}
      {renderPreview()}
    </div>
  );
};

export default Admin3DewiSartika;