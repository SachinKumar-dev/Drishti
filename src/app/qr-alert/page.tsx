
"use client";

import { useState, useEffect } from 'react';
import QRCode from "qrcode.react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

export default function QrAlertPage() {
  const [qrValue, setQrValue] = useState('');
  // In a real app, this would come from an authentication context.
  const user = { name: "Admin User" }; 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const reportUrl = `${window.location.origin}/report-incident?userName=${encodeURIComponent(user.name)}`;
      setQrValue(reportUrl);
    }
  }, [user.name]);

  const downloadQRCode = () => {
    const canvas = document.querySelector<HTMLCanvasElement>(".qr-code-canvas");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `sentinelai-alert-qr-${user.name}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Your Unique QR Code</CardTitle>
              <CardDescription>
                This QR code is unique to {user.name}. Display this at your location for users to scan and report incidents directly.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-8">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    {qrValue ? (
                         <QRCode
                            value={qrValue}
                            size={256}
                            level={"H"}
                            includeMargin={true}
                            className="qr-code-canvas"
                        />
                    ) : (
                        <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-md" />
                    )}
                </div>
                
              <Button onClick={downloadQRCode} disabled={!qrValue}>
                <QrCode className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
