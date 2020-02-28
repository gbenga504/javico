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

export class UsersServiceApi {
  private app: any;
  private firestore: any;
  private auth: any;
  private provider: any;

  constructor(configuration: Configuration) {
    this.app = configuration.app;
    this.auth = configuration.app.auth();
    this.firestore = configuration.app.firestore();
    this.provider = new configuration.app.auth.GithubAuthProvider();
  }

  public signInWithGithub = (): Promise<any> => {
    return this.auth.signInWithPopup(this.provider);
  };

  onAuthStateChanged = (handleUserChanged: Function): any => {
    return this.auth.onAuthStateChanged(handleUserChanged);
  };

  getCurrentUser = () => {
    return this.auth.currentUser;
  };

  logout = (): Promise<any> => {
    return this.auth.signOut();
  };
}
