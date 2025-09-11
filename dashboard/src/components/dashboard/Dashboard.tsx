import React, { useState } from "react";
import { KpiCards } from "./KpiCards";
import { Charts } from "./Charts";
import { ParticipantsTable } from "./ParticipantsTable";
import { QrCodeModal } from "./QrCodeModal";
import { useParticipants } from "@/hooks/useParticipants";
import { Participant } from "@/types/participant";

export const Dashboard: React.FC = () => {
  const { participants, stats, loading, error } = useParticipants();
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleParticipantClick = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedParticipant(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dashboard">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dashboard">
        <div className="text-center">
          <p className="text-destructive mb-4">
            Error loading dashboard: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Pazzin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor event participants and track real-time registrations
          </p>
        </div>

        {/* KPI Cards */}
        <KpiCards />

        {/* Charts */}
        <Charts participants={participants} stats={stats} />

        {/* Participants Table */}
        <ParticipantsTable
          // participants={participants}
          onRowClick={handleParticipantClick}
        />

        {/* QR Code Modal */}
        <QrCodeModal
          participant={selectedParticipant}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};
