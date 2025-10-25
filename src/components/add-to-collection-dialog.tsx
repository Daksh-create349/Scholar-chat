'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, arrayUnion, arrayRemove, writeBatch, setDoc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Check } from 'lucide-react';
import type { Paper, Collection } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { CreateCollectionDialog } from './create-collection-dialog';
import { updateDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface AddToCollectionDialogProps {
  paper: Paper;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddToCollectionDialog({ paper, open, onOpenChange }: AddToCollectionDialogProps) {
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const collectionsQuery = useMemoFirebase(() => {
    if (!firestore || !auth?.currentUser) return null;
    return collection(firestore, `users/${auth.currentUser.uid}/collections`);
  },[firestore, auth?.currentUser]);

  const { data: collections, isLoading: isLoadingCollections } = useCollection<Collection>(collectionsQuery);

  useEffect(() => {
    if (collections) {
      const initialSelected = new Set<string>();
      collections.forEach(c => {
        if (c.paperIds?.includes(paper.id)) {
          initialSelected.add(c.id);
        }
      });
      setSelectedCollections(initialSelected);
    }
  }, [collections, paper.id]);

  const handleToggleCollection = (collectionId: string) => {
    setSelectedCollections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(collectionId)) {
        newSet.delete(collectionId);
      } else {
        newSet.add(collectionId);
      }
      return newSet;
    });
  };

  const handleSaveChanges = async () => {
    if (!firestore || !auth?.currentUser || !collections) return;
    setIsLoading(true);

    try {
        const paperRef = doc(firestore, 'research_papers', paper.id);
        const paperSnap = await getDoc(paperRef);

        if (!paperSnap.exists()) {
             // Paper doesn't exist, so we create it.
             const paperData = {
                title: paper.title,
                authors: paper.authors,
                publicationDate: paper.publicationDate,
                abstract: paper.abstract,
                citations: paper.citations,
                url: paper.url,
                tags: paper.tags,
             };
             setDocumentNonBlocking(paperRef, paperData, { merge: true });
        }


      for (const collection of collections) {
        const collectionRef = doc(firestore, `users/${auth.currentUser.uid}/collections`, collection.id);
        const shouldBeIn = selectedCollections.has(collection.id);
        const isCurrentlyIn = collection.paperIds?.includes(paper.id);

        if (shouldBeIn && !isCurrentlyIn) {
          updateDocumentNonBlocking(collectionRef, { paperIds: arrayUnion(paper.id) });
        } else if (!shouldBeIn && isCurrentlyIn) {
          updateDocumentNonBlocking(collectionRef, { paperIds: arrayRemove(paper.id) });
        }
      }

      toast({
        title: 'Success',
        description: 'Your collections have been updated.',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating collections: ', error);
      toast({
        title: 'Error',
        description: 'Failed to update collections. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Collection</DialogTitle>
            <DialogDescription>Select the collections to add this paper to.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoadingCollections ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {collections?.map(c => (
                    <div
                      key={c.id}
                      onClick={() => handleToggleCollection(c.id)}
                      className="flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-secondary"
                    >
                      <div className='flex-1'>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-sm text-muted-foreground">{c.description}</p>
                      </div>
                      {selectedCollections.has(c.id) && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  ))}
                  {collections?.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      You haven't created any collections yet.
                    </p>
                  )}
                </div>
              </ScrollArea>
            )}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                onOpenChange(false);
                setCreateDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Collection
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CreateCollectionDialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  );
}
