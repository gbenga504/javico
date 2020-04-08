import React from "react";
import SyntaxHighlighter from ".";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "@javico/common/lib/design-language/Css";
import { withKnobs, text } from "@storybook/addon-knobs";

export default {
  title: "SyntaxHighlighter",
  decorators: [
    storyFn => <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>,
    withKnobs
  ]
};

export const highlighter = () => {
  return (
    <SyntaxHighlighter
      sourceCode={text("source", "function gad(){ console.log(5)}")}
    />
  );
};
