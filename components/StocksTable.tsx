"use client";

import { useStocks } from "@/context/selectedStocks";
import React, { useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectValue } from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { SelectTrigger } from "@radix-ui/react-select";
import StockRow, { getInterval } from "./StockRow";
import { useAuth } from "@/context/authProvider";
import { ArrowRight } from "lucide-react";

const StockTable = () => {
  const { loading: authLoading } = useAuth();
  const [duration, setDuration] = useState("1d");
  const { selectedStocks } = useStocks();
  const tableRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    console.log("scroll");
    console.log(tableRef.current);

    if (tableRef.current) {
      console.log(tableRef.current.classList.values());
      tableRef.current.scrollBy({
        left: 200 * (direction == "left" ? -1 : 1),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="sm:p-2">
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
        <Table className="w-full" ref={tableRef}>
          <TableHeader>
            <TableRow className="rounded-lg">
              <TableHead>Actions</TableHead>
              <TableHead>Stock Symbol</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Avg Cost</TableHead>
              <TableHead>Current Price (INR)</TableHead>
              <TableHead>Price Graph</TableHead>
              <TableHead colSpan={100}>
                Profit/Loss (%) Over Time ({getInterval(duration)}) interval
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedStocks.length === 0 && (
              <TableRow>
                <TableCell className="h-32 text-center" colSpan={100}>
                  {authLoading ? "authenticating" : "No Stocks Selected!"}
                </TableCell>
              </TableRow>
            )}
            {selectedStocks.map((stock) => (
              <StockRow key={stock.symbol} stock={stock} duration={duration} />
            ))}
          </TableBody>
        </Table>
        {(tableRef.current?.scrollWidth ?? 0) >
          (tableRef.current?.clientWidth ?? 0) && (
          <>
            <button
              className="fixed bottom-10 right-10 p-2 bg-blue-500 text-white rounded-full shadow-lg"
              onClick={() => scroll("right")}
              aria-label="Scroll Right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              className="fixed bottom-10 right-20 p-2 bg-blue-500 text-white rounded-full shadow-lg"
              onClick={() => scroll("left")}
              aria-label="Scroll Left"
            >
              <ArrowRight className="w-5 h-5 transform rotate-180" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StockTable;
