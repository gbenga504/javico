import { getReadableDate } from './TimeUtils';

export default class CommentUtils {
  static parseComments(comments: [any]) {
    let previousDate: number | null = null;

    return comments.reduce((acc, comment) => {
      let currentDate = new Date(comment.createdAt).getDate();
      if (currentDate !== previousDate) {
        acc.push({
          id: comment.createdAt,
          type: 'seperator',
          value: getReadableDate(comment.createdAt),
        });
        previousDate = currentDate;
      }
      acc.push(comment);
      return acc;
    }, []);
  }
}
