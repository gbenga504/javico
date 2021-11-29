import React, { lazy, Suspense } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

import history from "./history";

export const DesktopPaths = {
  HOME: `/`,
  PROFILE: `/:username`,
  CODE: `/code`,
  EDITOR: `/:username/:codeId`,
  SETTINGS: `/settings`
};

const AppRoute: React.FC = () => {
  const publicRoutes = [
    {
      path: DesktopPaths.HOME,
      exact: true,
      component: lazy(() => import("../views/HomePage"))
    },
    {
      path: DesktopPaths.CODE,
      exact: true,
      component: lazy(() => import("../views/Home"))
    },
    {
      path: DesktopPaths.PROFILE,
      exact: true,
      component: lazy(() => import("../views/Profile"))
    },
    {
      path: DesktopPaths.EDITOR,
      exact: false,
      component: lazy(() => import("../views/Home"))
    }
    // { path: DesktopPaths.SETTINGS, exact: true, component: Settings },
  ];

  return (
    <Suspense fallback={<CircularProgress />}>
      <Router history={history}>
        <Switch>
          {publicRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ))}
        </Switch>
      </Router>
    </Suspense>
  );
};

export default React.memo(AppRoute);
