import Api from '../utils/ApiConnector';

interface IPayload {
  data?: {
    sourceCodeId?: string;
    author?: {
      id: string;
      name: string;
      photoURL: string;
    };
    text: string;
    codeReference?: string;
    clientTimestamp?: string;
  };
  params: {
    sourceCodeID: string;
    ID?: string;
    limit?: number;
    after?: any;
  };
}

export interface IComment {
  sourceCodeId: string;
  author: {
    id: string;
    name: string;
    photoURL: string;
  };
  text: string;
  codeReference?: string;
  type: 'comment' | 'seperator';
  id: string;
  createdAt: number;
  numReplies: number;
  updatedAt?: string;
  clientTimestamp: number;
}

export default class CommentService {
  static createComment = (payload: IPayload): Promise<any> => {
    const { data, params } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments`)
      .add({
        ...data,
        numReplies: 0,
        createdAt: Api.app.firestore.FieldValue.serverTimestamp(),
        clientTimestamp: Date.now(),
      });
  };

  static deleteComment = (payload: IPayload): Promise<any> => {
    const { params } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments`)
      .doc(params.ID)
      .delete();
  };

  static updateComment = (payload: IPayload): Promise<any> => {
    const { data, params } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments`)
      .doc(params.ID)
      .set({ ...data, updatedAt: Api.app.firestore.FieldValue.serverTimestamp() }, { merge: true });
  };

  static fetchMoreComments = (payload: IPayload): Promise<any> => {
    const { params } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments`)
      .orderBy('clientTimestamp', 'desc')
      .startAfter(params.after)
      .limit(params.limit || 15)
      .get();
  };

  static onSnapshotChanged = (
    payload: IPayload,
    handleDataChanged: Function,
    handleError: Function,
  ) => {
    //This static method returns the comments in descending order during initial load then listens to any addition or updates to the colletion or documents in the collection
    const { params } = payload;
    Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments`)
      .orderBy('clientTimestamp', 'desc')
      .limit(params.limit || 15)
      .onSnapshot(handleDataChanged, handleError);
  };
}
