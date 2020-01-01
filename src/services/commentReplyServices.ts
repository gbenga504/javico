import Api from '../utils/ApiConnector';

class CommentReplyService {
  replyRef: any;
  Api: any;

  constructor() {
    this.replyRef = Api.firestore.collection('replies');
  }

  createReply = (payload: any): Promise<any> => {
    const { data } = payload;
    return this.replyRef.add({ ...data, timestamp: Api.firestore.FieldValue.serverTimestamp() });
  };

  deleteReply = (payload: any): Promise<any> => {
    const { id } = payload;
    return this.replyRef.doc(id).delete();
  };

  fetchReply = (payload: any): Promise<any> => {
    const { id } = payload;
    return this.replyRef.doc(id).get();
  };

  updateReply = (payload: any): Promise<any> => {
    const { data } = payload;
    return this.replyRef.doc(data.id).set(data);
  };
}

const instance = new CommentReplyService();
export default instance;
