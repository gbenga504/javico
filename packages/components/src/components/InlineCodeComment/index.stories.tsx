import React, { useState, useRef } from "react";
import InlineCodeComment from ".";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "@javico/common/lib/design-language/Css";

export default {
  title: "InlineCodeComment",
  decorators: [
    storyFn => <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>
  ]
};

export const inlineCodeComment = () => {
  const buttonRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleSave(comment) {
    alert(`Hi you wrote ${comment}`);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnchorEl(null);
    }, 1500);
  }

  return (
    <>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => setAnchorEl(buttonRef.current)}
        ref={buttonRef}
      >
        Comment on code
      </div>
      <InlineCodeComment
        visible={Boolean(anchorEl)}
        loading={loading}
        anchorEl={buttonRef.current}
        onRequestClose={() => setAnchorEl(null)}
        onOk={handleSave}
      />
    </>
  );
};
