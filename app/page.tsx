import AuthButton from "@/components/AuthButton";
import SearchBar from "@/components/SearchBar";
import StocksTable from "@/components/StocksTable";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="p-2 sm:p-10 h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center pb-5 mb-5 border-b">
          <div className="flex items-center">
            <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              Stocker
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
        <div className="flex-grow">
            <SearchBar />
          </div>
        <Suspense fallback={<Loader className="animate-spin" />}></Suspense>
        <StocksTable />
      </div>
    </div>
  );
}
