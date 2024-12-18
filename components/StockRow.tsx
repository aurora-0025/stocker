"use client";

import React, { useEffect, useState } from "react";
import { TableCell, TableRow } from "./ui/table";
import StockDate from "./StockDate";
import { Loader, RefreshCw } from "lucide-react"; // Import the refresh icon
import { StockChart } from "./StockChart";

type StockRowProps = {
  symbol: string;
  duration: string;
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

const StockRow = ({ symbol, duration }: StockRowProps) => {
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [profitLossPercentages, setProfitLossPercentages] = useState<
    { date: string; profitLoss: string; closePrice: number }[]
  >([]);

  const calculatePeriod1 = (duration: string) => {
    const now = new Date();
    switch (duration) {
      case "1d":
        now.setDate(now.getDate() - 1);
        break;
      case "3d":
        now.setDate(now.getDate() - 3);
        break;
      case "1w":
        now.setDate(now.getDate() - 7);
        break;
      case "1mo":
        now.setMonth(now.getMonth() - 1);
        now.setDate(1);
        break;
      case "3mo":
        now.setMonth(now.getMonth() - 3);
        console.log("3mo");
        now.setDate(1);
        break;
      case "1y":
        now.setFullYear(now.getFullYear() - 1);
        now.setMonth(1);
        now.setDate(1);
        break;
      case "3y":
        now.setFullYear(now.getFullYear() - 3);
        now.setMonth(1);
        now.setDate(1);
        break;
      case "5y":
        now.setFullYear(now.getFullYear() - 5);
        now.setMonth(1);
        now.setDate(1);
        break;
      default:
        now.setMonth(now.getMonth() - 1);
    }
    return now;
  };

  const fetchHistoricalQuotes = async () => {
    setLoading(true);
    try {
      const interval = getInterval(duration);
      const p2 = new Date();
      const p1 = calculatePeriod1(duration);
      p1.setHours(0, 0, 0, 0);
      console.log(p1);
      const response = await fetch(
        `/api/chart?symbol=${symbol}&period1=${p1}&period2=${p2}&interval=${interval}`
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

  useEffect(() => {
    fetchHistoricalQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

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
        closePrice: quote.close,
      };
    });

    setProfitLossPercentages(updatedPercentages);
  }, [currentPrice, quotes]);

  return (
    <TableRow className="h-[80px]">
      {loading ? (
        <TableCell colSpan={5} className="h-[76.8px]">
          <Loader className="animate-spin" />
        </TableCell>
      ) : (
        <>
          <TableCell>
            <button
              onClick={fetchHistoricalQuotes}
              title="Refresh Data"
              className="hover:text-blue-500 transition"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </TableCell>
          <TableCell>{symbol}</TableCell>
          <TableCell>
            <StockChart loading={loading} data={profitLossPercentages} />
          </TableCell>
          <TableCell>
            {currentPrice !== null ? (
              "₹" + currentPrice.toFixed(2)
            ) : (
              <Loader className="animate-spin" />
            )}
          </TableCell>
          {profitLossPercentages.map((entry) => (
            <TableCell key={entry.date}>
              <div>
                <StockDate
                  entryDate={entry.date}
                  duration={duration}
                ></StockDate>
              </div>
              <div>
                <span className="font-bold">
                  ₹{entry.closePrice?.toFixed(2) ?? "N/A"}
                </span>{" "}
                (
                <span
                  className={
                    Number(entry.profitLoss) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {entry.profitLoss}%
                </span>
                )
              </div>
            </TableCell>
          ))}
        </>
      )}
    </TableRow>
  );
};

export default StockRow;
