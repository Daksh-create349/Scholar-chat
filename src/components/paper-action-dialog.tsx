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
        orientation: 'p',
        unit: 'pt',
        format: 'a4'
      });
      const margin = 40;
      const pageWidth = doc.internal.pageSize.getWidth();
      const contentWidth = pageWidth - (margin * 2);
      let y = 0;

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      const titleLines = doc.splitTextToSize(paper.title, contentWidth);
      y = margin + 10;
      doc.text(titleLines, margin, y);
      y += titleLines.length * 20;

      // Authors
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const authorText = `By: ${paper.authors.join(', ')}`;
      const authorLines = doc.splitTextToSize(authorText, contentWidth);
      y += 10;
      doc.text(authorLines, margin, y);
      y += authorLines.length * 10;
      
      // Meta Info
      y += 5;
      doc.setFontSize(9);
      doc.setTextColor(100);
      const metaText = `Published: ${paper.publicationDate || 'N/A'}  |  Citations: ${paper.citations.toLocaleString()}`;
      doc.text(metaText, margin, y);
      y += 15;

      // Separator
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageWidth - margin, y);
      y += 20;

      // AI Summary Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('AI-Generated Insights', margin, y);
      y += 15;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Key Findings:', margin, y);
      y += 12;
      doc.setFont('helvetica', 'normal');
      const findingsLines = doc.splitTextToSize(`- ${keyFindings.join('\n- ')}`, contentWidth - 10);
      doc.text(findingsLines, margin + 10, y);
      y += (findingsLines.length * 10) + 10;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Implications:', margin, y);
      y += 12;
      doc.setFont('helvetica', 'normal');
      const implicationsLines = doc.splitTextToSize(`- ${implications.join('\n- ')}`, contentWidth - 10);
      doc.text(implicationsLines, margin + 10, y);
      y += (implicationsLines.length * 10) + 20;

      // Original Abstract Section
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageWidth - margin, y);
      y += 20;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Original Abstract', margin, y);
      y += 15;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const abstractLines = doc.splitTextToSize(paper.abstract, contentWidth);
      doc.text(abstractLines, margin, y);
      y += (abstractLines.length * 10) + 15;
      
      // Footer with URL
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Source: ${paper.url}`, margin, doc.internal.pageSize.getHeight() - margin + 10);


      doc.save(`${paper.title.slice(0, 20).replace(/\s/g, '_')}_analysis.pdf`);

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
