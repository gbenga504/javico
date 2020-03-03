import React, { useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core';

import { theme } from './Css';
import Editor from './views/Editor';
import MenuDrawer from './components/MenuDrawer';

const App: React.FC = () => {
  const [isSideBarVisible, setIsSideBarVisible] = useState<boolean>(false);
  return (
    <MuiThemeProvider theme={theme}>
      <MenuDrawer onBlur={() => setIsSideBarVisible(false)} isSideBarVisible={isSideBarVisible} />
      <Editor setIsSideBarVisible={() => setIsSideBarVisible(true)} />
    </MuiThemeProvider>
  );
};

export default App;
