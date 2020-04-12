import React from "react";
import SyntaxHighlighter from ".";
import { MuiThemeProvider } from "@material-ui/core";
import { withKnobs, text } from "@storybook/addon-knobs";
import { theme } from "../../design-language/Css";

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
