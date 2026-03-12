import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ApplicationFlow } from './components/application/ApplicationFlow';
import { Header } from './components/insure9ja/Header';
import { Footer } from './components/insure9ja/Footer';
import Home from './pages/Home';
import Product from './pages/Product';
import Annuity from './pages/Annuity';
import MotorInsurance from './pages/MotorInsurance';
import About from './pages/About';
import Faqs from './pages/Faqs';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function ScrollToTopOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return null;
}

export default function App() {
  const [showApplication, setShowApplication] = useState(false);

  if (showApplication) {
    return <ApplicationFlow onClose={() => setShowApplication(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTopOnRouteChange />
      <Header onStartApplication={() => setShowApplication(true)} />
      <Routes>
        <Route path="/" element={<Home onStartApplication={() => setShowApplication(true)} />} />
        <Route
          path="/life-insurance"
          element={<Product onStartApplication={() => setShowApplication(true)} />}
        />
        <Route path="/annuity" element={<Annuity onStartApplication={() => setShowApplication(true)} />} />
        <Route path="/motor-insurance" element={<MotorInsurance />} />
        <Route path="/about" element={<About />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
