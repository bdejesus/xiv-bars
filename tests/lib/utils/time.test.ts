import {
  formatDateString, formatDateStringLong, daysAgo, timeElapsed
} from 'lib/utils/time';

const dateString = '2024-06-14T00:00:00Z';

describe('formatDateString', () => {
  it('returns a short formatted date', () => {
    const formattedDate = formatDateString(dateString);
    expect(formattedDate).toBe('Fri, Jun 14, 2024');
  });
});

describe('formatDateStringLong', () => {
  it('returns a long formatted date', () => {
    const formattedDate = formatDateStringLong(dateString);
    expect(formattedDate).toBe('Friday, June 14, 2024');
  });
});

describe('daysAgo', () => {
  it('returns the number of days', () => {
    const fromDate = dateString;
    const dateObj = new Date(dateString);
    const toDate = new Date(dateObj.setDate(dateObj.getDate() + 100));
    const numDays = daysAgo(fromDate, toDate);
    expect(numDays).toBe(100);
  });
});

describe('timeElapsed', () => {
  const fromDate = new Date();
  const toDate = new Date();
  toDate.setMinutes(fromDate.getMinutes() + 120);

  it('returns the amount of time', () => {
    const timeDiff = timeElapsed(fromDate, toDate);
    expect(timeDiff).toBe(7200000);
  });

  it('returns the amount of minutes', () => {
    const timeDiff = timeElapsed(fromDate, toDate, 'minutes');
    expect(timeDiff).toBe(120);
  });
});
