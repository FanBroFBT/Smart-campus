import { test, expect } from 'vitest';
import { checkAvailability } from './utils';
import type { Room } from './types';

const NOW = 540; // 09:00, фиксированное время

// Свежая комната на каждый вызов: не заблокирована, бронь 10:00-11:00
const makeRoom = (over: Partial<Room> = {}): Room => ({
  id: 'r1',
  name: 'Room 1',
  building: 'A',
  capacity: 10,
  blocked: false,
  bookings: [{ start: 600, end: 660, title: 'Existing' }],
  ...over,
});

const check = (start: number | null, end: number | null, over: Partial<Room> = {}) =>
  checkAvailability(makeRoom(over), start, end, NOW);

// ---------- AC4: касание границ ----------
test('T01 AC4: touching after is available', () =>
  expect(check(660, 720)).toEqual({ available: true }));
test('T08 AC4: touching before is available', () =>
  expect(check(570, 600)).toEqual({ available: true }));

// ---------- AC1: некорректный интервал ----------
test('T02 AC1: starts now is rejected', () =>
  expect(check(540, 570).available).toBe(false));
test('T03 AC1: zero duration is rejected', () =>
  expect(check(720, 720).available).toBe(false));
test('T04 AC1: reversed interval is rejected', () =>
  expect(check(750, 720).available).toBe(false));
test('T05 AC1: past day end is rejected', () =>
  expect(check(1380, 1441).available).toBe(false));

// ---------- AC2: длительность ----------
test('T06 AC2: exactly 120 min is available', () =>
  expect(check(720, 840)).toEqual({ available: true }));
test('T07 AC2: 121 min is rejected', () =>
  expect(check(720, 841).available).toBe(false));

// ---------- AC4: пересечения ----------
test('T09 AC4: partial overlap is rejected', () =>
  expect(check(630, 690)).toEqual({
    available: false,
    reason: expect.stringContaining('Existing'),
  }));
test('T10 AC4: candidate contains booking is rejected', () =>
  expect(check(570, 690).available).toBe(false));
test('T11 AC4: candidate inside booking is rejected', () =>
  expect(check(615, 645).available).toBe(false));
test('T12 AC4: identical interval is rejected', () =>
  expect(check(600, 660).available).toBe(false));

// ---------- AC3: заблокированная комната ----------
test('T13 AC3: blocked room is rejected', () =>
  expect(check(660, 720, { blocked: true })).toEqual({
    available: false,
    reason: 'This room is currently blocked.',
  }));

// ---------- AC4: нет броней ----------
test('T14 AC4: no bookings is available', () =>
  expect(check(630, 690, { bookings: [] })).toEqual({ available: true }));

// ---------- AC5: данные не меняются (брони намеренно не по порядку) ----------
test('T15 AC5: room data is not mutated', () => {
  const room = makeRoom({
    bookings: [
      { start: 800, end: 860, title: 'Late' },
      { start: 600, end: 660, title: 'Early' },
    ],
  });
  const before = JSON.parse(JSON.stringify(room));
  checkAvailability(room, 660, 720, NOW);
  expect(room).toEqual(before);
});

// ---------- Два своих случая ----------
test('T16 own: starts 1 min after now and touches booking start', () =>
  expect(check(541, 600)).toEqual({ available: true })); // граница "в прошлом": 541 > 540
test('T17 own: ends exactly at 24:00', () =>
  expect(check(1380, 1440)).toEqual({ available: true })); // граница конца дня