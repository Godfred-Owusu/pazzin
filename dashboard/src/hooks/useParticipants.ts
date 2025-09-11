import { useState, useEffect } from 'react';
import { Participant, ParticipantStats } from '@/types/participant';

// Mock data for development
const mockParticipants: Participant[] = [
  {
    _id: "68bee76d85c9f2312549a344",
    name: "Godfred Owusu",
    email: "godfredmirekuowusu@gmail.com",
    phone: "+233591130145",
    programId: "68bedbc1959366b0a6b72f9f",
    registeredAt: "2025-09-08T14:25:49.754+00:00",
    qrCodeToken: "1d787f94-0bb9-4735-a12c-dceb1cbeac1c",
    qrCodeUrl: "/src/assets/sample-qr.png",
    hasClaimed: false,
    claimedAt: null
  },
  {
    _id: "68bee76d85c9f2312549a345",
    name: "Amelia Johnson",
    email: "amelia.johnson@example.com",
    phone: "+1234567890",
    programId: "68bedbc1959366b0a6b72f9f",
    registeredAt: "2025-09-07T10:15:30.500+00:00",
    qrCodeToken: "2e898g05-1cc0-4846-b13d-efgc2dcfcd4d",
    qrCodeUrl: "/src/assets/sample-qr.png",
    hasClaimed: true,
    claimedAt: "2025-09-07T15:30:45.200+00:00"
  },
  {
    _id: "68bee76d85c9f2312549a346",
    name: "Marcus Chen",
    email: "marcus.chen@tech.co",
    phone: "+65987654321",
    programId: "68bedbc1959366b0a6b72f9f",
    registeredAt: "2025-09-06T08:45:20.100+00:00",
    qrCodeToken: "3f909h16-2dd1-4957-c24e-fhid3edjde5e",
    qrCodeUrl: "/src/assets/sample-qr.png",
    hasClaimed: true,
    claimedAt: "2025-09-06T12:20:15.800+00:00"
  },
  {
    _id: "68bee76d85c9f2312549a347",
    name: "Sofia Rodriguez",
    email: "sofia.rodriguez@gmail.com",
    phone: "+34612345678",
    programId: "68bedbc1959366b0a6b72f9f",
    registeredAt: "2025-09-05T16:30:10.300+00:00",
    qrCodeToken: "4g010i27-3ee2-5068-d35f-ghje4fejef6f",
    qrCodeUrl: "/src/assets/sample-qr.png",
    hasClaimed: false,
    claimedAt: null
  },
  {
    _id: "68bee76d85c9f2312549a348",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@domain.com",
    phone: "+201234567890",
    programId: "68bedbc1959366b0a6b72f9f",
    registeredAt: "2025-09-04T09:20:15.600+00:00",
    qrCodeToken: "5h121j38-4ff3-6179-e46g-ihkf5gfkfg7g",
    qrCodeUrl: "/src/assets/sample-qr.png",
    hasClaimed: true,
    claimedAt: "2025-09-04T14:45:30.900+00:00"
  },
  {
    _id: "68bee76d85c9f2312549a349",
    name: "Emily Wilson",
    email: "emily.wilson@startup.io",
    phone: "+44123456789",
    programId: "68bedbc1959366b0a6b72f9f",
    registeredAt: "2025-09-03T13:15:40.200+00:00",
    qrCodeToken: "6i232k49-5gg4-728a-f57h-jilg6hglgh8h",
    qrCodeUrl: "/src/assets/sample-qr.png",
    hasClaimed: false,
    claimedAt: null
  }
];

export const useParticipants = () => {
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate stats
  const stats: ParticipantStats = {
    totalRegistrations: participants.length,
    claimedCount: participants.filter(p => p.hasClaimed).length,
    unclaimedCount: participants.filter(p => !p.hasClaimed).length,
    claimRate: participants.length > 0 ? 
      (participants.filter(p => p.hasClaimed).length / participants.length) * 100 : 0
  };

  // SSE connection for real-time updates
  useEffect(() => {
    // In production, connect to SSE endpoint
    // const eventSource = new EventSource('/api/participants/stream');
    
    // eventSource.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'new_registration') {
    //     setParticipants(prev => [data.participant, ...prev]);
    //   } else if (data.type === 'claim_update') {
    //     setParticipants(prev => prev.map(p => 
    //       p._id === data.participantId 
    //         ? { ...p, hasClaimed: data.hasClaimed, claimedAt: data.claimedAt }
    //         : p
    //     ));
    //   }
    // };

    // return () => eventSource.close();
  }, []);

  return {
    participants,
    stats,
    loading,
    error
  };
};