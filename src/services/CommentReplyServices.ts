import Api from '../utils/ApiConnector';

interface IPayload {
  data?: {
    commentId: string;
    author: {
      name: string;
      photoURL: string;
    };
    codeReference: string;
    reply: string;
  };
  params: {
    ID: string;
    sourceCodeID: string;
    commentID: string;
    limit: number;
  };
}

export default class CommentReplyService {
  static createReply = (payload: IPayload): Promise<any> => {
    let { params, data } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments/${params.commentID}/replies`)
      .add({ ...data, timestamp: Api.firestore.FieldValue.serverTimestamp() });
  };

  static deleteReply = (payload: IPayload): Promise<any> => {
    let { params } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments/${params.commentID}/replies`)
      .delete();
  };

  static updateReply = (payload: any): Promise<any> => {
    const { params, data } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments/${params.commentID}/replies`)
      .set(data);
  };

  static getAllReplies = (payload: IPayload): Promise<any> => {
    let { params } = payload;
    return Api.firestore
      .collection(`source-codes/${params.sourceCodeID}/comment/${params.commentID}/replies`)
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
      .collection(`source-codes/${params.sourceCodeID}/comments/${params.commentID}/replies`)
      .onSnapshot(handleDataChanged, handleError);
  };
}
