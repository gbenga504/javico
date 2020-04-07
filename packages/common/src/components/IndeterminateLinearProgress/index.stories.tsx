import React from "react";
import IndeterminateLinearProgress from ".";
import { MuiThemeProvider } from "@material-ui/core";

import { theme } from "../../design-language/Css";

export default {
  title: "IndeterminateLinearProgress",
  decorators: [
    storyFn => <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>
  ]
};

export const loading = () => <IndeterminateLinearProgress isVisible={true} />;
