"use client";

import React, { useEffect, useState } from "react";
import { TableCell, TableRow } from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { StockChart } from "./StockChart";
import { Loader, RefreshCw, MoreHorizontal, Trash } from "lucide-react"; // Import the icons
import StockDate from "./StockDate";
import { StockData, useStocks } from "@/context/selectedStocks";

type StockRowProps = {
  stock: StockData;
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

const StockRow = ({ stock, duration }: StockRowProps) => {
  const { removeStock, updateStock } = useStocks();
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [currentProfitAgainstAvg, setCurrentProfitAgainstAvg] =
    useState<number>(0);
  const [profitLossPercentages, setProfitLossPercentages] = useState<
    { date: string; profitLoss: string; closePrice: number }[]
  >([]);
  const [quantity, setQuantity] = useState<number>(stock.quantity);
  const [avgCost, setAvgCost] = useState<number>(stock.avgCost);

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

      const response = await fetch(
        `/api/chart?symbol=${stock.symbol}&period1=${p1}&period2=${p2}&interval=${interval}`
      );

      const data = await response.json();
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
        const response = await fetch(
          `/api/quoteSummary?symbol=${stock.symbol}`
        );
        const data = await response.json();
        const price = data.price.regularMarketPrice;
        setCurrentPrice(price);
        if (avgCost == 0) {
          setCurrentProfitAgainstAvg(0);
        } else {
          const profit = ((price - avgCost) / price) * 100;
          setCurrentProfitAgainstAvg(profit);
        }
      } catch (error) {
        console.error("Failed to fetch current price:", error);
      }
    };

    fetchCurrentPrice();
    const interval = setInterval(fetchCurrentPrice, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stock.symbol]);

  useEffect(() => {
    if (avgCost == 0) {
      setCurrentProfitAgainstAvg(0);
    } else {
      const profit =
        ((avgCost - (currentPrice ?? 0)) / (currentPrice ?? 0)) * 100;
      setCurrentProfitAgainstAvg(profit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avgCost]);

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

  const handleUpdateStock = () => {
    updateStock(stock.symbol, quantity, avgCost);
  };

  return (
    <TableRow className="h-[80px]">
      {loading ? (
        <TableCell colSpan={5} className="h-[76.8px]">
          <Loader className="animate-spin" />
        </TableCell>
      ) : (
        <>
          <TableCell>
            <div className="flex">
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => fetchHistoricalQuotes()}
              >
                <RefreshCw className="w-2 h-2" />
              </Button>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => removeStock(stock.symbol)}
              >
                <Trash className="w-2 h-2" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <MoreHorizontal className="w-2 h-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="flex flex-col space-y-4 p-2 rounded-md">
                    <label>
                      Quantity:
                      <input
                        type="number"
                        className="border rounded-md p-1 w-full"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                      />
                    </label>
                    <label>
                      Avg Cost:
                      <input
                        type="number"
                        className="border rounded-md p-1 w-full"
                        value={avgCost}
                        onChange={(e) => setAvgCost(Number(e.target.value))}
                      />
                    </label>
                    <Button onClick={handleUpdateStock} size="sm">
                      Save
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableCell>
          <TableCell>{stock.symbol}</TableCell>
          <TableCell>{stock.quantity > 0 ? stock.quantity : "N/A"}</TableCell>
          <TableCell>{stock.avgCost > 0 ? stock.avgCost : "N/A"}</TableCell>
          <TableCell>
            {currentPrice !== null ? (
              <p className="flex flex-col gap-2">
                <span className="font-bold">
                  {"₹" + currentPrice.toFixed(2)}
                </span>

                {currentProfitAgainstAvg != 0 && (
                  <span
                    className={
                      Number(currentProfitAgainstAvg) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    ({currentProfitAgainstAvg.toFixed(2)}%)
                  </span>
                )}
              </p>
            ) : (
              <Loader className="animate-spin" />
            )}
          </TableCell>
          <TableCell>
            <StockChart loading={loading} data={profitLossPercentages} />
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
