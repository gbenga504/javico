import React from "react";
import DraggableListener from ".";
import { MuiThemeProvider } from "@material-ui/core";

import { theme } from "../../design-language/Css";

export default {
  title: "DraggableListener",
  decorators: [
    storyFn => <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>
  ]
};

export const onlyDraggableOnMobile = () => (
  <DraggableListener isVisible={true} onRequestClose={() => null}>
    Actions
  </DraggableListener>
);
