"use client";

import { useStocks } from "@/context/selectedStocks";
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { SelectTrigger } from "@radix-ui/react-select";
import StockRow, { getInterval } from "./StockRow";

const StockTable = () => {
  const [duration, setDuration] = useState("1d");
  const { selectedStocks } = useStocks();
  const [period1, setPeriod1] = useState<Date>();
  const [period2, setPeriod2] = useState<Date>();

  useEffect(() => {
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
          break;
        case "3mo":
          now.setMonth(now.getMonth() - 3);
          break;
        case "1y":
          now.setFullYear(now.getFullYear() - 1);
          break;
        case "3y":
          now.setFullYear(now.getFullYear() - 3);
          break;
        case "5y":
          now.setFullYear(now.getFullYear() - 5);
          break;
        default:
          now.setMonth(now.getMonth() - 1);
      }
      return now;
    };

    const p2 = new Date();
    const p1 = calculatePeriod1(duration);
    p1.setHours(0, 0, 0, 0);

    setPeriod1(p1);
    setPeriod2(p2);
  }, [duration]);

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="duration" className="text-sm font-medium">
          Select Duration:
        </label>
        <Select value={duration} onValueChange={(val) => setDuration(val)}>
          <SelectTrigger className="w-[180px] border">
            <SelectValue defaultValue="1d" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">1 Day</SelectItem>
            <SelectItem value="3d">3 Days</SelectItem>
            <SelectItem value="1w">1 Week</SelectItem>
            <SelectItem value="1mo">1 Month</SelectItem>
            <SelectItem value="3mo">3 Months</SelectItem>
            <SelectItem value="1y">1 Year</SelectItem>
            <SelectItem value="3y">3 Years</SelectItem>
            <SelectItem value="5y">5 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md p-2">

        <Table className="w-full">
          <TableHeader>
            <TableRow className="rounded-lg">
              <TableHead>Stock Symbol</TableHead>
              <TableHead>Price Graph</TableHead>
              <TableHead>Current Price (INR)</TableHead>
              <TableHead colSpan={100}>
                Profit/Loss (%) Over Time ({getInterval(duration)}) interval
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedStocks.length === 0 && (<TableRow ><TableCell className="h-32 text-center" colSpan={4}>No Stocks Selected!</TableCell></TableRow>)}
            {selectedStocks.map((symbol) => (
              <StockRow
                key={symbol}
                symbol={symbol}
                duration={duration}
                period1={period1!}
                period2={period2!}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockTable;
