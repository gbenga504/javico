import React, { useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from '@javico/common/lib/design-language/Css';

import TabNavigator from './components/TabNavigator';
import ReadMe from './views/ReadMe';
import ActionsModal from './components/ActionsModal';
import Editor from './views/Editor';
// import Settings from './views/Settings';
// import MenuDrawer from './components/MenuDrawer';

export type IMenus = 'editor' | 'comment' | 'readme' | 'action';

const App: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<IMenus>('editor');
  const [isActionsModalVisible, setIsActionsModalVisible] = useState<boolean>(false);

  function handleToggleActionsModal() {
    setIsActionsModalVisible(prevState => !prevState);
  }

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
        <div style={{ flex: 1 }}>
          {activeMenu === 'readme' && <ReadMe />}
          {activeMenu === 'editor' && <Editor />}
        </div>
        <TabNavigator
          activeMenu={activeMenu}
          onSetActiveMenu={setActiveMenu}
          onHandleToggleActionsModal={handleToggleActionsModal}
        />
      </div>
      {/* <Settings /> */}
      <ActionsModal onRequestClose={handleToggleActionsModal} isVisible={isActionsModalVisible} />
    </MuiThemeProvider>
  );
};

export default React.memo(App);
