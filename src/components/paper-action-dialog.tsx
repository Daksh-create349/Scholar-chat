'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download, FileText, Loader2 } from 'lucide-react';
import type { Paper } from '@/lib/types';
import { summarizeResearchPaper } from '@/ai/flows/summarize-research-paper';
import { useToast } from '@/hooks/use-toast';

interface PaperActionDialogProps {
  paper: Paper;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaperActionDialog({ paper, open, onOpenChange }: PaperActionDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      const { summary } = await summarizeResearchPaper({ paperText: paper.abstract });

      const doc = new jsPDF();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(paper.title, 15, 20, { maxWidth: 180 });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(paper.authors.join(', '), 15, 30, { maxWidth: 180 });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('AI-Generated Summary', 15, 45);
      
      doc.setFont('helvetica', 'normal');
      doc.text(doc.splitTextToSize(summary, 180), 15, 52);
      
      doc.save(`${paper.title.slice(0, 20).replace(/\s/g, '_')}_summary.pdf`);

    } catch (error) {
      console.error("Failed to generate PDF summary", error);
      toast({
        title: "Error Generating PDF",
        description: "There was a problem creating the summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-headline text-lg leading-snug">{paper.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {paper.authors.slice(0, 2).join(', ')}{paper.authors.length > 2 && ', et al.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 py-4">
            <a href={paper.url} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="mr-2" />
                    Open Original Link
                </Button>
            </a>
            <Button onClick={handleDownloadPdf} disabled={isGenerating} className="w-full justify-start">
                {isGenerating ? (
                    <Loader2 className="mr-2 animate-spin" />
                ) : (
                    <Download className="mr-2" />
                )}
                <span>Download AI Summary (PDF)</span>
            </Button>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
