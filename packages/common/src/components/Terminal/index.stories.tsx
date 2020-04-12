import React from "react";
import Terminal from ".";
import { MuiThemeProvider } from "@material-ui/core";
import { withKnobs, array, select } from "@storybook/addon-knobs";
import { theme } from "../../design-language/Css";

export default {
  title: "Terminal",
  decorators: [
    storyFn => <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>,
    withKnobs
  ]
};

const options = {
  Log: "log",
  Warn: "warn",
  Error: "error",
  Info: "info",
  Debug: "debug",
  Time: "time",
  Assert: "assert",
  Count: "count",
  Table: "table"
};

export const warn = () => {
  return (
    <Terminal
      terminalMessages={[
        {
          method: "warn",
          data: array("data", ["father"])
        }
      ]}
    />
  );
};
