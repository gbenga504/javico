import Api from '../utils/ApiConnector';

interface IPayload {
  data?: {
    sourceCodeId: string;
    author: {
      name: string;
      photoURL: string;
    };
    comment: string;
    codeReference?: string;
  };
  params: {
    sourceCodeID: string;
    ID?: string;
    limit?: number;
    after?: any;
  };
}

export default class CommentService {
  static createComment = (payload: IPayload): Promise<any> => {
    const { data, params } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments`)
      .add({ ...data, createdAt: Api.app.firestore.FieldValue.serverTimestamp() });
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
      .orderBy('createdAt', 'desc')
      .startAfter(params.after)
      .limit(params.limit)
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
      .orderBy('createdAt', 'desc')
      .limit(params.limit)
      .onSnapshot(handleDataChanged, handleError);
  };
}
