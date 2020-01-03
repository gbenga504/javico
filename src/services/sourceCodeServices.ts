import Api from '../utils/ApiConnector';

interface IPayload {
  data?: {
    foreignKey: string;
    sourceCode: string;
    readme?: string;
    title: any;
    tags?: Array<string>;
  };
  id?: string;
}

class SourceCodeService {
  codeRef: any;
  Api: any;

  constructor() {
    this.codeRef = Api.firestore.collection('sourceCodes');
  }

  createSourceCode = (payload: IPayload): Promise<any> => {
    const { data } = payload;
    return this.codeRef.add({ ...data, timestamp: Api.firestore.FieldValue.serverTimestamp() });
  };

  deleteSourceCode = (payload: IPayload): Promise<any> => {
    const { id } = payload;
    return this.codeRef.doc(id).delete();
  };

  fetchSourceCode = (payload: IPayload): Promise<any> => {
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
