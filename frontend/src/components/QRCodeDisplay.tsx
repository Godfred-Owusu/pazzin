import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  Copy, 
  Download, 
  RefreshCw, 
  Calendar, 
  User, 
  Mail, 
  Loader2,
  CheckCircle
} from "lucide-react";
import { QRCodeData } from "./QRCodeGenerator";

interface QRCodeDisplayProps {
  qrCodeData: QRCodeData | null;
  isLoading: boolean;
  onNewQRCode: () => void;
}

export const QRCodeDisplay = ({ qrCodeData, isLoading, onNewQRCode }: QRCodeDisplayProps) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyUrl = async () => {
    if (!qrCodeData?.qrCodeUrl) return;

    try {
      await navigator.clipboard.writeText(qrCodeData.qrCodeUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      
      toast({
        title: "Copied!",
        description: "QR code URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    if (!qrCodeData?.qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeData.qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-code-${qrCodeData.userName.replace(/\s+/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded!",
        description: "QR code saved to your device",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download QR code",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-card-custom">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-primary/30 rounded-lg flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
            <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-lg animate-pulse"></div>
          </div>
          <p className="text-muted-foreground text-center">
            Generating your QR code...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!qrCodeData) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-card-custom">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-24 h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-muted-foreground/20 rounded"></div>
          </div>
          <p className="text-muted-foreground text-center mb-2">
            No QR code generated yet
          </p>
          <p className="text-sm text-muted-foreground/70 text-center">
            Fill out the form to create your QR code
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card-custom animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <CheckCircle className="w-5 h-5 text-success" />
          QR Code Generated
        </CardTitle>
        <CardDescription>
          Your personalized QR code is ready to use
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code Image */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-lg blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-white p-4 rounded-lg shadow-qr">
              {imageLoading && (
                <div className="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}
              <img
                src={qrCodeData.qrCodeUrl}
                alt="Generated QR Code"
                className="w-64 h-64 object-contain"
                onLoad={() => setImageLoading(false)}
                onLoadStart={() => setImageLoading(true)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleCopyUrl}
            variant="outline"
            className="flex-1"
            disabled={copySuccess}
          >
            {copySuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy URL
              </>
            )}
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>

        <Separator className="bg-border/50" />

        {/* Metadata */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">QR Code Details</h4>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Name:</span>
              <Badge variant="secondary" className="ml-auto">
                {qrCodeData.userName}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Email:</span>
              <Badge variant="secondary" className="ml-auto font-mono text-xs">
                {qrCodeData.userEmail}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Created:</span>
              <Badge variant="outline" className="ml-auto">
                {formatDate(qrCodeData.createdAt)}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Generate New Button */}
        <Button
          onClick={onNewQRCode}
          variant="outline"
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate New QR Code
        </Button>
      </CardContent>
    </Card>
  );
};