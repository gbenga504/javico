import React, { useState } from "react";
import MonacoEditor from ".";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "@javico/common/lib/design-language/Css";

export default {
  title: "MonacoEditor",
  decorators: [
    storyFn => (
      <MuiThemeProvider theme={theme}>
        <div style={{ width: "100vw", height: "100vh" }}>{storyFn()}</div>
      </MuiThemeProvider>
    )
  ]
};

export const editor = () => {
  function handleValueChange(value) {
    console.log("value changed", value);
  }

  function handleSave(value) {
    console.log("saved", value);
  }

  function handleValueHighlight(value, anchorEl) {
    console.log("value", value, "element", anchorEl);
  }

  return (
    <MonacoEditor
      onChangeValue={handleValueChange}
      onHighlightValue={handleValueHighlight}
      onSaveValue={handleSave}
    />
  );
};
