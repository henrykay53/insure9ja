import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ApplicationFlow } from './components/application/ApplicationFlow';
import { Header } from './components/insure9ja/Header';
import Home from './pages/Home';
import About from './pages/About';
import { Footer } from './components/insure9ja/Footer';

export default function App() {
  const [showApplication, setShowApplication] = useState(false);

  if (showApplication) {
    return <ApplicationFlow onClose={() => setShowApplication(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onStartApplication={() => setShowApplication(true)} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />}/>

        </Routes>
      
      <Footer />
    </div>
  );
}
