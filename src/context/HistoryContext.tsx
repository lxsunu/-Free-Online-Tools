import React, { createContext, useContext, useEffect, useState } from 'react';
import { HistoryEntry } from '../types/tool';

interface HistoryContextType {
  favorites: string[]; // tool slugs
  history: HistoryEntry[];
  toggleFavorite: (toolSlug: string) => void;
  isFavorite: (toolSlug: string) => boolean;
  addHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('omnitools_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('omnitools_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('omnitools_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('omnitools_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  const toggleFavorite = (toolSlug: string) => {
    setFavorites((prev) =>
      prev.includes(toolSlug)
        ? prev.filter((slug) => slug !== toolSlug)
        : [...prev, toolSlug]
    );
  };

  const isFavorite = (toolSlug: string): boolean => {
    return favorites.includes(toolSlug);
  };

  const addHistory = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    setHistory((prev) => [newEntry, ...prev.filter((item) => item.toolSlug !== entry.toolSlug)].slice(0, 30));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider
      value={{
        favorites,
        history,
        toggleFavorite,
        isFavorite,
        addHistory,
        clearHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
