import { describe, expect, test } from 'vitest';
import { labelToMinutes, minutesToLabel } from './utils';

describe('labelToMinutes', () => {
  test('parses valid labels', () => {
    expect(labelToMinutes('00:00')).toBe(0);
    expect(labelToMinutes('09:30')).toBe(570);
    expect(labelToMinutes('23:59')).toBe(1439);
  });

  test('rejects hour 24', () => {
    expect(labelToMinutes('24:00')).toBeNull();
  });

  test('rejects minute 60', () => {
    expect(labelToMinutes('12:60')).toBeNull();
  });

  test('rejects empty and malformed input', () => {
    expect(labelToMinutes('')).toBeNull();
    expect(labelToMinutes('abc')).toBeNull();
  });

  test('rejects single-digit minute', () => {
    expect(labelToMinutes('9:5')).toBeNull();
  });
});

describe('minutesToLabel', () => {
  test('formats minutes as HH:MM', () => {
    expect(minutesToLabel(0)).toBe('00:00');
    expect(minutesToLabel(570)).toBe('09:30');
    expect(minutesToLabel(1439)).toBe('23:59');
  });

  test('wraps 1440 to 00:00', () => {
    expect(minutesToLabel(1440)).toBe('00:00');
  });
});
