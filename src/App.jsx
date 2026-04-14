import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CardDetailPage from './pages/CardDetailPage';
import ReviewPage from './pages/ReviewPage';
import ReportPage from './pages/ReportPage';

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/card/:slug" element={<CardDetailPage />} />
            <Route path="/card/:slug/review" element={<ReviewPage />} />
            <Route path="/card/:slug/report" element={<ReportPage />} />
          </Routes>
          <footer className="py-8 mt-12 text-center px-6" style={{ boxShadow: 'rgba(255,255,255,0.04) 0px -1px 0px' }}>
            <p className="text-[11px]" style={{ color: '#4a4d54' }}>SlashCard — Independent crypto card reviews. No affiliation with any card issuer.</p>
          </footer>
        </div>
      </BrowserRouter>
    </DataProvider>
  );
}
