import React from "react";
import MarkDownRenderer from ".";
import { MuiThemeProvider } from "@material-ui/core";
import { withKnobs, text } from "@storybook/addon-knobs";
import { theme } from "../../design-language/Css";

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
