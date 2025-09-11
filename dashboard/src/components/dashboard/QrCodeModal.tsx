import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Participant } from '@/types/participant';

interface QrCodeModalProps {
  participant: Participant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ 
  participant, 
  isOpen, 
  onClose 
}) => {
  if (!participant) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dashboard-card border-dashboard-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Participant QR Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Participant Info */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{participant.name}</h3>
            <p className="text-muted-foreground">{participant.email}</p>
            <p className="text-muted-foreground">{participant.phone}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg">
              <img 
                src={participant.qrCodeUrl} 
                alt={`QR Code for ${participant.name}`}
                className="w-48 h-48 object-contain"
              />
            </div>
          </div>

          {/* Status and Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status:</span>
              <Badge 
                variant={participant.hasClaimed ? "default" : "secondary"}
                className={participant.hasClaimed 
                  ? "bg-kpi-success text-white" 
                  : "bg-kpi-neutral text-white"
                }
              >
                {participant.hasClaimed ? 'Claimed' : 'Unclaimed'}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Registered:</span>
              <span className="text-sm text-foreground">
                {formatDate(participant.registeredAt)}
              </span>
            </div>
            
            {participant.hasClaimed && participant.claimedAt && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Claimed:</span>
                <span className="text-sm text-foreground">
                  {formatDate(participant.claimedAt)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Token:</span>
              <span className="text-sm text-foreground font-mono">
                {participant.qrCodeToken.slice(0, 8)}...
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};