"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Book, Plus, Search as SearchIcon, Loader2 } from 'lucide-react';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import type { Collection } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { CreateCollectionDialog } from '@/components/create-collection-dialog';

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();
  const firestore = useFirestore();
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const collectionsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/collections`);
  }, [firestore, user]);

  const { data: collections, isLoading: isLoadingCollections } = useCollection<Collection>(collectionsQuery);


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, {user?.displayName || 'Researcher'}!</h1>
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
          <form onSubmit={handleSearchSubmit}>
            <div className="flex w-full items-center space-x-2">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="e.g., 'Quantum computing breakthroughs 2024'" 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-headline">My Collections</h2>
          <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Collection
          </Button>
        </div>
        {isLoadingCollections ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({length: 3}).map((_, i) => (
                    <Card key={i}><CardContent className="p-6"><div className="animate-pulse space-y-4">
                        <div className="h-6 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-full mt-4"></div>
                        <div className="h-9 bg-muted rounded w-full mt-2"></div>
                    </div></CardContent></Card>
                ))}
            </div>
        ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {collections?.map((collection) => (
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
                    {collection.paperIds?.length || 0} papers · Last updated {formatDistanceToNow(collection.createdAt.toDate())} ago
                </div>
              </CardContent>
              <CardContent>
                 <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/dashboard/collections?collectionId=${collection.id}`}>View Collection <ArrowRight className="ml-2 h-4 w-4" /></Link>
                 </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        )}
        {!isLoadingCollections && collections?.length === 0 && (
            <Card className="text-center py-12">
                <CardContent>
                    <Book className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No collections yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Create your first collection to start organizing papers.</p>
                    <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Collection
                    </Button>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
    <CreateCollectionDialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  );
}
