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
        <div className="min-h-screen bg-zinc-950">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/card/:slug" element={<CardDetailPage />} />
            <Route path="/card/:slug/review" element={<ReviewPage />} />
            <Route path="/card/:slug/report" element={<ReportPage />} />
          </Routes>
          <footer className="border-t border-zinc-800/50 py-8 mt-12 text-center">
            <p className="text-[11px] text-zinc-600">SlashCard — Independent crypto card reviews. No affiliation with any card issuer.</p>
          </footer>
        </div>
      </BrowserRouter>
    </DataProvider>
  );
}
