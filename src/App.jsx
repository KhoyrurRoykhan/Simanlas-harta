import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Page/LandingPage';
import JadwalPage from './Page/JadwalPage';
import MataPelajaran from './Page/MataPelajaran';
import Admin from './Page/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jadwal" element={<JadwalPage />} />
        <Route path="/mata-pelajaran" element={<MataPelajaran />} />
        <Route path="/admin" element={<Admin />} />
        {/* Tambahkan route lain di sini */}
        {/* <Route path="/about" element={<AboutPage />} /> */}
        {/* <Route path="/contact" element={<ContactPage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App