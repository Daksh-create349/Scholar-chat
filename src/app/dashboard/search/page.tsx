"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListFilter, Search as SearchIcon, Loader2 } from "lucide-react";
import { PaperCard } from "@/components/paper-card";
import { findRelevantPapers, FindRelevantPapersOutput } from "@/ai/flows/find-relevant-papers";
import type { Paper } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

function SearchPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
    try {
      const results: FindRelevantPapersOutput = await findRelevantPapers({ keywords: query });
      const papersData: Paper[] = results.papers.map((p, index) => ({
        id: (Date.now() + index).toString(),
        title: p.title,
        authors: p.authors || [],
        publicationDate: "", // AI flow doesn't provide date
        abstract: p.summary,
        citations: 0, // AI flow doesn't provide citations
        url: p.url,
        tags: [], // AI flow doesn't provide tags
      }));
      setPapers(papersData);
    } catch (e) {
      console.error(e);
      setError("An error occurred while fetching papers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, []);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Search Papers</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? "Searching for papers..." : `Found ${papers.length} papers for your query.`}
          </p>
        </div>
        <form onSubmit={onSearchSubmit} className="flex w-full md:w-auto items-center space-x-2">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Enter keywords..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Search"}
          </Button>
        </form>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sort by:</span>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="citations">Citations</SelectItem>
              <SelectItem value="date-newest">Date (Newest)</SelectItem>
              <SelectItem value="date-oldest">Date (Oldest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <ListFilter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Date Range</DropdownMenuItem>
            <DropdownMenuItem>Author</DropdownMenuItem>
            <DropdownMenuItem>Open Access</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {error && <p className="text-destructive">{error}</p>}

      {isLoading && papers.length === 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({length: 8}).map((_, i) => (
                <Card key={i}><CardContent className="p-6"><div className="animate-pulse space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="space-y-2 pt-4">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                    </div>
                </div></CardContent></Card>
            ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {papers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPageComponent />
        </Suspense>
    )
}
