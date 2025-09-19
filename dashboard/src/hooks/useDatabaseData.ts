// src/hooks/useDashboardData.ts
import { useState, useEffect } from "react";

// Define the shape of your data
interface KpiData {
  totalRegistrations: number;
  claimed: number;
  unclaimed: number;
  claimedRate: number;
}

interface ParticipantData {
  id: string;
  name: string;
  email: string;
  phone: string;
  hasClaimed: boolean;
  registeredAt: string;
  claimedAt: string | null;
}

export interface DashboardParticipant {
  _id: string;
  programId: string;
  qrCodeToken: string;
  qrCodeUrl: string;
  name: string;
  email: string;
  phone: string;
  hasClaimed: boolean;
  registeredAt: string;
  claimedAt: string | null;
}

interface RegistrationOverTime {
  date: string;
  count: number;
}

interface DashboardState {
  kpis: KpiData;
  claimStatusDistribution: {
    claimed: number;
    unclaimed: number;
  };
  registrationsOverTime: RegistrationOverTime[];
  participantsTable: DashboardParticipant[];
}

const initialDashboardState: DashboardState = {
  kpis: {
    totalRegistrations: 0,
    claimed: 0,
    unclaimed: 0,
    claimedRate: 0,
  },
  claimStatusDistribution: {
    claimed: 0,
    unclaimed: 0,
  },
  registrationsOverTime: [],
  participantsTable: [],
};

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState<DashboardState>(
    initialDashboardState
  );

  useEffect(() => {
    const eventSource = new EventSource(
      "https://pazzin.onrender.com/dashboard/sse"
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Check if the payload matches the expected structure
        if (data.payload) {
          console.log("Received SSE data:", data.payload);
          setDashboardData(data.payload);
        }
      } catch (error) {
        console.error("Failed to parse SSE message:", error);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      // Clean up the connection when the component unmounts
      eventSource.close();
    };
  }, []);

  return dashboardData;
};
