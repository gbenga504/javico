import Api from '../utils/ApiConnector';

class commentService {
  commentRef: any;
  Api: any;

  constructor() {
    this.commentRef = Api.firestore.collection('comments');
  }

  createComment = (payload: any): Promise<any> => {
    const { data } = payload;
    return this.commentRef.add({ ...data, timestamp: Api.firestore.FieldValue.serverTimestamp() });
  };

  deleteComment = (payload: any): Promise<any> => {
    const { id } = payload;
    return this.commentRef.doc(id).delete();
  };

  fetchComment = (payload: any): Promise<any> => {
    const { id } = payload;
    return this.commentRef.doc(id).get();
  };

  updateComment = (payload: any): Promise<any> => {
    const { data } = payload;
    return this.commentRef.doc(data.id).set(data);
  };
}

const instance = new commentService();
export default instance;
