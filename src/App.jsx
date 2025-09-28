import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import About from '@/pages/About';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import ReturnPolicy from '@/pages/ReturnPolicy';
import Contact from '@/pages/Contact';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<About />} />
  <Route path="/terms" element={<Terms />} />
  <Route path="/privacy-policy" element={<Privacy />} />
  <Route path="/return-policy" element={<ReturnPolicy />} />
  <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

