import { IComment } from '../services/CommentsServices';
import { IReply } from '../services/CommentReplyServices';

interface ICommentStore {
  [key: string]: IComment;
}

interface IReplyStore {
  [key: string]: { [key: string]: IReply };
}

interface IReplyNextStore {
  [key: string]: null | undefined | number;
}

export default class CommentUtils {
  static __COMMENT_STORE = {} as ICommentStore;
  static __REPLY_STORE = {} as IReplyStore;
  static next = undefined as null | undefined | number;
  static repliesNextCursor = {} as IReplyNextStore;

  static parseComments(
    comments: any,
    action?: 'fetchMore' | null,
  ): { comments: IComment[]; next: null | undefined | number } {
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
      } else if (
        comment.id in CommentUtils.__COMMENT_STORE === true &&
        CommentUtils.__COMMENT_STORE[comment.id].numReplies !== comment.numReplies
      ) {
        tempStore[comment.id] = {
          ...CommentUtils.__COMMENT_STORE[comment.id],
          numReplies: comment.numReplies,
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

    let firstComment = Object.values(CommentUtils.__COMMENT_STORE)[0];
    let next = (firstComment && firstComment.clientTimestamp) || null;
    CommentUtils.next = temp.length === 0 || CommentUtils.next === null ? null : next;
    return { comments: Object.values(CommentUtils.__COMMENT_STORE), next: CommentUtils.next };
  }

  static parseReplies(
    replies: any,
    commentId: string,
  ): { replies: IReply[]; next: null | undefined | number } {
    let temp: any = [];
    let tempStore: any = {};
    let didStoreUpdate: boolean = false;

    if (commentId in CommentUtils.repliesNextCursor === false) {
      CommentUtils.repliesNextCursor[commentId] = undefined;
    }

    replies.forEach((reply: any) => {
      temp.push({ id: reply.id, ...reply.data(), metadata: { ...reply.metadata } });
    });

    temp.forEach((reply: any) => {
      if (reply.id in (CommentUtils.__REPLY_STORE[commentId] || {}) === false) {
        let seconds = (reply.createdAt && reply.createdAt.seconds * 1000) || new Date().getTime();
        tempStore[reply.id] = { ...reply, createdAt: seconds };
        didStoreUpdate = true;
      } else if (
        reply.id in CommentUtils.__REPLY_STORE[commentId] === true &&
        CommentUtils.__REPLY_STORE[commentId][reply.id].text !== reply.text
      ) {
        tempStore[reply.id] = {
          ...CommentUtils.__REPLY_STORE[commentId][reply.id],
          text: reply.text,
          updatedAt: reply.updatedAt || new Date().getTime(),
        };
        didStoreUpdate = true;
      }
    });

    CommentUtils.__REPLY_STORE[commentId] = {
      ...CommentUtils.__REPLY_STORE[commentId],
      ...tempStore,
    };

    if (didStoreUpdate === false) {
      replies.docChanges().forEach(function(change: any) {
        if (change.type === 'removed') {
          delete CommentUtils.__REPLY_STORE[commentId][change.doc.id];
        }
      });
    }

    let allReplies =
      (CommentUtils.__REPLY_STORE[commentId] &&
        Object.values(CommentUtils.__REPLY_STORE[commentId])) ||
      [];
    let lastReply = allReplies[allReplies.length - 1];
    let next = (lastReply && lastReply.clientTimestamp) || null;
    CommentUtils.repliesNextCursor[commentId] =
      temp.length === 0 || CommentUtils.repliesNextCursor[commentId] === null ? null : next;
    return {
      replies: allReplies,
      next: CommentUtils.repliesNextCursor[commentId],
    };
  }
}
