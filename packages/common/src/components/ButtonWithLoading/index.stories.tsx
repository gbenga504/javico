import React from "react";
import ButtonWithLoading from ".";
import { MuiThemeProvider } from "@material-ui/core";

import { theme } from "../../design-language/Css";

export default {
  title: "ButtonWithLoading",
  decorators: [
    storyFn => <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>
  ]
};

export const withoutLoading = () => (
  <ButtonWithLoading loading={false}>Not loading!!!</ButtonWithLoading>
);
export const loading = () => (
  <ButtonWithLoading loading={true}>Loading</ButtonWithLoading>
);
