/**
 * @classdesc This service enhances the Api to carry out reply based operations
 */
import Api from '../utils/ApiConnector';

interface IPayload {
  data?: {
    commentId: string;
    author: {
      id: string;
      name: string;
      photoURL: string;
    };
    text: string;
    clientTimestamp?: string;
  };
  params: {
    ID?: string;
    sourceCodeID: string;
    commentID: string;
    limit?: number;
    after?: any;
  };
}

export interface IReply {
  commentId: string;
  author: {
    name: string;
    photoURL: string;
  };
  text: string;
  id: string;
  createdAt: number;
  updatedAt?: string;
  clientTimestamp?: number;
}

export default class CommentReplyService {
  static createReply = (payload: IPayload): Promise<any> => {
    const { params, data } = payload;
    const repliesRef = Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments/${params.commentID}/replies`)
      .doc();
    const commentRef = Api.firestore
      .collection(`source-codes`)
      .doc(params.sourceCodeID)
      .collection('comments')
      .doc(params.commentID);

    return Api.firestore.runTransaction((transaction: any) => {
      return transaction.get(commentRef).then((res: any) => {
        if (!res.exists) {
          throw new Error('Document does not exist!');
        }
        const numReplies = res.data().numReplies;
        transaction.update(commentRef, {
          numReplies: numReplies ? numReplies + 1 : 1,
          updatedAt: Api.app.firestore.FieldValue.serverTimestamp(),
        });
        transaction.set(repliesRef, {
          ...data,
          clientTimestamp: Date.now(),
          createdAt: Api.app.firestore.FieldValue.serverTimestamp(),
        });
      });
    });
  };

  static deleteReply = (payload: IPayload): Promise<any> => {
    const { params } = payload;
    const replyRef = Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments/${params.commentID}/replies`)
      .doc(params.ID);
    const commentRef = Api.firestore
      .collection(`source-codes`)
      .doc(params.sourceCodeID)
      .collection('comments')
      .doc(params.commentID);

    return Api.firestore.runTransaction((transaction: any) => {
      return transaction.get(commentRef).then((res: any) => {
        if (!res.exists) {
          throw new Error('Document does not exist!');
        }
        const numReplies = res.data().numReplies;
        transaction.update(commentRef, {
          numReplies: numReplies ? numReplies - 1 : 0,
        });
        transaction.delete(replyRef);
      });
    });
  };

  static updateReply = (payload: any): Promise<any> => {
    const { params, data } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments/${params.commentID}/replies`)
      .doc(params.ID)
      .set({ ...data, updatedAt: Api.app.firestore.FieldValue.serverTimestamp() }, { merge: true });
  };

  static fetchMoreReply = (payload: IPayload): Promise<any> => {
    const { params } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comment/${params.commentID}/replies`)
      .orderBy('clientTimestamp', 'desc')
      .startAfter(params.after)
      .limit(params.limit || 10)
      .get();
  };

  static onSnapshotChanged = (
    payload: IPayload,
    handleDataChanged: Function,
    handleError: Function,
  ) => {
    //This static method returns the replies in descending order during initial load then listens to any addition or updates to the colletion or documents in the collection
    const { params } = payload;
    Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments/${params.commentID}/replies`)
      .orderBy('clientTimestamp', 'desc')
      .limit(params.limit || 10)
      .onSnapshot(handleDataChanged, handleError);
  };
}
