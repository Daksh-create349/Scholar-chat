"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Star, ExternalLink, FileText } from "lucide-react";
import type { Paper } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AddToCollectionDialog } from "./add-to-collection-dialog";
import { PaperActionDialog } from "./paper-action-dialog";
import { useState } from "react";

interface PaperCardProps {
  paper: Paper;
}

export function PaperCard({ paper }: PaperCardProps) {
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1" onClick={() => setActionDialogOpen(true)}>
        <CardHeader>
          <CardTitle className="text-lg font-headline leading-snug">{paper.title}</CardTitle>
          <CardDescription className="text-sm pt-1">
            {paper.authors.slice(0, 3).join(", ")}
            {paper.authors.length > 3 && ", et al."}
          </CardDescription>
          <div className="flex items-center text-xs text-muted-foreground pt-1">
            {paper.publicationDate && (
              <>
                <span>{paper.publicationDate}</span>
                <span className="mx-2">·</span>
              </>
            )}
            {paper.citations > 0 && (
                <>
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-500" />
                <span>{paper.citations.toLocaleString()} citations</span>
                </>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">{paper.abstract}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {paper.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-secondary/30 p-3 mt-auto">
           <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); setCollectionDialogOpen(true); }}
            className="text-muted-foreground hover:text-primary"
          >
            <Bookmark className={cn("mr-2 h-4 w-4")} />
            Bookmark
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Actions
            <FileText className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      <AddToCollectionDialog 
        paper={paper}
        open={collectionDialogOpen}
        onOpenChange={setCollectionDialogOpen}
      />
      <PaperActionDialog
        paper={paper}
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
      />
    </>
  );
}
