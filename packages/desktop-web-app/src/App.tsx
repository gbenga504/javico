import React from "react";
import { Provider } from "react-redux";
import {
  MuiThemeProvider,
  StylesProvider,
  createGenerateClassName
} from "@material-ui/core";
import { theme } from "@javico/common/lib/design-language/Css";
import { NotificationProvider } from "@javico/common/lib/components";
import store from "./redux/store";

import AppRoute from "./routes";

const generateClassName = createGenerateClassName({
  productionPrefix: "desktop-web"
});

const App: React.FC = () => {
  return (
    <StylesProvider generateClassName={generateClassName}>
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <NotificationProvider>
            <AppRoute />
          </NotificationProvider>
        </MuiThemeProvider>
      </Provider>
    </StylesProvider>
  );
};

export default React.memo(App);
