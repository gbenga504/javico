import React from "react";
import Terminal from ".";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "@javico/common/lib/design-language/Css";
import { withKnobs, array, select } from "@storybook/addon-knobs";

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
          method: select("method", options, "warn"),
          data: array("data", ["father"])
        }
      ]}
    />
  );
};
