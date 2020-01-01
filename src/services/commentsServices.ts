import Api from '../utils/ApiConnector';

interface IPayload {
  data?: {
    foreignKey: string;
    author: any;
    comment: string;
    codeRef?: string;
  };
  id?: string;
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
    const { id } = payload;
    return this.commentRef.doc(id).delete();
  };

  fetchComment = (payload: IPayload): Promise<any> => {
    const { id } = payload;
    return this.commentRef.doc(id).get();
  };

  updateComment = (payload: any): Promise<any> => {
    const { data } = payload;
    return this.commentRef.doc(data.id).set(data);
  };
}

const instance = new CommentService();
export default instance;
