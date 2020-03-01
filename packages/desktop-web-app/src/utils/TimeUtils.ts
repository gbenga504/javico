import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

function getNthDate(date: number): string {
  switch (date) {
    case 1:
      return `${date}st`;
    case 2:
      return `${date}nd`;
    case 3:
      return `${date}rd`;
    default:
      return `${date}th`;
  }
}

export function parseTime(time: number): string {
  let date = new Date(time);
  return date.toLocaleString('default', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
}

export function getReadableDate(time: number): string {
  let date = new Date(time);
  const month = date.toLocaleString('default', { month: 'long' });
  return `${month} ${getNthDate(date.getDate())}, ${date.getFullYear()}`;
}

export function getRelativeTime(time: number): string {
  let date = new Date(time);
  return dayjs().to(dayjs(date), false);
}
