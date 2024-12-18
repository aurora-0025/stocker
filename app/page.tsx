import AuthButton from "@/components/AuthButton";
import SearchBar from "@/components/SearchBar";
import StocksTable from "@/components/StocksTable";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="p-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 my-5">Stocker</h1>
        </div>
        <div className="flex-grow">
          <SearchBar/>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle/>
          <AuthButton />
        </div>
      </div>
        <Suspense fallback={<Loader className="animate-spin" /> }>
        </Suspense>
        <StocksTable/>
    </div>
  );
}
