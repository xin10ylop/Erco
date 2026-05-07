import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { SEED_REQUESTS } from '../data/seedData.js';

const RequestsContext = createContext(null);

export function RequestsProvider({ children }) {
  const [requests, setRequests] = useState(() =>
    SEED_REQUESTS.map((r) => ({ ...r }))
  );

  const addRequest = useCallback((req) => {
    setRequests((prev) => [req, ...prev]);
  }, []);

  const updateRequest = useCallback((id, patch) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  }, []);

  const getRequest = useCallback(
    (id) => requests.find((r) => r.id === id),
    [requests]
  );

  const nextId = useCallback(() => {
    const max = requests.reduce((acc, r) => {
      const n = parseInt(r.id.replace('REQ-', ''), 10);
      return Number.isFinite(n) ? Math.max(acc, n) : acc;
    }, 1000);
    return `REQ-${max + 1}`;
  }, [requests]);

  const value = useMemo(
    () => ({ requests, addRequest, updateRequest, getRequest, nextId }),
    [requests, addRequest, updateRequest, getRequest, nextId]
  );

  return (
    <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>
  );
}

export function useRequests() {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error('useRequests must be used within RequestsProvider');
  return ctx;
}
