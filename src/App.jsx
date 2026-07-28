import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Page/LandingPage';
import ScrollToTop from './Components/ScrollToTop';
import JadwalPage from './Page/3DewiSartika/JadwalPage';
import MataPelajaran from './Page/3DewiSartika/MataPelajaran';
import BahasaIndonesia from './Page/3DewiSartika/MapelPage/BahasaIndonesia';
import BahasaInggris from './Page/3DewiSartika/MapelPage/BahasaInggris';
import Matematika from './Page/3DewiSartika/MapelPage/Matematika';
import Ipas from './Page/3DewiSartika/MapelPage/Ipas';
import Sbdp from './Page/3DewiSartika/MapelPage/Sbdp';
import Agama from './Page/3DewiSartika/MapelPage/Agama';
import Plks from './Page/3DewiSartika/MapelPage/Plks';
import PendidikanPancasila from './Page/3DewiSartika/MapelPage/PendidikanPancasila';
import Portal from './Page/Portal';
import LandingPage3DewiSartika from './Page/3DewiSartika/LandingPage3DewiSartika';
import LoginAdmin from './Page/LoginAdmin';
import LandingPage3RAKartini from './Page/3RAKartini/LandingPage3RAKartini';
import LandingPage1PAntasari from './Page/1PAntasari/LandingPage1PAntasari';
import LandingPage1PDiponegoro from './Page/1PDiponegoro/LandingPage1PDiponegoro';
import LandingPage1TjilikRiwut from './Page/1TjilikRiwut/LandingPage1TjilikRiwut';
import LandingPage2DrWahidin from './Page/2DrWahidin/LandingPage2DrWahidin';
import LandingPage2DrSoetomo from './Page/2DrSoetomo/LandingPage2DrSoetomo';
import LandingPage4TanMalaka from './Page/4TanMalaka/LandingPage4TanMalaka';
import LandingPage4WahidHasyim from './Page/4WahidHasyim/LandingPage4WahidHasyim';
import LandingPage5CutMeutia from './Page/5CutMeutia/LandingPage5CutMeutia';
import LandingPage6Soekarno from './Page/6Soekarno/LandingPage6Soekarno';
import LandingPage6Hatta from './Page/6Hatta/LandingPage6Hatta';

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Portal />} />

        <Route path="/1-p-antasari" element={<LandingPage1PAntasari />} />

        <Route path="/1-p-diponegoro" element={<LandingPage1PDiponegoro />} />

        <Route path="/1-tjilik-riwut" element={<LandingPage1TjilikRiwut />} />

        <Route path="/2-dr-wahidin" element={<LandingPage2DrWahidin />} />

        <Route path="/2-dr-soetomo" element={<LandingPage2DrSoetomo />} />
        
        <Route path="/3-dewi-sartika" element={<LandingPage3DewiSartika />} />
        <Route path="/3-dewi-sartika/jadwal" element={<JadwalPage />} />
        <Route path="/3-dewi-sartika/mata-pelajaran" element={<MataPelajaran />} />
        <Route path="/3-dewi-sartika/mata-pelajaran/bahasa-indonesia" element={<BahasaIndonesia />} />
        <Route path="/3-dewi-sartika/mata-pelajaran/bahasa-inggris" element={<BahasaInggris />} />
        <Route path="/3-dewi-sartika/mata-pelajaran/matematika" element={<Matematika />} />
        <Route path="/3-dewi-sartika/mata-pelajaran/ipas" element={<Ipas />} />
        <Route path="/3-dewi-sartika/mata-pelajaran/sbdp" element={<Sbdp />} />
        <Route path="/3-dewi-sartika/mata-pelajaran/agama" element={<Agama />} />
        <Route path="/3-dewi-sartika/mata-pelajaran/plks" element={<Plks />} />
        <Route path="/3-dewi-sartika/mata-pelajaran/pendidikan-pancasila" element={<PendidikanPancasila />} />

        <Route path="/3-ra-kartini" element={<LandingPage3RAKartini />} />

        <Route path="/4-tan-malaka" element={<LandingPage4TanMalaka />} />

        <Route path="/4-wahid-hasyim" element={<LandingPage4WahidHasyim />} />

        <Route path="/5-cut-meutia" element={<LandingPage5CutMeutia />} />

        <Route path="/5-cut-nyak-dien" element={<LandingPage5CutMeutia />} />

        <Route path="/6-soekarno" element={<LandingPage6Soekarno />} />

        <Route path="/6-hatta" element={<LandingPage6Hatta />} />

        
        <Route path="/login-admin" element={<LoginAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App