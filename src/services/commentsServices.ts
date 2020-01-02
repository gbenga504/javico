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
  params?: {
    ID: string;
  };
}

class CommentService {
  commentRef: any;
  Api: any;

  constructor() {
    this.commentRef = Api.firestore.collection('comments');
  }

  createComment = (payload: IPayload): Promise<any> => {
    const { data } = payload;
    return this.commentRef.add({ ...data, timestamp: Api.firestore.FieldValue.serverTimestamp() });
  };

  deleteComment = (payload: IPayload): Promise<any> => {
    let { params } = payload;
    let _params = params || ({} as any);
    return this.commentRef.doc(_params.ID).delete();
  };

  fetchComment = (payload: IPayload): Promise<any> => {
    let { params } = payload;
    let _params = params || ({} as any);
    return this.commentRef.doc(_params.ID).get();
  };

  updateComment = (payload: IPayload): Promise<any> => {
    let { data, params } = payload;
    let _params = params || ({} as any);
    return this.commentRef.doc(_params.ID).set(data);
  };
}

const commentsServices = new CommentService();
export default commentsServices;
