export interface Participant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  programId: string;
  registeredAt: string;
  qrCodeToken: string;
  qrCodeUrl: string;
  hasClaimed: boolean;
  claimedAt: string | null;
}

export interface ParticipantStats {
  totalRegistrations: number;
  claimedCount: number;
  unclaimedCount: number;
  claimRate: number;
}