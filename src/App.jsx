import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Page/LandingPage';
import JadwalPage from './Page/JadwalPage';
import MataPelajaran from './Page/MataPelajaran';
import Admin from './Page/Admin';
import BahasaIndonesia from './Page/MapelPage/BahasaIndonesia';
import BahasaInggris from './Page/MapelPage/BahasaInggris';
import Matematika from './Page/MapelPage/Matematika';
import Ipas from './Page/MapelPage/Ipas';
import Sbdp from './Page/MapelPage/Sbdp';
import Agama from './Page/MapelPage/Agama';
import Plks from './Page/MapelPage/Plks';
import PendidikanPancasila from './Page/MapelPage/PendidikanPancasila';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jadwal" element={<JadwalPage />} />
        <Route path="/mata-pelajaran" element={<MataPelajaran />} />
        <Route path="/mata-pelajaran/bahasa-indonesia" element={<BahasaIndonesia />} />
        <Route path="/mata-pelajaran/bahasa-inggris" element={<BahasaInggris />} />
        <Route path="/mata-pelajaran/matematika" element={<Matematika />} />
        <Route path="/mata-pelajaran/matematika" element={<Ipas />} />
        <Route path="/mata-pelajaran/sbdp" element={<Sbdp />} />
        <Route path="/mata-pelajaran/agama" element={<Agama />} />
        <Route path="/mata-pelajaran/plks" element={<Plks />} />
        <Route path="/mata-pelajaran/pendidikan-pancasila" element={<PendidikanPancasila />} />

        <Route path="/admin" element={<Admin />} />
        {/* Tambahkan route lain di sini */}
        {/* <Route path="/about" element={<AboutPage />} /> */}
        {/* <Route path="/contact" element={<ContactPage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App