export function parseDateInput(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-");

  return `${day}/${month}/${year}`;
}
