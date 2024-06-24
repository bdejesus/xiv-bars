import { formatDateString, formatDateStringLong, timeElapsed } from 'lib/utils/time';

const dateString = "2024-06-14T00:00:00Z";

describe('formatDateString', () => {
  it('returns a short formatted date', () => {
    const formattedDate = formatDateString(dateString);
    expect(formattedDate).toBe('Thu, Jun 13, 2024');
  });
});

describe('formatDateStringLong', () => {
  it('returns a long formatted date', () => {
    const formattedDate = formatDateStringLong(dateString);
    expect(formattedDate).toBe('Thursday, June 13, 2024')
  });
});

describe('elapsedTime', () => {
  it('returns the number of days', () => {
    const fromDate = dateString;
    const dateObj = new Date(dateString);
    const toDate = new Date(dateObj.setDate(dateObj.getDate() + 100));
    const numDays = timeElapsed(fromDate, toDate);
    expect(numDays).toBe(100);
  });
});
