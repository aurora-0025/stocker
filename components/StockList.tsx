"use client"

import React from "react";
import StockCard from "./StockCard";
import { useStocks } from "@/context/selectedStocks";

export default function StockList() {
  const { selectedStocks } = useStocks();

  return (
    <div style={{scrollbarWidth: "none"}} className="flex gap-2 flex-nowrap overflow-scroll">
      {selectedStocks.map((symbol) => (
        <StockCard key={symbol} symbol={symbol} />
      ))}
    </div>
  );
}
