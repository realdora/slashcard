import { createContext, useContext, useState, useCallback } from 'react';
import { cards as initialCards, mockReviews, mockSlashReports, mockIntel } from '../data/cards';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [reviews, setReviews] = useState(mockReviews);
  const [slashReports, setSlashReports] = useState(mockSlashReports);
  const [intel, setIntel] = useState(mockIntel);

  const addReview = useCallback((review) => {
    setReviews(prev => [{ ...review, id: 'r' + Date.now(), created_at: new Date().toISOString() }, ...prev]);
  }, []);

  const addSlashReport = useCallback((report) => {
    setSlashReports(prev => [{ ...report, id: 's' + Date.now(), created_at: new Date().toISOString() }, ...prev]);
  }, []);

  const confirmIntel = useCallback((intelId) => {
    setIntel(prev => prev.map(i => i.id === intelId ? { ...i, confirms: i.confirms + 1 } : i));
  }, []);

  const denyIntel = useCallback((intelId) => {
    setIntel(prev => prev.map(i => i.id === intelId ? { ...i, denies: i.denies + 1 } : i));
  }, []);

  const getCardReviews = useCallback((cardId) => {
    return reviews.filter(r => r.card_id === cardId);
  }, [reviews]);

  const getCardSlashReports = useCallback((cardId) => {
    return slashReports.filter(s => s.card_id === cardId);
  }, [slashReports]);

  const getCardIntel = useCallback((cardId) => {
    return intel.filter(i => i.card_id === cardId);
  }, [intel]);

  const getCardStats = useCallback((cardId) => {
    const cardReviews = reviews.filter(r => r.card_id === cardId);
    const cardReports = slashReports.filter(s => s.card_id === cardId);
    const sevenDaysAgo = Date.now() - 7 * 24 * 3600000;
    const recentReports = cardReports.filter(s => new Date(s.created_at).getTime() > sevenDaysAgo);
    const avgRating = cardReviews.length > 0
      ? cardReviews.reduce((sum, r) => sum + r.rating, 0) / cardReviews.length : 0;
    let status = 'green';
    if (recentReports.length > 15) status = 'red';
    else if (recentReports.length > 5) status = 'yellow';
    const cardIntel = intel.filter(i => i.card_id === cardId);
    const activePromos = cardIntel.filter(i => i.type === 'promo' && (!i.expires_at || new Date(i.expires_at) > new Date()));
    return { reviewCount: cardReviews.length, avgRating, recentSlashCount: recentReports.length, status, activePromos: activePromos.length };
  }, [reviews, slashReports, intel]);

  // Unified feed: intel + slash reports + reviews, sorted by time
  const getFeed = useCallback(() => {
    const items = [
      ...intel.map(i => ({ ...i, feedType: 'intel', card: initialCards.find(c => c.id === i.card_id) })),
      ...slashReports.map(s => ({ ...s, feedType: 'slash', card: initialCards.find(c => c.id === s.card_id) })),
      ...reviews.map(r => ({ ...r, feedType: 'review', card: initialCards.find(c => c.id === r.card_id) })),
    ];
    return items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 30);
  }, [intel, slashReports, reviews]);

  return (
    <DataContext.Provider value={{
      cards: initialCards, reviews, slashReports, intel,
      addReview, addSlashReport, confirmIntel, denyIntel,
      getCardReviews, getCardSlashReports, getCardIntel, getCardStats, getFeed,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
