
"use client";

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Loader2 } from "lucide-react";
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { analyzeTrendsInPapers } from '@/ai/flows/analyze-trends-in-papers';

type ChartData = {
  topic: string;
  count: number;
  fill: string;
};

const chartConfig = {
  count: {
    label: "Mentions",
  },
  topic: {
    label: "Topic",
  }
} satisfies ChartConfig;


const chartColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function TrendsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState("");
    const [inputText, setInputText] = useState("");
    const [chartData, setChartData] = useState<ChartData[]>([]);

    const handleAnalysis = async () => {
        if (!inputText.trim()) return;
        setIsLoading(true);
        setAnalysisResult("");
        setChartData([]);

        try {
            // A simple way to create paper-like objects from raw text input
            const papers = inputText.split('\n\n').map(text => {
                const parts = text.split('\n');
                // Use the first line as title, the rest as abstract. If only one line, use it as abstract.
                const title = parts.length > 1 ? parts[0] : `Paper ${Date.now()}`;
                const abstract = parts.length > 1 ? parts.slice(1).join(' ') : text;
                return { title, abstract };
            });

            const result = await analyzeTrendsInPapers({ papers });
            setAnalysisResult(result.trendAnalysis);
            if (result.visualizationData) {
                try {
                    const parsedData = JSON.parse(result.visualizationData);
                    if (Array.isArray(parsedData) && parsedData.every(item => 'topic' in item && 'count' in item)) {
                        const dataWithColors: ChartData[] = parsedData.map((item, index) => ({
                            ...item,
                            fill: chartColors[index % chartColors.length]
                        }));
                        setChartData(dataWithColors);
                    }
                } catch (e) {
                    console.error("Failed to parse visualization data", e);
                }
            }
        } catch (error) {
            console.error("Analysis failed", error);
            setAnalysisResult("An error occurred during analysis. Please try again.");
        } finally {
            setIsLoading(false);
        }
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
              Paste abstracts or topics (separated by a blank line) to identify trends.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Start by pasting content here... Separate papers with a blank line."
              className="min-h-[200px]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleAnalysis} disabled={isLoading || !inputText.trim()} className="w-full">
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
                {isLoading ? "Generating analysis..." : "Identified trends and keyword frequency."}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4">
                {analysisResult && !isLoading && (
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
                                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="topic" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} angle={-35} textAnchor="end" />
                                <YAxis />
                                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                                <Bar dataKey="count" radius={4}>
                                   {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
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
