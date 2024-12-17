"use client"

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useStocks } from "@/context/selectedStocks";
import { Button } from "./ui/button";

type StockCardProps = {
  symbol: string;
};

type StockData = {
  longName: string;
  regularMarketPrice: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  marketCap: number;
  currencySymbol: string;
};

export default function StockCard({ symbol }: StockCardProps) {
  const { removeStock } = useStocks();
  const [stockData, setStockData] = useState<StockData | null>(null);

  useEffect(() => {
    async function fetchStockData() {
      try {
        const res = await fetch(`/api/quoteSummary?symbol=${symbol}`);
        const data = await res.json();
        setStockData({
          longName: data.price.longName,
          regularMarketPrice: data.price.regularMarketPrice,
          regularMarketDayHigh: data.summaryDetail.regularMarketDayHigh,
          regularMarketDayLow: data.summaryDetail.regularMarketDayLow,
          marketCap: data.summaryDetail.marketCap,
          currencySymbol: data.price.currencySymbol || "",
        });
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    }

    fetchStockData();
  }, [symbol]);

  if (!stockData) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>{stockData.longName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          <strong>Symbol:</strong> {symbol}
        </p>
        {/* <p className="text-sm">
          <strong>Current Price:</strong> {stockData.currencySymbol}
          {stockData.regularMarketPrice}
        </p>
        <p className="text-sm">
          <strong>Day High:</strong> {stockData.currencySymbol}
          {stockData.regularMarketDayHigh}
        </p>
        <p className="text-sm">
          <strong>Day Low:</strong> {stockData.currencySymbol}
          {stockData.regularMarketDayLow}
        </p>
        <p className="text-sm">
          <strong>Market Cap:</strong> {stockData.marketCap?.toString()}
        </p> */}

      </CardContent>
      <CardFooter>
      <Button variant="destructive" onClick={() => removeStock(symbol)}>
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
}