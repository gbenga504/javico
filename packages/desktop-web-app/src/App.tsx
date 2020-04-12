import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "@javico/common/lib/design-language/Css";
import { NotificationProvider } from "@javico/common/lib/components";

import Home from "./views/Home";

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <NotificationProvider>
        <Home />
      </NotificationProvider>
    </MuiThemeProvider>
  );
};

export default React.memo(App);
