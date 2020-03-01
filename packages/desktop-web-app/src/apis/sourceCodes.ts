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

interface Configuration {
  app: any;
}

export class SourceCodeServiceApi {
  private app: any;
  private firestore: any;

  constructor(configuration: Configuration) {
    this.app = configuration.app;
    this.firestore = configuration.app.firestore();
  }

  public saveSourceCode = (payload: IPayload): Promise<any> => {
    const { data, params } = payload;
    if (params && params.ID) {
      return this.firestore
        .collection(`source-codes`)
        .doc(params.ID)
        .set(
          {
            ...data,
            updatedAt: this.app.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
    }
    return this.firestore.collection('source-codes').add({
      ...data,
      createdAt: this.app.firestore.FieldValue.serverTimestamp(),
    });
  };

  public fetchSourceCode = (payload: IPayload): Promise<any> => {
    const { params } = payload;
    const _params = params || ({} as any);
    return this.firestore
      .collection('source-codes')
      .doc(_params.ID)
      .get();
  };
}
