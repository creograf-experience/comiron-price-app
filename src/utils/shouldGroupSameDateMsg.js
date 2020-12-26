import formatMessageDate from './formatMessageDate';

const shouldGroupSameDateMsg = (message, prevMsg) => {
  if (!prevMsg) return false;

  const date = {
    time: formatMessageDate(message.createdAt),
    day: new Date(message.createdAt).getUTCDate(),
  };
  const prevDate = {
    time: formatMessageDate(prevMsg.createdAt),
    day: new Date(prevMsg.createdAt).getUTCDate(),
  };

  if (
    date.time !== prevDate.time ||
    date.day !== prevDate.day ||
    message.from !== prevMsg.from
  ) return false;

  return true;
};

export default shouldGroupSameDateMsg;