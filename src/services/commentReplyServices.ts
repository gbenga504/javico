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
  params?: {
    ID: string;
  };
}

class CommentReplyService {
  replyRef: any;
  Api: any;

  constructor() {
    this.replyRef = Api.firestore.collection('replies');
  }

  createReply = (payload: IPayload): Promise<any> => {
    let { data } = payload;
    return this.replyRef.add({ ...data, timestamp: Api.firestore.FieldValue.serverTimestamp() });
  };

  deleteReply = (payload: IPayload): Promise<any> => {
    let { params } = payload;
    let _params = params || ({} as any);
    return this.replyRef.doc(_params.ID).delete();
  };

  fetchReply = (payload: IPayload): Promise<any> => {
    let { params } = payload;
    let _params = params || ({} as any);
    return this.replyRef.doc(_params.ID).get();
  };

  updateReply = (payload: any): Promise<any> => {
    const { params, data } = payload;
    let _params = params || ({} as any);
    return this.replyRef.doc(_params.ID).set(data);
  };
}

const commentReplyService = new CommentReplyService();
export default commentReplyService;
