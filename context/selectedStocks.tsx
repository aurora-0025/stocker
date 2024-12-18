"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "@/context/authProvider";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

type StocksContextType = {
  selectedStocks: string[];
  addStock: (symbol: string) => void;
  removeStock: (symbol: string) => void;
};

const StocksContext = createContext<StocksContextType | undefined>(undefined);

export const StocksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const db = getFirestore();

  useEffect(() => {
    if (user) {
      const fetchStocks = async () => {
        const stocksRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(stocksRef);

        if (docSnap.exists()) {
          setSelectedStocks(docSnap.data().stocks || []);
        }
      };
      fetchStocks();
    }
  }, [user, db]);

  const saveStocksToFirestore = async (stocks: string[]) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { stocks }, { merge: true });
  };

  const addStock = (symbol: string) => {
    if (!selectedStocks.includes(symbol)) {
      const updatedStocks = [...selectedStocks, symbol];
      setSelectedStocks(updatedStocks);

      if (user) {
        saveStocksToFirestore(updatedStocks);
      }
    }
  };

  const removeStock = (symbol: string) => {
    const updatedStocks = selectedStocks.filter((stock) => stock !== symbol);
    setSelectedStocks(updatedStocks);

    if (user) {
      saveStocksToFirestore(updatedStocks);
    }
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
