export const getDayMonthYear = dateStr => {
  const date = new Date(dateStr);

  const day = `${("0" + date.getUTCDate()).slice(-2)}`;
  const month = `${("0" + (date.getUTCMonth() + 1)).slice(-2)}`;
  const year = `${date.getUTCFullYear()}`.slice(2);

  return {
    day,
    month,
    year,
  };
};