const toDate = (date: Date | string): Date =>
  date instanceof Date ? date : new Date(date);

export const formatEventCardDate = (date: Date | string): string =>
  toDate(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const formatCompactEventCardDate = (date: Date | string): string =>
  toDate(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
