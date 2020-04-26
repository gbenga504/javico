import React from "react";
import ContentLoader from ".";
import { MuiThemeProvider } from "@material-ui/core";

import { theme } from "../../design-language/Css";

export default {
  title: "ContentLoader",
  decorators: [
    storyFn => <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>
  ]
};

//Bug we want to be able to pass in a different shimColor and contentColor and have it take effect
export const withShim = () => <ContentLoader />;
