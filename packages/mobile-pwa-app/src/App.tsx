import React, { useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from '@javico/common/lib/design-language/Css';

import AppBar from './components/AppBar';
import TabNavigator from './components/TabNavigator';
import ReadMe from './views/ReadMe';
import Settings from './views/Settings';
import MenuDrawer from './components/MenuDrawer';

const App: React.FC = () => {
  // const [isSideBarVisible, setIsSideBarVisible] = useState<boolean>(false);
  return (
    <MuiThemeProvider theme={theme}>
      {/* <MenuDrawer onBlur={() => setIsSideBarVisible(false)} isSideBarVisible={isSideBarVisible} /> */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}>
        <AppBar />
        <div style={{ flex: 1 }}>
          <ReadMe />
        </div>
        <TabNavigator />
      </div>
      {/* <Settings /> */}
    </MuiThemeProvider>
  );
};

export default React.memo(App);
