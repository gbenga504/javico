interface IPayload {
  data?: {
    ownerId?: string;
    sourceCode?: string;
    readme?: string;
    title?: string;
    tags?: Array<string>;
    timestamp?: number;
    photoURL?: string;
    username?: string;
  };
  params?: {
    ID?: string;
    ownerId?: string;
    limit?: number;
    after?: any;
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
            updatedAt: this.app.firestore.FieldValue.serverTimestamp()
          },
          { merge: true }
        );
    }
    return this.firestore.collection("source-codes").add({
      ...data,
      createdAt: this.app.firestore.FieldValue.serverTimestamp()
    });
  };

  public fetchSourceCode = (payload: IPayload): Promise<any> => {
    const { params } = payload;
    const _params = params || ({} as any);
    return this.firestore
      .collection("source-codes")
      .doc(_params.ID)
      .get();
  };

  public fetchUserSourceCodes = (payload: IPayload): Promise<any> => {
    const { params } = payload;
    const _params = params || ({} as any);
    return this.firestore
      .collection("source-codes")
      .where("ownerId", "==", _params.ownerId)
      .orderBy("clientTimestamp", "desc")
      .startAfter(_params.after)
      .limit(_params.limit || 12)
      .get();
  };

  public initialUserSourceCodesFetch = (
    payload: IPayload,
    handleDataChanged: Function,
    handleError: Function
  ) => {
    //This static method returns the comments in descending order during initial load then listens to any addition or updates to the colletion or documents in the collection
    const { params } = payload;
    const _params = params || ({} as any);
    this.firestore
      .collection(`source-codes`)
      .where("ownerId", "==", _params.ownerId)
      .limit(12)
      .onSnapshot(handleDataChanged, handleError);
  };
}
