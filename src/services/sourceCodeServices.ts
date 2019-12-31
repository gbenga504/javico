import Api from '../utils/ApiConnector';

class SourceCodeService {
  codeRef: any;
  Api: any;

  constructor() {
    this.codeRef = Api.firestore.collection('sourceCodes');
  }

  createSourceCode = (payload: any): Promise<any> => {
    const { data } = payload;
    return this.codeRef.add({ ...data, timestamp: Api.firestore.FieldValue.serverTimestamp() });
  };

  deleteSourceCode = (payload: any): Promise<any> => {
    const { id } = payload;
    return this.codeRef.doc(id).delete();
  };

  fetchSourceCode = (payload: any): Promise<any> => {
    const { id } = payload;
    return this.codeRef.doc(id).get();
  };

  updateSourceCode = (payload: any): Promise<any> => {
    const { data } = payload;
    return this.codeRef.doc(data.id).set(data);
  };
}

const instance = new SourceCodeService();
export default instance;
