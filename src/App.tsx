import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';

import Home from './views/Home';
import Api, { ApiContext } from './utils/ApiConnector';
import { NotificationProvider } from './atoms';
import { theme } from './Css';

const App: React.FC = () => (
  <ApiContext.Provider value={new Api()}>
    <MuiThemeProvider theme={theme}>
      <NotificationProvider>
        <Home />
      </NotificationProvider>
    </MuiThemeProvider>
  </ApiContext.Provider>
);

export default App;
