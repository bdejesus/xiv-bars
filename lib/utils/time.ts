export function formatDateString(date:string, locale:string = 'en') {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString(
    locale,
    {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    }
  );

  return formattedDate;
}

export function formatDateStringLong(date:string, locale:string = 'en') {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString(
    locale,
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    }
  );

  return formattedDate;
}

// TODO: Add conversions to monts, years, etc -- currently this only returns number of days
export function timeElapsed(fromDate:string, toDate:Date|string = new Date()) {
  const toDateFormatted:Date = typeof toDate === 'string' ? new Date(toDate) : toDate;
  const startDate:Date = new Date(fromDate);
  const timeDiff:number = toDateFormatted.getTime() - startDate.getTime();
  const time = timeDiff / (1000 * 60 * 60 * 24);
  const days = Math.round(time);
  return days;
}

const methods = { formatDateString, formatDateStringLong, timeElapsed };

export default methods;
