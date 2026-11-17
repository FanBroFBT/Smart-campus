import { useMemo, useState } from 'react';
import { Clock, MapPin, Users, Ban, CheckCircle2, XCircle, Building2, CalendarClock, AlertCircle } from 'lucide-react';
import type { AvailabilityResult, Room } from './types';
import { SAMPLE_ROOMS } from './data';
import {
  checkAvailability,
  labelToMinutes,
  minutesToLabel,
  MINUTES_PER_DAY,
} from './utils';

function useDefaultTimeLabel(): string {
  const [label] = useState(() => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  });
  return label;
}

interface RoomCardProps {
  room: Room;
  selected: boolean;
  onSelect: () => void;
}

function RoomCard({ room, selected, onSelect }: RoomCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`text-left w-full rounded-xl border p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
        selected
          ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-200'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className={`h-5 w-5 ${selected ? 'text-sky-600' : 'text-slate-400'}`} />
          <span className="font-semibold text-slate-800">{room.name}</span>
        </div>
        {room.blocked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            <Ban className="h-3 w-3" /> Blocked
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Building2 className="h-3.5 w-3.5" /> {room.building}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" /> {room.capacity} seats
        </span>
      </div>
    </button>
  );
}

interface TimelineProps {
  room: Room;
}

function Timeline({ room }: TimelineProps) {
  const ticks = useMemo(() => {
    const result: number[] = [];
    for (let m = 0; m <= MINUTES_PER_DAY; m += 180) {
      result.push(m);
    }
    return result;
  }, []);

  return (
    <div className="mt-4">
      <h4 className="mb-2 text-sm font-medium text-slate-600">Today's schedule</h4>
      <div className="relative h-12 w-full overflow-hidden rounded-lg bg-slate-100">
        {room.bookings.map((b, i) => {
          const leftPct = (b.start / MINUTES_PER_DAY) * 100;
          const widthPct = ((b.end - b.start) / MINUTES_PER_DAY) * 100;
          return (
            <div
              key={i}
              className="absolute top-0 flex h-full items-center justify-center overflow-hidden bg-sky-500/80 px-1 text-[10px] font-medium text-white whitespace-nowrap"
              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
              title={`${b.title} (${minutesToLabel(b.start)}–${minutesToLabel(b.end)})`}
            >
              <span className="truncate">{b.title}</span>
            </div>
          );
        })}
        {room.blocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 text-xs font-medium text-red-700">
            Blocked — not available
          </div>
        )}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        {ticks.map((t) => (
          <span key={t}>{minutesToLabel(t)}</span>
        ))}
      </div>

      {room.bookings.length > 0 ? (
        <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
          {room.bookings.map((b, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-sky-500" />
              <span className="font-medium text-slate-700">{b.title}</span>
              <span className="text-slate-400">
                {minutesToLabel(b.start)}–{minutesToLabel(b.end)}
              </span>
            </li>
          ))}
        </ul>
      ) : !room.blocked ? (
        <p className="mt-3 text-sm text-slate-400">No existing bookings today.</p>
      ) : null}
    </div>
  );
}

interface ResultBannerProps {
  result: AvailabilityResult | null;
}

function ResultBanner({ result }: ResultBannerProps) {
  if (!result) return null;

  if (result.available) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
        <div>
          <p className="font-semibold text-emerald-800">Available</p>
          <p className="text-sm text-emerald-700">This room can be booked for the requested interval.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
      <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
      <div>
        <p className="font-semibold text-red-800">Unavailable</p>
        <p className="text-sm text-red-700">{result.reason}</p>
      </div>
    </div>
  );
}

function App() {
  const rooms = useMemo(() => SAMPLE_ROOMS, []);
  const defaultTimeLabel = useDefaultTimeLabel();
  const [currentTimeLabel, setCurrentTimeLabel] = useState(defaultTimeLabel);
  const currentTimeMissing = currentTimeLabel.trim() === '';
  const currentTime = labelToMinutes(currentTimeLabel) ?? 0;

  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id ?? '');
  const [startLabel, setStartLabel] = useState('09:00');
  const [endLabel, setEndLabel] = useState('10:00');
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null;

  const handleCheck = () => {
    if (currentTimeLabel.trim() === '') {
      setResult({ available: false, reason: 'Enter the current time.' });
      return;
    }
    const start = labelToMinutes(startLabel);
    const end = labelToMinutes(endLabel);
    setResult(checkAvailability(selectedRoom, start, end, currentTime));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 text-white">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 sm:text-xl">Smart Campus Room Availability</h1>
              <p className="text-sm text-slate-500">Check whether a lecture room is free before you book it.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left column: room list + timeline */}
          <section>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <label htmlFor="current-time" className="text-sm font-medium text-slate-600">Current time</label>
              </div>
              <input
                id="current-time"
                type="time"
                value={currentTimeLabel}
                onChange={(e) => {
                  setCurrentTimeLabel(e.target.value);
                  setResult(null);
                }}
                className="w-32 rounded-lg border border-slate-300 px-3 py-1.5 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <p className="text-xs text-slate-400 sm:ml-1">Defaults to now — change it to test fixed scenarios.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  selected={room.id === selectedRoomId}
                  onSelect={() => {
                    setSelectedRoomId(room.id);
                    setResult(null);
                  }}
                />
              ))}
            </div>

            {selectedRoom && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">{selectedRoom.name}</h3>
                  {selectedRoom.blocked && (
                    <span className="text-xs text-red-600">{selectedRoom.blockedReason}</span>
                  )}
                </div>
                <Timeline room={selectedRoom} />
              </div>
            )}
          </section>

          {/* Right column: checker form */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-slate-800">Check availability</h2>

              <label className="mb-1 block text-sm font-medium text-slate-600">Start time</label>
              <input
                type="time"
                value={startLabel}
                onChange={(e) => {
                  setStartLabel(e.target.value);
                  setResult(null);
                }}
                className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />

              <label className="mb-1 block text-sm font-medium text-slate-600">End time</label>
              <input
                type="time"
                value={endLabel}
                onChange={(e) => {
                  setEndLabel(e.target.value);
                  setResult(null);
                }}
                className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />

              <button
                type="button"
                onClick={handleCheck}
                className="w-full rounded-lg bg-sky-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1"
              >
                Check availability
              </button>

              <p className="mt-3 text-xs text-slate-400">
                Max 120 minutes. Times are on a 24-hour clock. This tool only checks availability — it does not create a booking.
              </p>

              <div className="mt-4">
                {currentTimeMissing ? (
                  result && !result.available && (
                    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                      <div>
                        <p className="font-semibold text-amber-800">Validation needed</p>
                        <p className="text-sm text-amber-700">{result.reason}</p>
                      </div>
                    </div>
                  )
                ) : (
                  <ResultBanner result={result} />
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
