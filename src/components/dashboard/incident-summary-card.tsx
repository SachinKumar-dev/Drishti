"use client";

import type { IncidentSummary } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Wand2, Loader2, ListTodo, ShieldQuestion, MapPin } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface IncidentSummaryCardProps {
  summary: IncidentSummary | null;
  isLoading: boolean;
  onSummarize: () => void;
}

export function IncidentSummaryCard({ summary, isLoading, onSummarize }: IncidentSummaryCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>AI Incident Summary</CardTitle>
        <CardDescription>
          Auto-generated report from multiple data sources.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-[300px] pr-4">
        {!summary ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-10">
            <FileText className="h-12 w-12 mb-4" />
            <p className="font-semibold">No Summary Available</p>
            <p className="text-sm">Generate a summary to see incident details here.</p>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2 flex items-center"><ShieldQuestion className="mr-2 h-4 w-4 text-primary" />Severity</h4>
              <Badge variant={summary.severity.toLowerCase() === 'high' ? 'destructive' : 'secondary'} className="capitalize">{summary.severity}</Badge>
            </div>
             <div>
              <h4 className="font-semibold mb-2 flex items-center"><MapPin className="mr-2 h-4 w-4 text-primary" />Affected Areas</h4>
              <p className="text-muted-foreground">{summary.affectedAreas}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Summary</h4>
              <p className="text-muted-foreground leading-relaxed">{summary.summary}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center"><ListTodo className="mr-2 h-4 w-4 text-primary" />Response Actions</h4>
              <p className="text-muted-foreground">{summary.responseActions}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center"><Wand2 className="mr-2 h-4 w-4 text-primary" />Recommendations</h4>
              <p className="text-muted-foreground">{summary.recommendations}</p>
            </div>
          </div>
        )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button onClick={onSummarize} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate Summary
        </Button>
      </CardFooter>
    </Card>
  );
}
