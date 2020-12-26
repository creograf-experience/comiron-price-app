export const getTimeUntilEnddate = dateStr => {
  const enddate = new Date(dateStr);
  enddate.setHours(23, 59, 59, 999);

  const t = Date.parse(enddate) - Date.parse(new Date());
  const t1 = dateStr - Date.parse(new Date());
  const secondsLeft = Math.floor((t / 1000) % 60);
  const minutesLeft = Math.floor((t / (1000 * 60)) % 60);
  const daysLeft = Math.floor(t / (1000 * 60 * 60 * 24)) - 1;
  const hoursLeft = Math.floor((t / (1000 * 60 * 60)) % 24);

  return {
    milliseconds: t1,
    secondsLeft,
    minutesLeft,
    daysLeft,
    hoursLeft,
  };
};