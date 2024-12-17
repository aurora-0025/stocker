"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";

type StocksContextType = {
  selectedStocks: string[];
  addStock: (symbol: string) => void;
  removeStock: (symbol: string) => void;
};

const StocksContext = createContext<StocksContextType | undefined>(undefined);

export const StocksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);

  const addStock = (symbol: string) => {
    if (!selectedStocks.includes(symbol)) {
      setSelectedStocks((prev) => [...prev, symbol]);
    }
  };

  const removeStock = (symbol: string) => {
    setSelectedStocks((prev) => prev.filter((stock) => stock !== symbol));
  };

  return (
    <StocksContext.Provider value={{ selectedStocks, addStock, removeStock }}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocks = (): StocksContextType => {
  const context = useContext(StocksContext);
  if (!context) {
    throw new Error("useStocks must be used within a StocksProvider");
  }
  return context;
};
