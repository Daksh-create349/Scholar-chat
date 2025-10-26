
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, FlaskConical, Beaker, Loader2 } from "lucide-react";
import { generateHypotheses, GenerateHypothesesOutput } from '@/ai/flows/generate-hypotheses';

export default function HypothesisPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<GenerateHypothesesOutput | null>(null);
    const [inputText, setInputText] = useState("");

    const handleAnalysis = async () => {
        if (!inputText.trim()) return;
        setIsLoading(true);
        setAnalysisResult(null);

        try {
            const result = await generateHypotheses({ researchText: inputText });
            setAnalysisResult(result);
        } catch (error) {
            console.error("Analysis failed", error);
            // You might want to show a toast or an error message here
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Hypothesis Generator</h1>
        <p className="text-muted-foreground mt-1">
          Spark your next big idea by generating novel research questions.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Provide Context</CardTitle>
            <CardDescription>
              Paste in abstracts, a literature review, or a description of your research area.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., 'The field of quantum machine learning explores the intersection of quantum computing and machine learning. Recent work has focused on quantum neural networks and quantum support vector machines...'"
              className="min-h-[300px]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleAnalysis} disabled={isLoading || !inputText.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FlaskConical className="mr-2 h-4 w-4" />
                  Generate Hypotheses
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Generated Ideas</CardTitle>
                <CardDescription>
                {isLoading ? "The AI is thinking..." : "Potential avenues for your next research project."}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4">
                {isLoading && !analysisResult && (
                     <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground space-y-4">
                        <div className="animate-pulse flex flex-col items-center space-y-2">
                            <Beaker className="h-12 w-12" />
                            <p className="font-medium">Analyzing text for gaps...</p>
                        </div>
                    </div>
                )}
                {!isLoading && !analysisResult && (
                    <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground text-center">
                        <Lightbulb className="h-12 w-12" />
                        <p className="mt-4 font-medium">Your generated questions and hypotheses will appear here.</p>
                    </div>
                )}
                {analysisResult && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg flex items-center mb-3">
                                <FlaskConical className="h-5 w-5 mr-2 text-primary" />
                                Research Questions
                            </h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                {analysisResult.researchQuestions.map((q, i) => (
                                    <li key={`q-${i}`}>{q}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg flex items-center mb-3">
                                <Beaker className="h-5 w-5 mr-2 text-primary" />
                                Testable Hypotheses
                            </h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                {analysisResult.testableHypotheses.map((h, i) => (
                                    <li key={`h-${i}`}>{h}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
