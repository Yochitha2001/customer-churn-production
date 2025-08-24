"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { Customer } from "@/lib/types";
import {
  provideCertaintyScore,
  ProvideCertaintyScoreOutput,
} from "@/ai/flows/provide-certainty-score";
import {
  suggestInterventions,
  SuggestInterventionsOutput,
} from "@/ai/flows/suggest-interventions";
import { TrendingDown, TrendingUp, Lightbulb, User, Info, DollarSign, LifeBuoy, Smile, Award } from "lucide-react";
import { Separator } from "./ui/separator";

type CustomerPredictionViewProps = {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
};

export function CustomerPredictionView({
  isOpen,
  onClose,
  customer,
}: CustomerPredictionViewProps) {
  const [prediction, setPrediction] = useState<ProvideCertaintyScoreOutput | null>(null);
  const [interventions, setInterventions] = useState<SuggestInterventionsOutput | null>(null);
  const [isPending, startTransition] = useTransition();

  const customerDataString = useMemo(() => {
    if (!customer) return "";
    return JSON.stringify(customer, null, 2);
  }, [customer]);

  useEffect(() => {
    if (customer) {
      startTransition(async () => {
        setPrediction(null);
        setInterventions(null);
        
        const [predictionResult, interventionResult] = await Promise.all([
          provideCertaintyScore({ customerData: customerDataString }),
          suggestInterventions({ customerData: customerDataString, churnPrediction: '' }),
        ]);

        setPrediction(predictionResult);
        setInterventions(interventionResult);
      });
    }
  }, [customer, customerDataString]);

  const certaintyColor = prediction ? (prediction.certaintyScore > 0.7 ? "hsl(var(--destructive))" : prediction.certaintyScore > 0.4 ? "hsl(var(--primary))" : "hsl(var(--accent))") : "hsl(var(--muted))"

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg p-0">
        {customer && (
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6">
              <SheetTitle className="flex items-center gap-2 text-2xl">
                <AvatarIcon customer={customer} />
                {customer.name}
              </SheetTitle>
              <SheetDescription>{customer.email}</SheetDescription>
            </SheetHeader>
            <Separator />
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Info className="w-5 h-5"/>Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /> <span>{customer.status}</span></div>
                        <div className="flex items-center gap-2"><Award className="w-4 h-4 text-muted-foreground" /> <span>{customer.plan} Plan</span></div>
                        <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-muted-foreground" /> <span>${customer.monthlySpend}/mo</span></div>
                        <div className="flex items-center gap-2"><LifeBuoy className="w-4 h-4 text-muted-foreground" /> <span>{customer.supportTickets} tickets</span></div>
                        <div className="flex items-center gap-2"><Smile className="w-4 h-4 text-muted-foreground" /> <span>{customer.satisfactionScore}/5 score</span></div>
                    </CardContent>
                </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Churn Prediction</CardTitle>
                </CardHeader>
                <CardContent>
                  {isPending && <AnalysisSkeleton />}
                  {prediction && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xl font-bold">
                        {prediction.churnPrediction.toLowerCase().includes("not churn") ? <TrendingUp className="text-green-500"/> : <TrendingDown className="text-red-500"/>}
                        <span>{prediction.churnPrediction}</span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Certainty Score</span>
                            <span className="text-sm font-bold" style={{color: certaintyColor}}>{(prediction.certaintyScore * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={prediction.certaintyScore * 100} indicatorClassName="transition-all duration-500" style={{'--indicator-color': certaintyColor} as React.CSSProperties}/>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        &quot;{prediction.reason}&quot;
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5"/> Suggested Interventions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isPending && <InterventionSkeleton />}
                  {interventions && (
                    <div className="space-y-3">
                      <ul className="space-y-2 text-sm list-disc pl-5">
                        {interventions.interventions.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                      <p className="text-sm text-muted-foreground italic pt-2 border-t">
                        <strong>Rationale:</strong> {interventions.rationale}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="p-6 border-t bg-background/80">
                <Button onClick={onClose} className="w-full" variant="outline">Close</Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

const AnalysisSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
    </div>
)

const InterventionSkeleton = () => (
    <div className="space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/6" />
        <Skeleton className="h-12 w-full mt-4" />
    </div>
)

const AvatarIcon = ({customer}: {customer: Customer}) => {
    if (customer.status === "At Risk") return <div className="w-8 h-8 rounded-full bg-destructive/20 text-destructive flex items-center justify-center shrink-0"><TrendingDown className="w-5 h-5"/></div>
    if (customer.status === "Active") return <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0"><TrendingUp className="w-5 h-5"/></div>
    return <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0"><User className="w-5 h-5"/></div>
}

// Override Progress component to allow custom indicator color
const ProgressIndicator = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Indicator
    ref={ref}
    className={cn("h-full w-full flex-1 bg-[--indicator-color] transition-all", className)}
    {...props}
  />
));
ProgressIndicator.displayName = ProgressPrimitive.Indicator.displayName

import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const CustomProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressIndicator style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
  </ProgressPrimitive.Root>
))
CustomProgress.displayName = ProgressPrimitive.Root.displayName
