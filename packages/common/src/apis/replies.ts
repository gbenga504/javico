interface IPayload {
  data?: {
    commentId: string;
    author: {
      id: string;
      name: string;
      photoURL: string;
    };
    text: string;
    clientTimestamp?: string;
  };
  params: {
    ID?: string;
    sourceCodeID: string;
    commentID: string;
    limit?: number;
    after?: any;
  };
}

interface Configuration {
  app: any;
}

export class RepliesServiceApi {
  private app: any;
  private firestore: any;

  constructor(configuration: Configuration) {
    this.app = configuration.app;
    this.firestore = configuration.app.firestore();
  }

  public createReply = (payload: IPayload): Promise<any> => {
    const { params, data } = payload;
    const repliesRef = this.firestore
      .collection(
        `source-codes/${params.sourceCodeID}/comments/${params.commentID}/replies`
      )
      .doc();
    const commentRef = this.firestore
      .collection(`source-codes`)
      .doc(params.sourceCodeID)
      .collection("comments")
      .doc(params.commentID);

    return this.firestore.runTransaction((transaction: any) => {
      return transaction.get(commentRef).then((res: any) => {
        if (!res.exists) {
          throw new Error("Document does not exist!");
        }
        const numReplies = res.data().numReplies;
        transaction.update(commentRef, {
          numReplies: numReplies ? numReplies + 1 : 1,
          updatedAt: this.app.firestore.FieldValue.serverTimestamp()
        });
        transaction.set(repliesRef, {
          ...data,
          clientTimestamp: Date.now(),
          createdAt: this.app.firestore.FieldValue.serverTimestamp()
        });
      });
    });
  };

  public deleteReply = (payload: IPayload): Promise<any> => {
    const { params } = payload;
    const replyRef = this.firestore
      .collection(
        `source-codes/${params.sourceCodeID}/comments/${params.commentID}/replies`
      )
      .doc(params.ID);
    const commentRef = this.firestore
      .collection(`source-codes`)
      .doc(params.sourceCodeID)
      .collection("comments")
      .doc(params.commentID);

    return this.firestore.runTransaction((transaction: any) => {
      return transaction.get(commentRef).then((res: any) => {
        if (!res.exists) {
          throw new Error("Document does not exist!");
        }
        const numReplies = res.data().numReplies;
        transaction.update(commentRef, {
          numReplies: numReplies ? numReplies - 1 : 0
        });
        transaction.delete(replyRef);
      });
    });
  };

  public updateReply = (payload: any): Promise<any> => {
    const { params, data } = payload;
    return this.firestore
      .collection(
        `source-codes/${params.sourceCodeID}/comments/${params.commentID}/replies`
      )
      .doc(params.ID)
      .set(
        { ...data, updatedAt: this.app.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
  };

  public fetchMoreReplies = (payload: IPayload): Promise<any> => {
    const { params } = payload;
    return this.firestore
      .collection(
        `source-codes/${params.sourceCodeID}/comments/${params.commentID}/replies`
      )
      .orderBy("clientTimestamp", "asc")
      .startAfter(params.after)
      .limit(params.limit || 10)
      .get();
  };

  public onSnapshotChanged = (
    payload: IPayload,
    handleDataChanged: Function,
    handleError: Function
  ) => {
    //This static method returns the replies in descending order during initial load then listens to any addition or updates to the colletion or documents in the collection
    const { params } = payload;
    this.firestore
      .collection(
        `source-codes/${params.sourceCodeID}/comments/${params.commentID}/replies`
      )
      .orderBy("clientTimestamp", "asc")
      .limit(params.limit || 10)
      .onSnapshot(handleDataChanged, handleError);
  };
}
