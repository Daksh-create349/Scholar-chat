"use client";

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Loader2 } from "lucide-react";
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { topic: 'Transformers', count: 186 },
  { topic: 'NLP', count: 120 },
  { topic: 'BERT', count: 95 },
  { topic: 'Deep Learning', count: 80 },
  { topic: 'Computer Vision', count: 70 },
  { topic: 'ResNet', count: 65 },
];

const chartConfig = {
  count: {
    label: "Mentions",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function TrendsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState("");

    const handleAnalysis = () => {
        setIsLoading(true);
        setTimeout(() => {
            setAnalysisResult("Based on the provided papers, a clear trend emerges towards the application of Transformer architectures beyond their original NLP domain. There's a significant overlap with Computer Vision, particularly in models like Vision Transformer (ViT). Another key trend is the focus on pre-training large models on massive datasets, with BERT being a foundational example that has inspired subsequent work in creating more efficient and powerful language representations. A promising area for future research is the fusion of these large language models with structured knowledge graphs.");
            setIsLoading(false);
        }, 1500);
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Trend Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Connect and visualize trends across multiple papers.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analyze Papers</CardTitle>
            <CardDescription>
              Paste abstracts or topics (one per line) to identify trends.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Start by pasting content here..."
              className="min-h-[200px]"
            />
            <Button onClick={handleAnalysis} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Trends"
              )}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Analysis & Visualization</CardTitle>
                <CardDescription>
                Identified trends and keyword frequency.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4">
                {analysisResult && (
                    <div className="p-4 rounded-lg bg-secondary/50 border border-secondary">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-foreground">{analysisResult}</p>
                        </div>
                    </div>
                )}
                 <Card className="flex-grow">
                    <CardHeader>
                        <CardTitle className="text-base">Topic Frequency</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfig} className="h-[200px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="topic" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                <YAxis />
                                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
