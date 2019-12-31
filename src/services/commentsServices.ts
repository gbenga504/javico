import Api from '../utils/ApiConnector';

interface IPayload {
  data: {
    foreignKey: string;
    comment: string;
    refCode?: string;
    author: any;
    tags?: Array<string>;
  };
}

interface I_Id {
  id: string;
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

  deleteComment = (payload: I_Id): Promise<any> => {
    const { id } = payload;
    return this.commentRef.doc(id).delete();
  };

  fetchComment = (payload: I_Id): Promise<any> => {
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
