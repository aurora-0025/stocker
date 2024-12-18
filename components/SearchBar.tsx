"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStocks } from "@/context/selectedStocks";

type SearchResult = {
  symbol: string;
  shortName: string;
};

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
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

  useEffect(() => {
    const delayDebounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(delayDebounce);
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
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a stock..."
        className="mb-4"
        onFocus={() => setDropdownVisible(true)}
      />
      {isDropdownVisible && results.length > 0 && (
        <div className="space-y-2 absolute top-[40px] w-full p-2 bg-gray-50 z-50">
          {results.map((result) => {
            const isSelected = selectedStocks.includes(result.symbol);
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
                    isSelected ? removeStock(result.symbol) : addStock(result.symbol)
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
