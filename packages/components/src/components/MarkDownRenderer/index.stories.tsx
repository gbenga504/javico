import React from "react";
import MarkDownRenderer from ".";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "@javico/common/lib/design-language/Css";
import { withKnobs, text } from "@storybook/addon-knobs";

export default {
  title: "MarkDownRenderer",
  decorators: [
    storyFn => <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>,
    withKnobs
  ]
};

export const renderer = () => {
  return (
    <MarkDownRenderer
      source={text("source", "## This is an header")}
      linkTarget="_blank"
    />
  );
};
