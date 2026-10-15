import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Footer } from './components/layout';
import { 
  HomePage, 
  CurvesPage, 
  SimulatorPage, 
  ComparisonPage, 
  DevelopersPage,
  WhitepaperPage
} from './pages';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export function AppContent() {
  return (
    <div className="min-h-screen bg-base-theme text-primary-theme flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      <ScrollToTop />

      {/* Apple Frosted Minimalist Navigation Bar */}
      <Navbar />

      {/* Main Multi-Page Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/curves" element={<CurvesPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/developers" element={<DevelopersPage />} />
          <Route path="/whitepaper" element={<WhitepaperPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Institutional Apple Footer */}
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
