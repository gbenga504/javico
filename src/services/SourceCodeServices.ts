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

export default class SourceCodeService {
  static createSourceCode = (payload: IPayload): Promise<any> => {
    const { data } = payload;
    return Api.firestore
      .collection('source-codes')
      .add({ ...data, timestamp: Api.firestore.FieldValue.serverTimestamp() });
  };

  static fetchSourceCode = (payload: IPayload): Promise<any> => {
    let { params } = payload;
    let _params = params || ({} as any);
    return Api.firestore
      .collection('source-codes')
      .doc(_params.ID)
      .get();
  };

  static updateSourceCode = (payload: IPayload): Promise<any> => {
    let { params, data } = payload;
    let _params = params || ({} as any);
    return Api.firestore
      .collection('source-codes')
      .doc(_params.ID)
      .set(data);
  };
}
