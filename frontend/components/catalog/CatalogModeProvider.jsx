'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CatalogModeContext = createContext({
  isCatalogOnly: true,
  gateVisible: false,
  dismiss: () => {},
  resetGate: () => {},
});

const STORAGE_KEY = 'bs-market';

export function CatalogModeProvider({ children }) {
  const [gateVisible, setGateVisible] = useState(false);

  useEffect(() => {
    async function init() {
      await Promise.resolve();
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== 'dismissed') setGateVisible(true);
    }
    init();
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, 'dismissed');
    setGateVisible(false);
  }

  function resetGate() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
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
