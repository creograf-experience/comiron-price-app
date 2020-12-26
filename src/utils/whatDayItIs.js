import formatMessageDate from './formatMessageDate';

export const format = formatter => (date = null) => {
  switch (formatter) {
    case 'Today':
      return 'Сегодня';

    case 'Yesterday':
      return 'Вчера';

    case 'dd.mm.yy': {
      const day = `${ ('0' + date.day).slice(-2) }`;
      const month = `${ ('0' + (date.month + 1)).slice(-2) }`;
      const year = `${ date.year }`.slice(2);

      return `${ day }.${ month }.${ year }`;
    };

    case 'hh:mm':
      return formatMessageDate(date.fullDate);

    default:
      return date;
  }
};

export const whatDayItIs = (date, formatter) => {
  const today = {
    day: new Date(Date.now()).getUTCDate(),
    month: new Date(Date.now()).getUTCMonth(),
    year: new Date(Date.now()).getUTCFullYear(),
  };

  if (
    date.day === today.day &&
    date.month === today.month &&
    date.year === today.year
  ) {
    return formatter(date);
  }

  if (
    date.day + 1 === today.day &&
    date.month === today.month &&
    date.year === today.year
  ) {
    return format('Yesterday')();
  }

  // eg. 02.11.18
  return format('dd.mm.yy')(date);
};
