import type { Room } from './types';

// Fictional sample data — all times are minutes from midnight.
export const SAMPLE_ROOMS: Room[] = [
  {
    id: 'a101',
    name: 'Room A-101',
    building: 'Engineering Block',
    capacity: 40,
    blocked: false,
    bookings: [
      { start: 540, end: 600, title: 'Data Structures Lecture' },
      { start: 780, end: 840, title: 'Faculty Meeting' },
    ],
  },
  {
    id: 'b220',
    name: 'Room B-220',
    building: 'Science Wing',
    capacity: 25,
    blocked: false,
    bookings: [
      { start: 600, end: 660, title: 'Physics Lab' },
      { start: 900, end: 960, title: 'Research Seminar' },
    ],
  },
  {
    id: 'c105',
    name: 'Room C-105',
    building: 'Business Center',
    capacity: 60,
    blocked: true,
    blockedReason: 'Under renovation until further notice.',
    bookings: [],
  },
  {
    id: 'd310',
    name: 'Room D-310',
    building: 'Library Tower',
    capacity: 15,
    blocked: false,
    bookings: [
      { start: 480, end: 510, title: 'Morning Study Group' },
      { start: 1020, end: 1080, title: 'Book Club' },
    ],
  },
  {
    id: 'e014',
    name: 'Room E-014',
    building: 'Arts Pavilion',
    capacity: 30,
    blocked: false,
    bookings: [
      { start: 690, end: 750, title: 'Painting Workshop' },
    ],
  },
];
