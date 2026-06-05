'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CatalogModeContext = createContext({
  isCatalogOnly: true,
  gateVisible: false,
  dismiss: () => {},
  resetGate: () => {},
});

const STORAGE_KEY = 'bs-market';

// Let the site load and settle before the market selector pops up.
const GATE_DELAY_MS = 2800;

export function CatalogModeProvider({ children }) {
  const [gateVisible, setGateVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dismissed') return;

    const timer = setTimeout(() => setGateVisible(true), GATE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, 'dismissed');
    setGateVisible(false);
  }

  function resetGate() {
    localStorage.removeItem(STORAGE_KEY);
    // User explicitly asked to pick a market — open immediately, no delay.
    setGateVisible(true);
  }

  return (
    <CatalogModeContext.Provider
      value={{
        isCatalogOnly: true,
        gateVisible,
        dismiss,
        resetGate,
      }}
    >
      {children}
    </CatalogModeContext.Provider>
  );
}

export function useCatalogMode() {
  return useContext(CatalogModeContext);
}
