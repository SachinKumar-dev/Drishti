
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
import { Anomaly } from "@/lib/types";

type Incident = Anomaly & { id: string; timestamp: string; status: string; };

// Function to generate mock data. This will be called on the client.
const generateMockIncidents = (): Incident[] => [
  { id: 'inc-1', type: 'Crowd Surge', confidence: 0.95, location: 'Sector A', severity: 'High', timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), status: 'Active' },
  { id: 'inc-2', type: 'Smoke', confidence: 0.82, location: 'Sector B', severity: 'Medium', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), status: 'Active' },
  { id: 'inc-3', type: 'Medical Emergency', confidence: 0.98, location: 'Sector A', severity: 'High', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), status: 'Resolved' },
  { id: 'inc-4', type: 'Unattended Bag', confidence: 0.75, location: 'Sector C', severity: 'Low', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), status: 'Archived' },
];


export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    // Generate incidents on the client-side to avoid hydration mismatch
    setIncidents(generateMockIncidents());
  }, []);

  const getSeverityVariant = (severity: string): "destructive" | "secondary" | "default" | "outline" | null | undefined => {
    switch (severity.toLowerCase()) {
        case 'high': return 'destructive';
        case 'medium': return 'secondary';
        default: return 'outline';
    }
  }

  const getStatusVariant = (status: string): "destructive" | "secondary" | "default" | "outline" | null | undefined => {
    switch (status.toLowerCase()) {
        case 'active': return 'destructive';
        case 'resolved': return 'default';
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
              <CardTitle>Incidents</CardTitle>
              <CardDescription>A log of all detected incidents and their status.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-mono text-xs">{incident.id}</TableCell>
                      <TableCell className="font-medium capitalize">{incident.type}</TableCell>
                      <TableCell>
                        <Badge variant={getSeverityVariant(incident.severity)} className="capitalize">
                          {incident.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{incident.location}</TableCell>
                      <TableCell>{new Date(incident.timestamp).toLocaleString()}</TableCell>
                       <TableCell>
                        <Badge variant={getStatusVariant(incident.status)} className="capitalize">
                          {incident.status}
                        </Badge>
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
