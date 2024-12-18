"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStocks } from "@/context/selectedStocks";
import { Loader, UploadCloud } from "lucide-react";
import * as XLSX from "xlsx";

type SearchResult = {
  symbol: string;
  shortName: string;
};

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [fileUploadError, setFileUploadError] = useState("");
  const [parsingInput, setParsingInput] = useState(false);
  const { selectedStocks, addStock, removeStock } = useStocks();
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setDropdownVisible(true);
  };

  const fetchResults = async () => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/search?query=${query}`);
      const data = (await response.json()) as SearchResult[];
      setResults(data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setParsingInput(true);
      setFileUploadError("");
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          setParsingInput(true);
          const data = e.target?.result;
          if (!data) return;
          const workbook = XLSX.read(data);
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet) as {
            ISIN: string;
            Quantity: number;
            "Average Cost Price": number;
          }[];
          setParsingInput(true);

          for (const row of parsedData) {
            const stockID = row["ISIN"];
            const quantity = row["Quantity"];
            const avgCost = row["Average Cost Price"]

            if (!stockID || !quantity || !avgCost) continue;

            try {
              const response = await fetch(`/api/search?query=${stockID}`);
              const data = (await response.json()) as SearchResult[];
              console.log(data);

              if (data?.length > 0) {
                const stock = data[0];
                addStock(stock.symbol, quantity, avgCost);
              }
            } catch (error) {
              console.error(`Failed to fetch stock for ${stockID}:`, error);
            }
          }
          setParsingInput(false);
        } catch (error) {
          console.error(error);
          setFileUploadError("There was an error parsing the given file");
          setParsingInput(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
      setFileUploadError("There was an error parsing the given excel file");
    } finally {
      event.target.value = "";
      setParsingInput(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto relative" ref={containerRef}>
      {fileUploadError && <p className="text-red-600">{fileUploadError}</p>}
      <div className="flex items-center mb-4">
        <label htmlFor="file-upload" className="cursor-pointer mr-2">
          {parsingInput ? (
            <Loader className="animate-spin" />
          ) : (
            <UploadCloud className="w-6 h-6 text-gray-600" />
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx"
          disabled={parsingInput}
          onChange={handleFileUpload}
          className="hidden"
        />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a stock..."
          onFocus={() => setDropdownVisible(true)}
        />
      </div>
      {isDropdownVisible && results.length > 0 && (
        <div className="space-y-2 absolute top-[40px] w-full p-2 bg-gray-50 z-50">
          {results.map((result) => {
            const existingStock = selectedStocks.find(
              (stock) => stock.symbol === result.symbol
            );
            const isSelected = Boolean(existingStock);
            return (
              <div
                key={result.symbol}
                className="flex justify-between items-center p-4 bg-muted rounded-md shadow-sm"
              >
                <span className="text-sm font-medium">
                  <strong>{result.symbol}</strong> - {result.shortName}
                </span>
                <Button
                  variant={isSelected ? "destructive" : "default"}
                  onClick={() =>
                    isSelected
                      ? removeStock(result.symbol)
                      : addStock(result.symbol)
                  }
                >
                  {isSelected ? "Remove" : "Add"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
