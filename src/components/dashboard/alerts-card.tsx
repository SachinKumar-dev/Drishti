import type { Anomaly } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldCheck, Info, Flame, Users, Cloud } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface AlertsCardProps {
  anomalies: Anomaly[];
}

const getSeverityIcon = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "high":
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
    case "medium":
      return <ShieldCheck className="h-5 w-5 text-yellow-500" />;
    case "low":
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return <Info className="h-5 w-5 text-muted-foreground" />;
  }
};

const getAnomalyIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case "smoke":
            return <Cloud className="h-5 w-5 text-slate-500" />;
        case "fire":
            return <Flame className="h-5 w-5 text-red-600" />;
        case "crowd surge":
            return <Users className="h-5 w-5 text-orange-500" />;
        default:
            return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
    }
}

const getSeverityVariant = (severity: string): "destructive" | "secondary" | "default" | "outline" | null | undefined => {
    switch (severity.toLowerCase()) {
        case 'high': return 'destructive';
        case 'medium': return 'secondary';
        default: return 'outline';
    }
}

export function AlertsCard({ anomalies }: AlertsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Active Alerts</CardTitle>
            <Badge variant="destructive">{anomalies.length}</Badge>
        </div>
        <CardDescription>Real-time anomalies detected by Vision AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
        {anomalies.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-10">
            <ShieldCheck className="h-12 w-12 mb-4" />
            <p className="font-semibold">All Clear</p>
            <p className="text-sm">No anomalies detected at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalies.map((anomaly, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                    {getSeverityIcon(anomaly.severity)}
                    {getAnomalyIcon(anomaly.type)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold capitalize">{anomaly.type}</p>
                  <p className="text-sm text-muted-foreground">
                    Location: {anomaly.location}
                  </p>
                </div>
                <Badge variant={getSeverityVariant(anomaly.severity)} className="capitalize">{anomaly.severity}</Badge>
              </div>
            ))}
          </div>
        )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
