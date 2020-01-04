import Api from '../utils/ApiConnector';

interface IPayload {
  data?: {
    author: {
      name: string;
      photoURL: string;
    };
    comment: string;
    codeReference?: string;
  };
  params: {
    sourceCodeID: string;
    ID: string;
    limit: number;
  };
}

export default class CommentService {
  static createComment = (payload: IPayload): Promise<any> => {
    let { data, params } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments`)
      .add({ ...data, timestamp: Api.firestore.FieldValue.serverTimestamp() });
  };

  static deleteComment = (payload: IPayload): Promise<any> => {
    let { params } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments/${params.ID}`)
      .delete();
  };

  static updateComment = (payload: IPayload): Promise<any> => {
    let { data, params } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments/${params.ID}`)
      .set(data);
  };

  static getAllComments = (payload: IPayload): Promise<any> => {
    let { params } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments`)
      .get()
      .limit(params.limit);
  };

  static onSnapshotChanged = (
    payload: IPayload,
    handleDataChanged: Function,
    handleError: Function,
  ) => {
    let { params } = payload;
    Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments`)
      .onSnapshot(handleDataChanged, handleError);
  };
}
