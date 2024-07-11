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

type DateParam = Date | string;

// TODO: Add conversions to monts, years, etc -- currently this only returns number of days
export function daysAgo(fromDate:DateParam, toDate:DateParam = new Date()) {
  const toDateFormatted:Date = typeof toDate === 'string' ? new Date(toDate) : toDate;
  const startDate:Date = typeof fromDate === 'string' ? new Date(fromDate) : fromDate;
  const timeDiff:number = toDateFormatted.getTime() - startDate.getTime();
  const time = timeDiff / (1000 * 60 * 60 * 24);
  const days = Math.round(time);
  return days;
}

export function timeElapsed(
  fromDate:DateParam,
  toDate:DateParam = new Date(),
  unit:'minutes'|undefined = undefined
) {
  const toDateFormatted:Date = typeof toDate === 'string' ? new Date(toDate) : toDate;
  const startDate:Date = typeof fromDate === 'string' ? new Date(fromDate) : fromDate;
  const timeDiff:number = toDateFormatted.getTime() - startDate.getTime();

  switch (unit) {
    case 'minutes': {
      return timeDiff / ((1000 * 60 * 60) / 60);
    }
    default: return timeDiff;
  }
}

const methods = { formatDateString, formatDateStringLong, daysAgo };

export default methods;
