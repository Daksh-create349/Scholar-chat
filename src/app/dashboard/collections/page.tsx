'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Loader2, Book, Edit, Trash2 } from "lucide-react";
import { PaperCard } from "@/components/paper-card";
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import type { Collection, Paper } from '@/lib/types';
import { collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { CreateCollectionDialog } from '@/components/create-collection-dialog';
import { ManageCollectionDialog } from '@/components/manage-collection-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

function CollectionsPageComponent() {
  const { user } = useUser();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [manageCollection, setManageCollection] = useState<Collection | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoadingPapers, setIsLoadingPapers] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const collectionsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/collections`);
  }, [firestore, user]);

  const { data: collections, isLoading: isLoadingCollections } = useCollection<Collection>(collectionsQuery);
  
  useEffect(() => {
    const collectionIdFromUrl = searchParams.get('collectionId');
    if (collectionIdFromUrl && collections?.some(c => c.id === collectionIdFromUrl)) {
      setActiveTab(collectionIdFromUrl);
    } else if (collections && collections.length > 0 && !activeTab) {
      setActiveTab(collections[0].id);
    }
  }, [collections, searchParams, activeTab]);

  useEffect(() => {
    const fetchPapers = async () => {
      if (!activeTab || !collections || !firestore) return;

      const currentCollection = collections.find(c => c.id === activeTab);
      if (!currentCollection || !currentCollection.paperIds || currentCollection.paperIds.length === 0) {
        setPapers([]);
        return;
      }
      
      setIsLoadingPapers(true);
      try {
        const papersRef = collection(firestore, 'research_papers');
        // Firestore 'in' query is limited to 30 elements
        const paperChunks = [];
        for (let i = 0; i < currentCollection.paperIds.length; i += 30) {
          paperChunks.push(currentCollection.paperIds.slice(i, i + 30));
        }
        
        const paperPromises = paperChunks.map(chunk => 
          getDocs(query(papersRef, where('__name__', 'in', chunk)))
        );
        
        const paperSnapshots = await Promise.all(paperPromises);
        const fetchedPapers = paperSnapshots.flatMap(snapshot => 
          snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Paper))
        );

        setPapers(fetchedPapers);
      } catch (error) {
        console.error("Error fetching papers:", error);
        toast({ title: "Error", description: "Could not fetch papers for this collection.", variant: "destructive" });
      } finally {
        setIsLoadingPapers(false);
      }
    };
    fetchPapers();
  }, [activeTab, collections, firestore, toast]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/dashboard/collections?collectionId=${value}`, { scroll: false });
  };

  const handleDeleteCollection = async (collectionId: string) => {
    if (!firestore || !user) return;
    
    const docRef = doc(firestore, `users/${user.uid}/collections`, collectionId);
    deleteDocumentNonBlocking(docRef);

    toast({ title: "Collection deleted", description: "The collection has been successfully deleted." });

    if (activeTab === collectionId) {
        const remainingCollections = collections?.filter(c => c.id !== collectionId);
        if (remainingCollections && remainingCollections.length > 0) {
            setActiveTab(remainingCollections[0].id);
            router.push(`/dashboard/collections?collectionId=${remainingCollections[0].id}`, { scroll: false });
        } else {
            setActiveTab(null);
            router.push(`/dashboard/collections`, { scroll: false });
        }
    }
  };


  return (
    <>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Collections</h1>
          <p className="text-muted-foreground mt-1">
            Organize, annotate, and share your research.
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </div>

      {isLoadingCollections ? (
        <div className="space-y-4">
            <div className="h-10 w-1/3 bg-muted rounded-md animate-pulse"></div>
            <Card><CardHeader><CardTitle className="h-6 w-1/4 bg-muted rounded-md animate-pulse"></CardTitle><CardDescription className="h-4 w-1/2 bg-muted rounded-md animate-pulse mt-2"></CardDescription></CardHeader><CardContent><div className="h-40 w-full bg-muted rounded-md animate-pulse"></div></CardContent></Card>
        </div>
      ) : collections && collections.length > 0 ? (
        <Tabs value={activeTab || ""} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            {collections.map((collection) => (
              <TabsTrigger key={collection.id} value={collection.id}>
                {collection.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {collections.map((collection) => (
            <TabsContent key={collection.id} value={collection.id}>
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="font-headline">{collection.name}</CardTitle>
                    <CardDescription className="mt-1">{collection.description}</CardDescription>
                  </div>
                   <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setManageCollection(collection)}>
                      <Edit className="h-5 w-5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your collection.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCollection(collection.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                   </div>
                </CardHeader>
                <CardContent>
                  {isLoadingPapers ? (
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({length: 4}).map((_, i) => (
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
                  ) : papers.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {papers.map((paper) => (
                          <PaperCard key={paper.id} paper={paper} />
                      ))}
                    </div>
                  ) : (
                      <Card className="flex flex-col items-center justify-center border-dashed">
                         <div className="text-center p-6">
                           <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                           <p className="mt-4 text-sm font-medium">Add papers to this collection</p>
                           <p className="mt-1 text-xs text-muted-foreground">Find papers using the search page.</p>
                           <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push('/dashboard/search')}>
                              Go to Search
                           </Button>
                         </div>
                      </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card className="text-center py-20">
          <CardContent>
            <Book className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="mt-6 text-2xl font-bold">No Collections Yet</h2>
            <p className="mt-2 text-muted-foreground">Create your first collection to start organizing your research papers.</p>
            <Button className="mt-6" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Collection
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
    <CreateCollectionDialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen} />
    {manageCollection && (
        <ManageCollectionDialog
            collection={manageCollection}
            open={!!manageCollection}
            onOpenChange={(isOpen) => {
                if (!isOpen) setManageCollection(null);
            }}
        />
    )}
    </>
  );
}

export default function CollectionsPage() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <CollectionsPageComponent />
        </Suspense>
    )
}
