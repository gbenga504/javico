import React, { useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core';

import { theme } from './Css';
import AppBar from './components/AppBar';
import TabNavigator from './components/TabNavigator';
import Editor from './views/Editor';
import MenuDrawer from './components/MenuDrawer';

const App: React.FC = () => {
  // const [isSideBarVisible, setIsSideBarVisible] = useState<boolean>(false);
  return (
    <MuiThemeProvider theme={theme}>
      {/* <MenuDrawer onBlur={() => setIsSideBarVisible(false)} isSideBarVisible={isSideBarVisible} /> */}
      {/* <Editor setIsSideBarVisible={() => setIsSideBarVisible(true)} /> */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}>
        <AppBar />
        <TabNavigator />
      </div>
    </MuiThemeProvider>
  );
};

export default App;
