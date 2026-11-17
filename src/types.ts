export interface Booking {
  start: number; // minutes from midnight
  end: number;
  title: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  blockedReason?: string;
  bookings: Booking[];
}

export type AvailabilityResult =
  | { available: true }
  | { available: false; reason: string };
