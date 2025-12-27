import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
