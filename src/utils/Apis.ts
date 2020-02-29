import * as app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { CommentsServiceApi } from '../apis/comments';
import { RepliesServiceApi } from '../apis/replies';
import { UsersServiceApi } from '../apis/users';
import { SourceCodeServiceApi } from '../apis/sourceCodes';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

app.initializeApp(config);

export class Apis {
  private static commentServiceApi: CommentsServiceApi;
  private static repliesServiceApi: RepliesServiceApi;
  private static usersServiceApi: UsersServiceApi;
  private static sourceCodeServiceApi: SourceCodeServiceApi;

  static get comments(): CommentsServiceApi {
    if (!this.commentServiceApi) {
      this.commentServiceApi = new CommentsServiceApi({ app });
    }
    return this.commentServiceApi;
  }

  static get replies(): RepliesServiceApi {
    if (!this.repliesServiceApi) {
      this.repliesServiceApi = new RepliesServiceApi({ app });
    }
    return this.repliesServiceApi;
  }

  static get users(): UsersServiceApi {
    if (!this.usersServiceApi) {
      this.usersServiceApi = new UsersServiceApi({ app });
    }
    return this.usersServiceApi;
  }

  static get sourceCodes(): SourceCodeServiceApi {
    if (!this.sourceCodeServiceApi) {
      this.sourceCodeServiceApi = new SourceCodeServiceApi({ app });
    }
    return this.sourceCodeServiceApi;
  }
}

export interface IComment {
  sourceCodeId: string;
  author: {
    id: string;
    name: string;
    photoURL: string;
  };
  text: string;
  codeReference?: string;
  id: string;
  createdAt: number;
  numReplies: number;
  updatedAt?: string;
  clientTimestamp: number;
}

export interface IReply {
  commentId: string;
  author: {
    name: string;
    photoURL: string;
    id: string;
  };
  text: string;
  id: string;
  createdAt: number;
  updatedAt?: string;
  clientTimestamp?: number;
}
