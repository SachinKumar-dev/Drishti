
"use client";

import { useState, useEffect } from 'react';
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BellRing, ShieldCheck, User, MapPin, AlertTriangle, Archive, Timer } from 'lucide-react';
import type { Incident, IncidentStatus } from '@/lib/types';
import { generateMockIncidents } from '@/lib/mock-data';

const ACKNOWLEDGEMENT_WINDOW_MS = 30 * 1000; // 30 seconds for demo

const CountdownTimer = ({ timestamp }: { timestamp: number }) => {
  const [timeLeft, setTimeLeft] = useState(ACKNOWLEDGEMENT_WINDOW_MS - (Date.now() - timestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = ACKNOWLEDGEMENT_WINDOW_MS - (Date.now() - timestamp);
      setTimeLeft(newTimeLeft > 0 ? newTimeLeft : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  const minutes = Math.floor((timeLeft / 1000) / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className={timeLeft < 10000 ? 'text-destructive' : ''}>
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </span>
  );
};

export default function ReportsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const initialIncidents = generateMockIncidents().filter(inc => inc.status === 'Pending' || inc.status === 'Escalated');
    setIncidents(initialIncidents);

    const interval = setInterval(() => {
      setIncidents(prevIncidents => 
        prevIncidents.map(incident => {
          if (incident.status === 'Pending' && (Date.now() - incident.timestamp > ACKNOWLEDGEMENT_WINDOW_MS)) {
            return { ...incident, status: 'Escalated' };
          }
          return incident;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = (id: string, status: IncidentStatus) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
  };
  
  const activeIncidents = incidents.filter(inc => inc.status !== 'Archived');

  const getStatusVariant = (status: IncidentStatus): "destructive" | "secondary" | "default" | "outline" | null | undefined => {
    switch (status) {
        case 'Escalated': return 'destructive';
        case 'Pending': return 'secondary';
        case 'Acknowledged': return 'default';
        default: return 'outline';
    }
  }

  const getStatusIcon = (status: IncidentStatus) => {
    switch(status) {
      case 'Pending': return <Timer className="h-5 w-5 text-yellow-500" />;
      case 'Acknowledged': return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'Escalated': return <BellRing className="h-5 w-5 text-destructive" />;
      default: return null;
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Card>
            <CardHeader>
              <CardTitle>Live Incident Reports</CardTitle>
              <CardDescription>Acknowledge incoming reports within the time limit to prevent escalation.</CardDescription>
            </CardHeader>
            <CardContent>
              {activeIncidents.length === 0 ? (
                 <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-20">
                    <ShieldCheck className="h-16 w-16 mb-4 text-green-500" />
                    <p className="font-semibold text-xl">All Clear</p>
                    <p>No active incidents requiring attention.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activeIncidents.map((incident) => (
                    <Card key={incident.id} className="flex flex-col">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium capitalize flex items-center gap-2">
                            {getStatusIcon(incident.status)} {incident.status}
                        </CardTitle>
                        <Badge variant={getStatusVariant(incident.status)}>
                            {incident.status === 'Pending' ? <CountdownTimer timestamp={incident.timestamp} /> : 'N/A'}
                        </Badge>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-4">
                        <p className="text-sm text-muted-foreground border-l-4 border-primary pl-4 py-2 bg-muted/50 rounded-r-md">
                            {incident.details}
                        </p>
                        <div className="flex items-center text-sm">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Reported by: <strong>{incident.userName}</strong></span>
                        </div>
                        <div className="flex items-center text-sm">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Location: <strong>{incident.location}</strong></span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        {incident.status === 'Pending' && (
                          <Button onClick={() => handleUpdateStatus(incident.id, 'Acknowledged')}>
                            <ShieldCheck className="mr-2 h-4 w-4" /> Acknowledge
                          </Button>
                        )}
                        {(incident.status === 'Acknowledged' || incident.status === 'Escalated') && (
                          <Button variant="secondary" onClick={() => handleUpdateStatus(incident.id, 'Archived')}>
                            <Archive className="mr-2 h-4 w-4" /> Archive
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
