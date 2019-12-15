import React from 'react';

import FirebaseContext from './FirebaseContext';

const withFirebase = (Component: any) => (props: React.Props<any>) => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export default withFirebase;
