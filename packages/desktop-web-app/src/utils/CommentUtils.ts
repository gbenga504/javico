import { IComment, IReply } from "./Apis";

interface ICommentStore {
  [key: string]: IComment;
}

interface IReplyStore {
  [key: string]: { [key: string]: IReply };
}

interface IReplyNextStore {
  [key: string]: null | undefined | number;
}

/**
 * @class
 * @classdesc
 * This utils helps handle comment and reply based activities like formatting or parsing.
 */
export default class CommentUtils {
  static __COMMENT_STORE = {} as ICommentStore;
  static __REPLY_STORE = {} as IReplyStore;
  static next = undefined as null | undefined | number;
  static repliesNextCursor = {} as IReplyNextStore;

  static parseComments(
    comments: any,
    action?: "fetchMore" | null
  ): { comments: IComment[]; next: null | undefined | number } {
    //This function parses and formats the comments
    //Comments are arranged based on the action performed i.e fetchMore or (Others|null)
    //__COMMENT_STORE is also used to keep track of all the comments that has been loaded thus far on the app.
    //__COMMENT_STORE makes it possible to avoid duplication of data if there is a matching comment id
    let temp: any = [];
    let tempStore: any = {};
    let didStoreUpdate: boolean = false;

    comments.forEach((comment: any) => {
      temp.unshift({
        id: comment.id,
        ...comment.data(),
        metadata: { ...comment.metadata }
      });
    });

    temp.forEach((comment: any) => {
      if (comment.id in CommentUtils.__COMMENT_STORE === false) {
        let seconds =
          (comment.createdAt && comment.createdAt.seconds * 1000) ||
          new Date().getTime();
        tempStore[comment.id] = { ...comment, createdAt: seconds };
        didStoreUpdate = true;
      } else if (
        comment.id in CommentUtils.__COMMENT_STORE === true &&
        CommentUtils.__COMMENT_STORE[comment.id].text !== comment.text
      ) {
        tempStore[comment.id] = {
          ...CommentUtils.__COMMENT_STORE[comment.id],
          text: comment.text,
          updatedAt: comment.updatedAt || new Date().getTime()
        };
        didStoreUpdate = true;
      } else if (
        comment.id in CommentUtils.__COMMENT_STORE === true &&
        CommentUtils.__COMMENT_STORE[comment.id].numReplies !==
          comment.numReplies
      ) {
        tempStore[comment.id] = {
          ...CommentUtils.__COMMENT_STORE[comment.id],
          numReplies: comment.numReplies
        };
        didStoreUpdate = true;
      }
    });

    if (action === "fetchMore") {
      CommentUtils.__COMMENT_STORE = {
        ...tempStore,
        ...CommentUtils.__COMMENT_STORE
      };
    } else {
      CommentUtils.__COMMENT_STORE = {
        ...CommentUtils.__COMMENT_STORE,
        ...tempStore
      };
    }

    //Delete the document if no update occurs i.e there is no addition or update to the __COMMENT_STORE
    //Since its possible that we have a deletion instead
    if (didStoreUpdate === false) {
      comments.docChanges().forEach(function(change: any) {
        if (change.type === "removed") {
          delete CommentUtils.__COMMENT_STORE[change.doc.id];
        }
      });
    }

    //Use the clientTimestamp field of the first data as a next param for our cursor based pagination
    let firstComment = Object.values(CommentUtils.__COMMENT_STORE)[0];
    let next = (firstComment && firstComment.clientTimestamp) || null;
    CommentUtils.next =
      temp.length === 0 || CommentUtils.next === null ? null : next;
    return {
      comments: Object.values(CommentUtils.__COMMENT_STORE),
      next: CommentUtils.next
    };
  }

  static parseReplies(
    replies: any,
    commentId: string
  ): { replies: IReply[]; next: null | undefined | number } {
    //This function parses and formats the replies
    //__REPLY_STORE is also used to keep track of all the replies that has been loaded thus far on the app. This replies are scoped by comment using the commentId as a key
    //__REPLY_STORE makes it possible to avoid duplication of data if there is a matching reply id
    let temp: any = [];
    let tempStore: any = {};
    let didStoreUpdate: boolean = false;

    if (commentId in CommentUtils.repliesNextCursor === false) {
      CommentUtils.repliesNextCursor[commentId] = undefined;
    }

    replies.forEach((reply: any) => {
      temp.push({
        id: reply.id,
        ...reply.data(),
        metadata: { ...reply.metadata }
      });
    });

    temp.forEach((reply: any) => {
      if (reply.id in (CommentUtils.__REPLY_STORE[commentId] || {}) === false) {
        let seconds =
          (reply.createdAt && reply.createdAt.seconds * 1000) ||
          new Date().getTime();
        tempStore[reply.id] = { ...reply, createdAt: seconds };
        didStoreUpdate = true;
      } else if (
        reply.id in CommentUtils.__REPLY_STORE[commentId] === true &&
        CommentUtils.__REPLY_STORE[commentId][reply.id].text !== reply.text
      ) {
        tempStore[reply.id] = {
          ...CommentUtils.__REPLY_STORE[commentId][reply.id],
          text: reply.text,
          updatedAt: reply.updatedAt || new Date().getTime()
        };
        didStoreUpdate = true;
      }
    });

    CommentUtils.__REPLY_STORE[commentId] = {
      ...CommentUtils.__REPLY_STORE[commentId],
      ...tempStore
    };

    //Delete the document if no update occurs i.e there is no addition or update to the __REPLY_STORE
    //Since its possible that we have a deletion instead
    if (didStoreUpdate === false) {
      replies.docChanges().forEach(function(change: any) {
        if (change.type === "removed") {
          delete CommentUtils.__REPLY_STORE[commentId][change.doc.id];
        }
      });
    }

    //Use the clientTimestamp field of the first data as a next param for our cursor based pagination
    let allReplies =
      (CommentUtils.__REPLY_STORE[commentId] &&
        Object.values(CommentUtils.__REPLY_STORE[commentId])) ||
      [];
    let lastReply = allReplies[allReplies.length - 1];
    let next = (lastReply && lastReply.clientTimestamp) || null;
    CommentUtils.repliesNextCursor[commentId] =
      temp.length === 0 || CommentUtils.repliesNextCursor[commentId] === null
        ? null
        : next;
    return {
      replies: allReplies,
      next: CommentUtils.repliesNextCursor[commentId]
    };
  }
}
