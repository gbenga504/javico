import * as app from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_MEASUREMENT_ID,
};

export default class Firebase {
  auth: any;
  provider: any;

  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.provider = new app.auth.GithubAuthProvider();
  }

  signInWithGithub = (): Promise<any> => {
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
