import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';

import { theme } from './Css';

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <span>Welcome to the home page</span>
    </MuiThemeProvider>
  );
};

export default App;
