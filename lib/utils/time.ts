export function formatDateString(date:string, locale:string = 'en-us') {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString(
    locale,
    {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
      day: 'numeric'
    }
  );

  return formattedDate;
}

export function timeElapsed(fromDate:string, locale = 'en') {
  const today:Date = new Date();
  const startDate:Date = new Date(fromDate);
  const timeDiff:number = today.getTime() - startDate.getTime();
  const time = timeDiff / (1000 * 60 * 60 * 24);
  return Math.round(time);
}

const methods = { formatDateString, formatDateStringLong, timeElapsed };

export default methods;
