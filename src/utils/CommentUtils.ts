import { getReadableDate } from './TimeUtils';
import { IComment, ICommentDateSeperator } from '../services/CommentsServices';

interface ICommentStore {
  [key: string]: { pendingWrites: boolean };
}

export default class CommentUtils {
  static __COMMENT_STORE = {} as ICommentStore;
  static previousDate: number | null = null;

  static parseComments(comments: Array<any>) {
    let acc: Array<IComment | ICommentDateSeperator> = [];
    let temp: any = [];

    comments.forEach(comment => {
      temp.unshift({ id: comment.id, ...comment.data(), metadata: { ...comment.metadata } });
    });

    temp.forEach((comment: any) => {
      if (comment.id in CommentUtils.__COMMENT_STORE === false) {
        let seconds =
          (comment.createdAt && comment.createdAt.seconds * 1000) || new Date().getTime();
        let currentDate = new Date(seconds).getDate();
        if (currentDate !== CommentUtils.previousDate) {
          acc.push({
            id: `${seconds}`,
            type: 'seperator',
            text: getReadableDate(seconds),
          });
          CommentUtils.previousDate = currentDate;
        }
        acc.push({ ...comment, createdAt: seconds, id: comment.id });
        CommentUtils.__COMMENT_STORE[comment.id] = {
          pendingWrites: comment.metadata.hasPendingWrites,
        };
      } else {
        CommentUtils.__COMMENT_STORE[comment.id] = {
          pendingWrites: comment.metadata.hasPendingWrites,
        };
      }
    });

    return acc;
  }
}
