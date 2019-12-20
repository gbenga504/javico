import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';

import Home from './views/Home';
import Firebase, { FirebaseContext } from './utils/FirebaseConnector';
import { NotificationProvider } from './atoms';
import { theme } from './Css';

const App: React.FC = () => (
  <FirebaseContext.Provider value={new Firebase()}>
    <MuiThemeProvider theme={theme}>
      <NotificationProvider>
        <Home />
      </NotificationProvider>
    </MuiThemeProvider>
  </FirebaseContext.Provider>
);

export default App;
