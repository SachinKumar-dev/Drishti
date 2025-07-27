
"use client";

import { useState, useEffect } from 'react';
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Archive, QrCode } from "lucide-react";
import type { Incident, IncidentStatus } from "@/lib/types";
import { generateMockIncidents } from "@/lib/mock-data";

const ACKNOWLEDGEMENT_WINDOW_MS = 30 * 1000; // 30 seconds for demo

const CountdownTimer = ({ timestamp, onComplete }: { timestamp: number, onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(ACKNOWLEDGEMENT_WINDOW_MS - (Date.now() - timestamp));

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      const newTimeLeft = ACKNOWLEDGEMENT_WINDOW_MS - (Date.now() - timestamp);
      if (newTimeLeft <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        onComplete();
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timestamp, onComplete, timeLeft]);

  const minutes = Math.floor((timeLeft / 1000) / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className={`font-mono text-xs ${timeLeft < 10000 ? 'text-destructive' : ''}`}>
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </span>
  );
};


export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    // Generate incidents on the client-side to avoid hydration mismatch
    const mockIncidents = generateMockIncidents();
    const storedIncidents = JSON.parse(localStorage.getItem('incidents') || '[]') as Incident[];
    
    // Combine and sort by timestamp, newest first
    const uniqueIncidents = new Map<string, Incident>();
    [...mockIncidents, ...storedIncidents].forEach(incident => {
        if (!uniqueIncidents.has(incident.id)) {
            uniqueIncidents.set(incident.id, incident);
        }
    });

    const allIncidents = Array.from(uniqueIncidents.values()).sort((a, b) => b.timestamp - a.timestamp);
    
    setIncidents(allIncidents);
  }, []);

  const handleUpdateStatus = (id: string, status: IncidentStatus) => {
    setIncidents(prev => {
        const updatedIncidents = prev.map(inc => inc.id === id ? { ...inc, status } : inc);
        const storedIncidents = updatedIncidents.filter(inc => inc.source === 'QR Report');
        localStorage.setItem('incidents', JSON.stringify(storedIncidents));
        return updatedIncidents;
    });
  };

  const getSeverity = (details: string): "High" | "Medium" | "Low" => {
    const lowerDetails = details.toLowerCase();
    if (lowerDetails.includes('fire') || lowerDetails.includes('medical') || lowerDetails.includes('unresponsive')) return 'High';
    if (lowerDetails.includes('crowd') || lowerDetails.includes('security') || lowerDetails.includes('fight') || lowerDetails.includes('unattended')) return 'Medium';
    return 'Low';
  }

  const getSeverityVariant = (severity: string): "destructive" | "secondary" | "default" | "outline" | null | undefined => {
    switch (severity.toLowerCase()) {
        case 'high': return 'destructive';
        case 'medium': return 'secondary';
        default: return 'outline';
    }
  }

  const getStatusVariant = (status: string): "destructive" | "secondary" | "default" | "outline" | null | undefined => {
    switch (status.toLowerCase()) {
        case 'escalated': return 'destructive';
        case 'pending': return 'secondary';
        case 'acknowledged': return 'default';
        case 'archived': return 'outline';
        default: return 'outline';
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
              <CardTitle>Incident Log</CardTitle>
              <CardDescription>A unified log of all detected and reported incidents.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident ID</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((incident) => (
                    <TableRow key={incident.id} className={incident.status === 'Pending' || incident.status === 'Escalated' ? 'bg-muted/50' : ''}>
                      <TableCell className="font-mono text-xs">{incident.id.substring(0, 7)}...</TableCell>
                      <TableCell>
                        <Badge variant={getSeverityVariant(getSeverity(incident.details))} className="capitalize">
                          {getSeverity(incident.details)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium max-w-[300px] truncate">{incident.details}</TableCell>
                      <TableCell>{incident.location}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {incident.source === 'QR Report' && <QrCode className="h-4 w-4 text-primary" />}
                        {incident.userName}
                      </TableCell>
                      <TableCell>{new Date(incident.timestamp).toLocaleString()}</TableCell>
                       <TableCell>
                        <div className="flex items-center gap-2">
                            <Badge variant={getStatusVariant(incident.status)} className="capitalize">
                                {incident.status}
                            </Badge>
                             {incident.status === 'Pending' && (
                                <CountdownTimer 
                                    timestamp={incident.timestamp} 
                                    onComplete={() => {
                                      // Check if status is still pending before escalating
                                      const currentIncident = incidents.find(i => i.id === incident.id);
                                      if (currentIncident && currentIncident.status === 'Pending') {
                                        handleUpdateStatus(incident.id, 'Escalated');
                                      }
                                    }}
                                />
                            )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                         {incident.status === 'Pending' && (
                          <Button size="sm" onClick={() => handleUpdateStatus(incident.id, 'Acknowledged')}>
                            <ShieldCheck className="mr-2 h-4 w-4" /> Acknowledge
                          </Button>
                        )}
                        {(incident.status === 'Acknowledged' || incident.status === 'Escalated') && (
                          <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(incident.id, 'Archived')}>
                            <Archive className="mr-2 h-4 w-4" /> Archive
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
