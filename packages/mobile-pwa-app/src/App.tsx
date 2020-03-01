import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';

import { theme } from './Css';
import Editor from './views/Editor';

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Editor />
    </MuiThemeProvider>
  );
};

export default App;
