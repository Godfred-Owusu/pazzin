import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { QRCodeForm } from "./QRCodeForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import axios from "axios";

export interface QRCodeData {
  id: string;
  qrCodeUrl: string;
  qrCodeToken: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  programId: string;
}

export interface Program {
  _id: string;
  name: string;
}

export const QRCodeGenerator = () => {
  const [qrCodeData, setQRCodeData] = useState<QRCodeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);

  // Fetch programs on component mount
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/programs");
        setPrograms(response.data);
      } catch (error) {
        console.error("Failed to fetch programs:", error);
        toast({
          title: "Error",
          description: "Failed to load programs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setProgramsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Register user API call
  const registerUser = async (userData: UserFormData): Promise<boolean> => {
    try {
      const response = await axios.post(
        "http://localhost:3000/participants/register",
        {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          programId: userData.programId,
        }
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const handleRegister = async (userData: UserFormData) => {
    setIsLoading(true);

    try {
      const success = await registerUser(userData);

      if (success) {
        toast({
          title: "Registration Successful!",
          description: `QR code has been sent to ${userData.email}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Registration Failed",
          description:
            "Unable to send QR code to your email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Unable to send QR code to your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewQRCode = () => {
    setQRCodeData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-surface p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-full shadow-glow animate-glow-pulse">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Pazzin
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Register to receive your personalized QR code via email. Enter your
            details below to get started.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-card border-border/50 shadow-card-custom animate-scale-in">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">
                Register
              </CardTitle>
              <CardDescription>
                Fill in your details to receive your QR code via email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QRCodeForm
                onSubmit={handleRegister}
                isLoading={isLoading}
                programs={programs}
                programsLoading={programsLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
