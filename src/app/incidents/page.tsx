
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
import type { Incident } from "@/lib/types";
import { generateMockIncidents } from "@/lib/mock-data";


export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    // Generate incidents on the client-side to avoid hydration mismatch
    setIncidents(generateMockIncidents());
  }, []);

  const getSeverity = (details: string): "High" | "Medium" | "Low" => {
    if (details.toLowerCase().includes('fire') || details.toLowerCase().includes('medical')) return 'High';
    if (details.toLowerCase().includes('crowd') || details.toLowerCase().includes('security')) return 'Medium';
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
              <CardDescription>A historical log of all detected and reported incidents.</CardDescription>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-mono text-xs">{incident.id}</TableCell>
                      <TableCell>
                        <Badge variant={getSeverityVariant(getSeverity(incident.details))} className="capitalize">
                          {getSeverity(incident.details)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium max-w-[300px] truncate">{incident.details}</TableCell>
                      <TableCell>{incident.location}</TableCell>
                      <TableCell>{incident.userName}</TableCell>
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
