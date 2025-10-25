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
import { Bookmark, Star, ExternalLink } from "lucide-react";
import type { Paper } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AddToCollectionDialog } from "./add-to-collection-dialog";
import { useState } from "react";

interface PaperCardProps {
  paper: Paper;
}

export function PaperCard({ paper }: PaperCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col">
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
        <CardFooter className="flex justify-between items-center">
           <Button
            variant="ghost"
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="text-muted-foreground hover:text-primary"
          >
            <Bookmark className={cn("mr-2 h-4 w-4")} />
            Bookmark
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={paper.url} target="_blank" rel="noopener noreferrer">
              Read Paper
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
      <AddToCollectionDialog 
        paper={paper}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
