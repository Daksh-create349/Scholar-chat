import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Book, Plus, Search as SearchIcon } from 'lucide-react';
import { mockCollections } from '@/lib/mock-data';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, Researcher!</h1>
        <p className="text-muted-foreground mt-1">
          What new discovery will you make today?
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Start a new search</CardTitle>
          <CardDescription>
            Use keywords, topics, authors, or specific paper titles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex w-full items-center space-x-2">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input type="search" placeholder="e.g., 'Quantum computing breakthroughs 2024'" className="pl-10" />
              </div>
              <Button type="submit">Search</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-headline">My Collections</h2>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Collection
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockCollections.map((collection) => (
            <Card key={collection.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium font-headline">
                  {collection.name}
                </CardTitle>
                <Book className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
                <div className="text-xs text-muted-foreground mt-4">
                    {collection.paperCount} papers · Last updated {collection.lastUpdated}
                </div>
              </CardContent>
              <CardContent>
                 <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/dashboard/collections">View Collection <ArrowRight className="ml-2 h-4 w-4" /></Link>
                 </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
