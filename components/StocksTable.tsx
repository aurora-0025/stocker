"use client";

import { useStocks } from "@/context/selectedStocks";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { SelectTrigger } from "@radix-ui/react-select";
import StockRow, { getInterval } from "./StockRow";
import { useAuth } from "@/context/authProvider";

const StockTable = () => {
  const {loading: authLoading} = useAuth()
  const [duration, setDuration] = useState("1d");
  const { selectedStocks } = useStocks();

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

        <Table className="w-full">
          <TableHeader>
            <TableRow className="rounded-lg">
              <TableHead>Actions</TableHead>
              <TableHead>Stock Symbol</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Avg Cost</TableHead>
              <TableHead>Price Graph</TableHead>
              <TableHead>Current Price (INR)</TableHead>
              <TableHead colSpan={100}>
                Profit/Loss (%) Over Time ({getInterval(duration)}) interval
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedStocks.length === 0 && (<TableRow ><TableCell className="h-32 text-center" colSpan={100}>{authLoading ? "Authenticating" : "No Stocks Selected!"}</TableCell></TableRow>)}
            {selectedStocks.map((stock) => (
              <StockRow
                key={stock.symbol}
                stock={stock}
                duration={duration}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockTable;
