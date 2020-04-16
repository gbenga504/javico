import store from "../redux/store";
import { LOGOUT_REQUEST, SET_CURRENT_USER } from "../redux/auth/actionTypes";

interface IUserPayload {
  data?: {
    displayName: string;
    username: string;
    email: string;
    photoURL: string;
    uid: string;
    githubRepoURL: string;
    location: string;
  };
  params?: {
    ID: string;
  };
}

export interface IUser {
  displayName: string;
  username: string;
  email: string;
  photoURL: string;
  uid: string;
  githubRepoURL: string;
  location: string;
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

  private updateUserInBackground = (response: any, ID: string) => {
    let user = {
      displayName: response.user.displayName,
      username: response.additionalUserInfo.username,
      email: response.user.email,
      photoURL: response.user.photoURL,
      uid: response.user.uid,
      githubRepoURL: response.additionalUserInfo.profile.url,
      location: response.additionalUserInfo.profile.location
    };
    this.saveUser({ data: user, params: { ID } });
  };

  private updateUserInStore = (user: IUser) => {
    /**
     * @todo
     * Update user information in the store
     */
    store.dispatch({
      type: SET_CURRENT_USER,
      payload: user
    });
  };

  public signInWithGithub = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.auth
        .signInWithPopup(this.provider)
        .then((response: any) => {
          this.firestore
            .collection("users")
            .where("uid", "==", response.user.uid)
            .get()
            .then((userSnapshot: any) => {
              if (userSnapshot.size === 0) {
                let user: IUser = {
                  displayName: response.user.displayName,
                  username: response.additionalUserInfo.username,
                  email: response.user.email,
                  photoURL: response.user.photoURL,
                  uid: response.user.uid,
                  githubRepoURL: response.additionalUserInfo.profile.url,
                  location: response.additionalUserInfo.profile.location
                };
                this.saveUser({ data: user })
                  .then(() => {
                    this.updateUserInStore(user);
                  })
                  .catch((error: Error) => reject(error));
              } else {
                /**
                 * Save the user information globally via redux and possibly perform a background update with redux and the
                 * online database
                 */
                userSnapshot.forEach((resp: any) => {
                  this.updateUserInBackground(response, resp.id);
                  let user = resp.data();
                  this.updateUserInStore(user);
                  resolve(response);
                });
              }
            })
            .catch((error: Error) => reject(error));
        })
        .catch((error: Error) => reject(error));
    });
  };

  public onAuthStateChanged = (handleUserChanged: Function): any => {
    return this.auth.onAuthStateChanged(handleUserChanged);
  };

  public getCurrentUser = () => {
    return this.auth.currentUser;
  };

  public saveUser = (payload: IUserPayload) => {
    const { data, params } = payload;
    if (params && params.ID) {
      return this.firestore
        .collection("users")
        .doc(params.ID)
        .set(
          {
            ...data,
            updatedAt: this.app.firestore.FieldValue.serverTimestamp()
          },
          { merge: true }
        );
    }
    return this.firestore.collection("users").add({
      ...data,
      createdAt: this.app.firestore.FieldValue.serverTimestamp()
    });
  };

  public fetchUserFromDB = (payload: IUserPayload): Promise<any> => {
    const { params } = payload;
    const _params = params || ({} as any);
    return this.firestore
      .collection("users")
      .where("uid", "==", _params.ID)
      .get()
      .then((userSnapShot: any) => {
        userSnapShot.forEach((resp: any) => {
          let user = resp.data();
          this.updateUserInStore(user);
        });
      });
  };

  public logout = (): Promise<any> => {
    store.dispatch({
      type: LOGOUT_REQUEST
    });
    return this.auth.signOut();
  };
}
