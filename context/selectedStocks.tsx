"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "@/context/authProvider";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

export type StockData = {
  symbol: string;
  quantity: number;
  avgCost: number;
};

type StocksContextType = {
  selectedStocks: StockData[];
  addStock: (symbol: string, quantity?: number, avgCost?: number) => void;
  updateStock: (symbol: string, quantity: number, avgCost: number) => void;
  removeStock: (symbol: string) => void;
};

const StocksContext = createContext<StocksContextType | undefined>(undefined);

export const StocksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [selectedStocks, setSelectedStocks] = useState<StockData[]>([]);
  const db = getFirestore();

  // Fetch stocks from Firestore when the user logs in
  useEffect(() => {
    if (user) {
      const fetchStocks = async () => {
        const stocksRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(stocksRef);

        if (docSnap.exists()) {
          const storedStocks = docSnap.data().stocks || [];
          setSelectedStocks(storedStocks);
        }
      };
      fetchStocks();
    }
  }, [user, db]);

  const saveStocksToFirestore = async (stocks: StockData[]) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { stocks }, { merge: true });
  };

  const addStock = (symbol: string, quantity?: number, avgCost?: number) => {
    setSelectedStocks((prevStocks) => {
      const existingStock = prevStocks.find((stock) => stock.symbol === symbol);
      let updatedStocks;

      if (existingStock) {
        updatedStocks = prevStocks.map((stock) =>
          stock.symbol === symbol
            ? {
                ...stock,
                quantity: (stock.quantity || 0) + (quantity || 0),
                avgCost: avgCost !== undefined ? avgCost : stock.avgCost,
              }
            : stock
        );
      } else {
        updatedStocks = [
          ...prevStocks,
          { symbol, quantity: quantity || 0, avgCost: avgCost || 0 },
        ];
      }
      if (user) {
        saveStocksToFirestore(updatedStocks);
      }

      return updatedStocks;
    });
  };

  const updateStock = (symbol: string, quantity: number, avgCost: number) => {
    const updatedStocks = selectedStocks.map((stock) =>
      stock.symbol === symbol ? { ...stock, quantity, avgCost } : stock
    );
    setSelectedStocks(updatedStocks);

    if (user) {
      saveStocksToFirestore(updatedStocks);
    }
  };

  const removeStock = (symbol: string) => {
    const updatedStocks = selectedStocks.filter(
      (stock) => stock.symbol !== symbol
    );
    setSelectedStocks(updatedStocks);

    if (user) {
      saveStocksToFirestore(updatedStocks);
    }
  };

  return (
    <StocksContext.Provider
      value={{ selectedStocks, addStock, updateStock, removeStock }}
    >
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
