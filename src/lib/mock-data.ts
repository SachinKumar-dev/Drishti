
import type { Incident, IncidentStatus } from '@/lib/types';

// Function to generate mock data. This will be called on the client.
export const generateMockIncidents = (): Incident[] => {
    const now = Date.now();
    return [
        { 
            id: 'inc-1', 
            userName: 'Venue Staff A', 
            location: 'Sector A, near stage left', 
            details: 'A small fire has broken out near the power generator.',
            timestamp: now - 2 * 60 * 1000, // 2 minutes ago
            status: 'Pending',
            source: 'Mock Data'
        },
        { 
            id: 'inc-2', 
            userName: 'Anonymous User', 
            location: 'Lat: 40.7128, Lon: -74.0060', 
            details: 'Medical emergency, an attendee has collapsed and is unresponsive.',
            timestamp: now - 8 * 60 * 1000, // 8 minutes ago
            status: 'Escalated',
            source: 'Mock Data'
        },
        { 
            id: 'inc-3', 
            userName: 'Security Guard B', 
            location: 'East Entrance', 
            details: 'An unattended bag has been left near the main entrance for over 10 minutes.',
            timestamp: now - 15 * 60 * 1000, // 15 minutes ago
            status: 'Acknowledged',
            source: 'Mock Data'
        },
        { 
            id: 'inc-4', 
            userName: 'Concert Goer', 
            location: 'Section 104, Row G', 
            details: 'A fight has broken out between two individuals.',
            timestamp: now - 30 * 60 * 1000, // 30 minutes ago
            status: 'Archived',
            source: 'Mock Data'
        },
         { 
            id: 'inc-5', 
            userName: 'Venue Staff C', 
            location: 'Merchandise Booth 3', 
            details: 'Crowd is pushing towards the booth, creating a dangerous surge.',
            timestamp: now - 1 * 60 * 1000, // 1 minute ago
            status: 'Pending',
            source: 'Mock Data'
        },
    ];
};
