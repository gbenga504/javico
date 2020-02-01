import { IComment } from '../services/CommentsServices';

interface ICommentStore {
  [key: string]: IComment;
}

export default class CommentUtils {
  static __COMMENT_STORE = {} as ICommentStore;
  static next = undefined as null | undefined | number;

  static parseComments(
    comments: any,
    action?: 'fetchMore' | null,
  ): { comments: IComment[]; next: null | number } {
    let temp: any = [];
    let tempStore: any = {};
    let didStoreUpdate: boolean = false;

    comments.forEach((comment: any) => {
      temp.unshift({ id: comment.id, ...comment.data(), metadata: { ...comment.metadata } });
    });

    temp.forEach((comment: any) => {
      if (comment.id in CommentUtils.__COMMENT_STORE === false) {
        let seconds =
          (comment.createdAt && comment.createdAt.seconds * 1000) || new Date().getTime();
        tempStore[comment.id] = { ...comment, createdAt: seconds };
        didStoreUpdate = true;
      } else if (
        comment.id in CommentUtils.__COMMENT_STORE === true &&
        CommentUtils.__COMMENT_STORE[comment.id].text !== comment.text
      ) {
        tempStore[comment.id] = {
          ...CommentUtils.__COMMENT_STORE[comment.id],
          text: comment.text,
          updatedAt: comment.updatedAt || new Date().getTime(),
        };
        didStoreUpdate = true;
      }
    });

    if (action === 'fetchMore') {
      CommentUtils.__COMMENT_STORE = { ...tempStore, ...CommentUtils.__COMMENT_STORE };
    } else {
      CommentUtils.__COMMENT_STORE = { ...CommentUtils.__COMMENT_STORE, ...tempStore };
    }

    if (didStoreUpdate === false) {
      comments.docChanges().forEach(function(change: any) {
        if (change.type === 'removed') {
          delete CommentUtils.__COMMENT_STORE[change.doc.id];
        }
      });
    }

    let next = Object.values(CommentUtils.__COMMENT_STORE)[0].clientTimestamp;
    CommentUtils.next = temp.length === 0 || CommentUtils.next === null ? null : next;
    return { comments: Object.values(CommentUtils.__COMMENT_STORE), next: CommentUtils.next };
  }
}
