
"use client";

import { useState } from 'react';
import QRCode from "qrcode.react";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { QrCode, User, Download, RefreshCw } from 'lucide-react';

const qrFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
});

type QrForm = z.infer<typeof qrFormSchema>;


export default function QrAlertPage() {
  const [qrValue, setQrValue] = useState('');
  const [userName, setUserName] = useState('');

  const form = useForm<QrForm>({
    resolver: zodResolver(qrFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<QrForm> = (data) => {
    if (typeof window !== 'undefined') {
      const reportUrl = `${window.location.origin}/report-incident?userName=${encodeURIComponent(data.name)}`;
      setQrValue(reportUrl);
      setUserName(data.name);
    }
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector<HTMLCanvasElement>(".qr-code-canvas");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `Drishti.ai-alert-qr-${userName}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };
  
  const resetForm = () => {
    form.reset();
    setQrValue('');
    setUserName('');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Generate User QR Code</CardTitle>
              <CardDescription>
                {qrValue 
                  ? `This QR code is unique to ${userName}. Display this at their location for them to scan and report incidents directly.`
                  : "Enter a user's name to generate a unique QR code for incident reporting."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-8">
              {qrValue ? (
                <>
                  <div className="p-6 bg-white rounded-lg shadow-md">
                    <QRCode
                        value={qrValue}
                        size={256}
                        level={"H"}
                        includeMargin={true}
                        className="qr-code-canvas"
                    />
                  </div>
                   <div className="flex gap-4">
                     <Button onClick={downloadQRCode}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" onClick={resetForm}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Generate New
                      </Button>
                   </div>
                </>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>User's Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="e.g., John Doe" {...field} className="pl-8"/>
                            </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      <QrCode className="mr-2 h-4 w-4" />
                      Generate QR Code
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
