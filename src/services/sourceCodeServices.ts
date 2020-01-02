import Api from '../utils/ApiConnector';

interface IPayload {
  data?: {
    ownerId: string;
    sourceCode: string;
    readme?: string;
    title?: string;
    tags?: Array<string>;
  };
  params?: {
    ID: string;
  };
}

class SourceCodeService {
  codeRef: any;
  Api: any;

  constructor() {
    this.codeRef = Api.firestore.collection('source-codes');
  }

  createSourceCode = (payload: IPayload): Promise<any> => {
    const { data } = payload;
    return this.codeRef.add({ ...data, timestamp: Api.firestore.FieldValue.serverTimestamp() });
  };

  deleteSourceCode = (payload: IPayload): Promise<any> => {
    let { params } = payload;
    let _params = params || ({} as any);
    return this.codeRef.doc(_params.ID).delete();
  };

  fetchSourceCode = (payload: IPayload): Promise<any> => {
    let { params } = payload;
    let _params = params || ({} as any);
    return this.codeRef.doc(_params.ID).get();
  };

  updateSourceCode = (payload: IPayload): Promise<any> => {
    let { params, data } = payload;
    let _params = params || ({} as any);
    return this.codeRef.doc(_params.ID).set(data);
  };
}

const sourceCodeService = new SourceCodeService();
export default sourceCodeService;
