import React, { useState } from 'react';
import { Router, Switch, Redirect, Route } from 'react-router-dom';

import Editor from './views/Editor';
import Comment from './views/Comment';
import ReadMe from './views/ReadMe';
import Settings from './views/Settings';
import history from './history';
import TabNavigator from './components/TabNavigator';
import ActionsModal from './components/ActionsModal';

export const Paths = {
  EDITOR: `/editor`,
  COMMENT: `/comment`,
  README: `/readme`,
  SETTINGS: `/settings`,
};

const publicRoutes = [
  { path: Paths.EDITOR, exact: false, component: Editor },
  { path: Paths.COMMENT, exact: true, component: Comment },
  { path: Paths.README, exact: true, component: ReadMe },
  { path: Paths.SETTINGS, exact: true, component: Settings },
];

const Routes = () => {
  const [isActionsModalVisible, setIsActionsModalVisible] = useState<boolean>(false);

  function handleToggleActionsModal() {
    setIsActionsModalVisible(prevState => !prevState);
  }

  return (
    <Router history={history}>
      <div style={{ flex: 1 }}>
        <Switch>
          {publicRoutes.map((route, index) => (
            <Route key={index} path={route.path} exact={route.exact} component={route.component} />
          ))}
          <Redirect to={Paths.EDITOR} />
        </Switch>
      </div>
      <TabNavigator onToggleActionsModal={handleToggleActionsModal} />
      <ActionsModal onRequestClose={handleToggleActionsModal} isVisible={isActionsModalVisible} />
    </Router>
  );
};

export default React.memo(Routes);
