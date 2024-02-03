export function formatDateString(date: string) {
  const formattedDate = new Date(date);
  return formattedDate.toDateString();
}

const methods = { formatDateString };

export default methods;
