// src/dashboard/dashboard.controller.ts
import { Controller, Get, Sse, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { map } from 'rxjs/operators';
import { ParticipantsService } from '../participants/participants.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly participantsService: ParticipantsService,
  ) {}

  @Get('sse')
  @Sse()
  async sendEvents(): Promise<Observable<MessageEvent>> {
    // Initial data payload for the dashboard
    const initialData = await this.getData();
    const initialEvent: MessageEvent = {
      data: { type: 'initial_data', payload: initialData },
    };

    // Create an observable to emit events whenever new data is available
    return new Observable<MessageEvent>((observer) => {
      observer.next(initialEvent);

      // Listen for participant registration events
      const onRegistration = async (participant) => {
        const newData = await this.getData();
        observer.next({ data: { type: 'registration', payload: newData } });
      };

      // Listen for participant claim events
      const onClaim = async (participant) => {
        const newData = await this.getData();
        observer.next({ data: { type: 'claim', payload: newData } });
      };

      this.eventEmitter.on('participant.registered', onRegistration);
      this.eventEmitter.on('participant.claimed', onClaim);

      return () => {
        // Clean up listeners when the client disconnects
        this.eventEmitter.off('participant.registered', onRegistration);
        this.eventEmitter.off('participant.claimed', onClaim);
      };
    }).pipe(
      map((event) => {
        return event;
      }),
    );
  }

  private async getData() {
    const participants = await this.participantsService.findAll();
    const totalRegistrations = participants.length;
    const claimedParticipants = participants.filter((p) => p.hasClaimed).length;
    const unclaimedParticipants = totalRegistrations - claimedParticipants;
    const claimedRate =
      totalRegistrations > 0
        ? (claimedParticipants / totalRegistrations) * 100
        : 0;

    return {
      kpis: {
        totalRegistrations,
        claimed: claimedParticipants,
        unclaimed: unclaimedParticipants,
        claimedRate: parseFloat(claimedRate.toFixed(2)),
      },
      claimStatusDistribution: {
        claimed: claimedParticipants,
        unclaimed: unclaimedParticipants,
      },
      registrationsOverTime: this.aggregateRegistrationsByDate(participants),
      participantsTable: participants.map((p) => ({
        // id: p._id,
        name: p.name,
        // programId: p.programId,
        programId: p.programId, // Add this field
        qrCodeToken: p.qrCodeToken, // Add this field
        qrCodeUrl: p.qrCodeUrl, // Add this field
        email: p.email,
        phone: p.phone,
        hasClaimed: p.hasClaimed,
        registeredAt: p.registeredAt,
        claimedAt: p.claimedAt,
      })),
    };
  }

  private aggregateRegistrationsByDate(participants) {
    const dailyCounts = participants.reduce((acc, p) => {
      const date = p.registeredAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(dailyCounts).map((date) => ({
      date,
      count: dailyCounts[date],
    }));
  }
}
