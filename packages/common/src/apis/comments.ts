interface IPayload {
  data?: {
    sourceCodeId?: string;
    author?: {
      id: string;
      name: string;
      photoURL: string;
    };
    text: string;
    codeReference?: string;
    clientTimestamp?: number;
  };
  params: {
    sourceCodeID: string;
    ID?: string;
    limit?: number;
    after?: any;
  };
}

interface Configuration {
  app: any;
}

export class CommentsServiceApi {
  private app: any;
  private firestore: any;

  constructor(configuration: Configuration) {
    this.app = configuration.app;
    this.firestore = configuration.app.firestore();
  }

  public createComment = (payload: IPayload): Promise<any> => {
    const { data, params } = payload;
    return this.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments`)
      .add({
        ...data,
        numReplies: 0,
        createdAt: this.app.firestore.FieldValue.serverTimestamp(),
        clientTimestamp: Date.now()
      });
  };

  public deleteComment = (payload: IPayload): Promise<any> => {
    const { params } = payload;
    return this.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments`)
      .doc(params.ID)
      .delete();
  };

  public updateComment = (payload: IPayload): Promise<any> => {
    const { data, params } = payload;
    return this.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments`)
      .doc(params.ID)
      .set(
        { ...data, updatedAt: this.app.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
  };

  public fetchMoreComments = (payload: IPayload): Promise<any> => {
    const { params } = payload;
    return this.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments`)
      .orderBy("clientTimestamp", "desc")
      .startAfter(params.after)
      .limit(params.limit || 15)
      .get();
  };

  public onSnapshotChanged = (
    payload: IPayload,
    handleDataChanged: Function,
    handleError: Function
  ) => {
    //This static method returns the comments in descending order during initial load then listens to any addition or updates to the colletion or documents in the collection
    const { params } = payload;
    this.firestore
      .collection(`source-codes/${params.sourceCodeID}/comments`)
      .orderBy("clientTimestamp", "desc")
      .limit(params.limit || 15)
      .onSnapshot(handleDataChanged, handleError);
  };
}
