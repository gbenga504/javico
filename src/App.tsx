import React from 'react';

import Home from './views/Home';
import Firebase, { FirebaseContext } from './utils/FirebaseConnector';
import { NotificationProvider } from './atoms';

const App: React.FC = () => (
  <FirebaseContext.Provider value={new Firebase()}>
    <NotificationProvider>
      <Home />
    </NotificationProvider>
  </FirebaseContext.Provider>
);

export default App;
