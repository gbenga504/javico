import { getReadableDate } from './TimeUtils';
import { IComment, ICommentDateSeperator } from '../services/CommentsServices';

interface ICommentStore {
  [key: string]: IComment | ICommentDateSeperator;
}

export default class CommentUtils {
  static __COMMENT_STORE = {} as ICommentStore;
  static previousDate: number | null = null;

  static parseComments(comments: Array<any>) {
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
          CommentUtils.__COMMENT_STORE[`${seconds}`] = {
            id: `${seconds}`,
            type: 'seperator',
            text: getReadableDate(seconds),
          };
          CommentUtils.previousDate = currentDate;
        }
        CommentUtils.__COMMENT_STORE[comment.id] = { ...comment, createdAt: seconds };
      } else if (
        comment.id in CommentUtils.__COMMENT_STORE === true &&
        CommentUtils.__COMMENT_STORE[comment.id].text !== comment.text
      ) {
        CommentUtils.__COMMENT_STORE[comment.id] = {
          ...CommentUtils.__COMMENT_STORE[comment.id],
          text: comment.text,
          updatedAt: comment.updatedAt || new Date().getTime(),
        };
      }
    });

    return Object.values(CommentUtils.__COMMENT_STORE);
  }
}
