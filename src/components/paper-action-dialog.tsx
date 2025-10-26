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
      const { keyFindings, implications } = await summarizeResearchPaper({ paperText: paper.abstract });

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
      });
      const margin = 40;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (margin * 2);

      // Slide 1: Title Slide
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(36);
      const titleLines = doc.splitTextToSize(paper.title, contentWidth * 0.9);
      doc.text(titleLines, pageWidth / 2, pageHeight / 2 - 40, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      const authorText = paper.authors.join(', ');
      const authorLines = doc.splitTextToSize(authorText, contentWidth * 0.8);
      doc.text(authorLines, pageWidth / 2, pageHeight / 2 + (titleLines.length * 20), { align: 'center' });

      // Slide 2: Key Findings
      doc.addPage();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('Key Findings', margin, margin);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      const findingsLines = doc.splitTextToSize(keyFindings.map(f => `• ${f}`).join('\n'), contentWidth);
      doc.text(findingsLines, margin, margin + 40);

      // Slide 3: Implications
      doc.addPage();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('Implications & Significance', margin, margin);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      const implicationsLines = doc.splitTextToSize(implications.map(i => `• ${i}`).join('\n'), contentWidth);
      doc.text(implicationsLines, margin, margin + 40);

      // Slide 4: Original Abstract
      doc.addPage();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('Original Abstract', margin, margin);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      const abstractLines = doc.splitTextToSize(paper.abstract, contentWidth);
      doc.text(abstractLines, margin, margin + 40);

      // Slide 5: Source
      doc.addPage();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('Source & Further Reading', margin, margin);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.text('You can access the full paper at the following URL:', margin, margin + 40);
      doc.setTextColor(69, 90, 100);
      doc.textWithLink(paper.url, margin, margin + 60, { url: paper.url });
      
      doc.save(`${paper.title.slice(0, 20).replace(/\s/g, '_')}_presentation.pdf`);

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
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Original Link
                </Button>
            </a>
            <Button onClick={handleDownloadPdf} disabled={isGenerating} className="w-full justify-start">
                {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Download className="mr-2 h-4 w-4" />
                )}
                <span>Download AI Analysis (PDF)</span>
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
