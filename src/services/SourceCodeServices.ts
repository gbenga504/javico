import Api from '../utils/ApiConnector';

interface IPayload {
  data?: {
    ownerId?: string;
    sourceCode?: string;
    readme?: string;
    title?: string;
    tags?: Array<string>;
  };
  params?: {
    ID: string;
  };
}

export default class SourceCodeService {
  static saveSourceCode = (payload: IPayload): Promise<any> => {
    const { data, params } = payload;
    if (params && params.ID) {
      return Api.firestore
        .collection(`source-codes`)
        .doc(params.ID)
        .set(
          { ...data, updatedAt: Api.app.firestore.FieldValue.serverTimestamp() },
          { merge: true },
        );
    }
    return Api.firestore
      .collection('source-codes')
      .add({ ...data, createdAt: Api.app.firestore.FieldValue.serverTimestamp() });
  };

  static fetchSourceCode = (payload: IPayload): Promise<any> => {
    const { params } = payload;
    const _params = params || ({} as any);
    return Api.firestore
      .collection('source-codes')
      .doc(_params.ID)
      .get();
  };
}
