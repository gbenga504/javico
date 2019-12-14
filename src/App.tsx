import React from 'react';

import Home from './views/Home';
import Firebase, { FirebaseContext } from './utils/FirebaseConnector';

const App: React.FC = () => (
  <FirebaseContext.Provider value={new Firebase()}>
    <Home />
  </FirebaseContext.Provider>
);

export default App;
