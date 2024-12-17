"use client";

import React, { useEffect, useState } from "react";
import { TableCell, TableRow } from "./ui/table";
import StockDate from "./StockDate";
import { Loader } from "lucide-react";
import { StockChart } from "./StockChart";

type StockRowProps = {
  symbol: string;
  duration: string;
  period1: Date;
  period2: Date;
};

type Quote = {
  date: string;
  close: number;
};

export const getInterval = (duration: string) => {
  switch (duration) {
    case "1d":
      return "30m";
    case "3d":
      return "1h";
    case "1w":
    case "1mo":
      return "1d";
    case "3mo":
    case "1y":
      return "1mo";
    case "3y":
    case "5y":
      return "3mo";
    default:
      return "1d";
  }
};

const StockRow = ({ symbol, duration, period1, period2 }: StockRowProps) => {
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [profitLossPercentages, setProfitLossPercentages] = useState<
    { date: string; profitLoss: string, closePrice: number }[]
  >([]);

  useEffect(() => {
    console.log("durationChanged for" + symbol + "to " + duration);

    const fetchHistoricalQuotes = async () => {
      console.log(period1);
      console.log(period2);
      setLoading(true);
      try {
        const interval = getInterval(duration);
        const response = await fetch(
          `/api/chart?symbol=${symbol}&period1=${period1}&period2=${period2}&interval=${interval}`
        );

        const data = await response.json();
        console.log(data);

        const formattedQuotes = data.quotes.map(
          (q: { date: Date; close: number }) => ({
            date: q.date,
            close: q.close,
          })
        );
        setQuotes(formattedQuotes);
      } catch (error) {
        console.error("Failed to fetch historical quotes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalQuotes();
  }, [symbol, duration, period1, period2]);

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        const response = await fetch(`/api/quoteSummary?symbol=${symbol}`);
        const data = await response.json();
        const price = data.price.regularMarketPrice;
        setCurrentPrice(price);
      } catch (error) {
        console.error("Failed to fetch current price:", error);
      }
    };

    fetchCurrentPrice();
    const interval = setInterval(fetchCurrentPrice, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  useEffect(() => {
    if (!currentPrice || quotes.length === 0) return;

    const updatedPercentages = quotes.map((quote) => {
      const profitLoss = ((currentPrice - quote.close) / currentPrice) * 100;
      return {
        date: quote.date,
        profitLoss: profitLoss.toFixed(2),
        closePrice: quote.close
      };
    });

    setProfitLossPercentages(updatedPercentages);
  }, [currentPrice, quotes]);

  return (
    <TableRow>
      {loading ? (
        <Loader className="animate-spin" />
      ) : (
        <>
          <TableCell>{symbol}</TableCell>
          <TableCell><StockChart loading={loading} data={profitLossPercentages}/></TableCell>
          <TableCell>
            {currentPrice !== null ? "₹"+currentPrice.toFixed(2) : <Loader className="animate-spin" />}
          </TableCell>
          {profitLossPercentages.map((entry) => (
            <TableCell key={entry.date}>
              <div>
                <StockDate
                  entryDate={entry.date}
                  duration={duration}
                ></StockDate>
              </div>
              <div><span className="font-bold">₹{entry.closePrice.toFixed(2)}</span>{" ("}<span className={Number(entry.profitLoss) >= 0 ? "text-green-600" : "text-red-600"}>{entry.profitLoss}%</span>{")"}</div>
            </TableCell>
          ))}
        </>
      )}
    </TableRow>
  );
};

export default StockRow;
