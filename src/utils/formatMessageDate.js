export default (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
};