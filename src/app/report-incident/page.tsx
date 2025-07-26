
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { reportIncident } from '@/ai/flows/report-incident';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Loader2, MapPin, Send, AlertTriangle, User } from 'lucide-react';
import { Logo } from '@/components/icons/logo';

const reportIncidentSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  details: z.string().min(10, { message: "Please provide at least a brief description." }),
  location: z.string().optional(),
});

type ReportIncidentForm = z.infer<typeof reportIncidentSchema>;

function ReportIncidentFormContent() {
    const searchParams = useSearchParams();
    const userNameFromQr = searchParams.get('userName') || "";

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const { toast } = useToast();

    const form = useForm<ReportIncidentForm>({
        resolver: zodResolver(reportIncidentSchema),
        defaultValues: {
        name: userNameFromQr,
        details: "",
        location: "",
        },
    });

    useEffect(() => {
        form.setValue('name', userNameFromQr);
    }, [userNameFromQr, form]);

    const handleGetLocation = () => {
        if (navigator.geolocation) {
        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
            const { latitude, longitude } = position.coords;
            const locationString = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
            form.setValue('location', locationString);
            toast({ title: "Location captured successfully." });
            setIsGettingLocation(false);
            },
            (error) => {
            console.error("Geolocation error:", error);
            toast({
                variant: 'destructive',
                title: "Could not get location.",
                description: "Please ensure you have enabled location permissions for this site.",
            });
            setIsGettingLocation(false);
            }
        );
        } else {
        toast({
            variant: 'destructive',
            title: "Geolocation not supported",
            description: "Your browser does not support location services.",
        });
        }
    };

    const onSubmit: SubmitHandler<ReportIncidentForm> = async (data) => {
        setIsLoading(true);
        try {
        const result = await reportIncident({
            userName: data.name,
            incidentDetails: data.details,
            location: data.location || 'Not provided',
        });
        toast({
            title: "Alert Sent Successfully",
            description: result.summary,
        });
        setIsSubmitted(true);
        } catch (error) {
        console.error('Error reporting incident:', error);
        toast({
            variant: 'destructive',
            title: 'Failed to Send Alert',
            description: 'Could not send the alert. Please try again or find security personnel nearby.',
        });
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>Report an Incident</CardTitle>
            <CardDescription>
                Your report will be sent to the nearest security personnel. Please provide as much detail as possible.
            </CardDescription>
            </CardHeader>
            {isSubmitted ? (
                <CardContent className="flex flex-col items-center justify-center text-center p-10">
                    <Send className="h-16 w-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Alert Sent</h2>
                    <p className="text-muted-foreground">Security has been notified and is on the way. If this is a medical emergency, please do not move the person.</p>
                </CardContent>
            ) : (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g., Jane Doe" {...field} readOnly className="pl-8 bg-muted"/>
                          </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Incident Details</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Describe what is happening..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Location</FormLabel>
                        <FormControl>
                        <div className="flex gap-2">
                            <Input placeholder="Location will appear here..." {...field} readOnly className="bg-muted"/>
                            <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isGettingLocation}>
                                {isGettingLocation ? <Loader2 className="h-4 w-4 animate-spin"/> : <MapPin className="h-4 w-4"/>}
                            </Button>
                        </div>
                        </FormControl>
                        <FormDescription>
                        Click the pin to share your current location.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </CardContent>
                <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <Send className="mr-2 h-4 w-4" />
                    )}
                    Send Alert
                </Button>
                </CardFooter>
            </form>
            </Form>
            )}
        </Card>
    )
}

export default function ReportIncidentPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-4">
            <div className="absolute top-4 left-4 flex items-center gap-2 text-foreground">
                <Logo className="h-8 w-8 text-primary" />
                <span className="font-semibold text-lg">SentinelAI</span>
            </div>
            <React.Suspense fallback={<div>Loading...</div>}>
                <ReportIncidentFormContent />
            </React.Suspense>
        </div>
    );
}

