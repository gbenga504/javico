import React from "react";
import Typography from ".";
import { MuiThemeProvider } from "@material-ui/core";

import { theme } from "../../design-language/Css";

export default {
  title: "Typography",
  decorators: [
    storyFn => <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>
  ]
};

export const h1 = () => (
  <Typography variant="h1" color="error">
    This is a large header
  </Typography>
);
export const span = () => (
  <Typography variant="span" color="green" thickness="light">
    Light green text
  </Typography>
);
