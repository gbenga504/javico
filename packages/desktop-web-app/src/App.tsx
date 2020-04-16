import React from "react";
import { Provider } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "@javico/common/lib/design-language/Css";
import { NotificationProvider } from "@javico/common/lib/components";
import store from "./redux/store";

import Home from "./views/Home";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <NotificationProvider>
          <Home />
        </NotificationProvider>
      </MuiThemeProvider>
    </Provider>
  );
};

export default React.memo(App);
