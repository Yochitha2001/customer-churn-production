"use client";

import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2, ArrowRight } from "lucide-react";
import { analyzeChurnFactors, AnalyzeChurnFactorsOutput } from "@/ai/flows/analyze-churn-factors";
import { datasetDescription, datasetPreview } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ChurnAnalysisCard() {
  const [isPending, startTransition] = useTransition();
  const [analysisResult, setAnalysisResult] = useState<AnalyzeChurnFactorsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = () => {
    startTransition(async () => {
      setError(null);
      const result = await analyzeChurnFactors({ datasetDescription, datasetPreview });
      if (result) {
        setAnalysisResult(result);
      } else {
        setError("Failed to get analysis. Please try again.");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="text-accent" />
                    Overall Churn Analysis
                </CardTitle>
                <CardDescription>
                    AI-powered insights into the key factors driving customer churn.
                </CardDescription>
            </div>
            {!analysisResult && (
                <Button onClick={handleAnalysis} disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        "Analyze Dataset"
                    )}
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        {isPending && (
             <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <div className="h-6 w-1/2 rounded-md bg-muted animate-pulse" />
                    <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
                    <div className="h-4 w-5/6 rounded-md bg-muted animate-pulse" />
                    <div className="h-4 w-3/4 rounded-md bg-muted animate-pulse" />
                </div>
                <div className="space-y-2">
                    <div className="h-6 w-1/2 rounded-md bg-muted animate-pulse" />
                    <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
                    <div className="h-4 w-5/6 rounded-md bg-muted animate-pulse" />
                    <div className="h-4 w-3/4 rounded-md bg-muted animate-pulse" />
                </div>
            </div>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Analysis Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {analysisResult && (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Churn Factors</h3>
              <ul className="space-y-2">
                {analysisResult.keyFactors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-1 text-primary shrink-0"/>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Suggested Retention Strategies</h3>
              <ul className="space-y-2">
                {analysisResult.suggestedStrategies.map((strategy, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-1 text-primary shrink-0"/>
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
