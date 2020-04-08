import React, { useState } from "react";
import EditMessagePanel from ".";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "@javico/common/lib/design-language/Css";

export default {
  title: "EditMessagePanel",
  decorators: [
    storyFn => <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>
  ]
};

export const withAndwithoutLoading = () => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("Click to edit");
  const [loading, setLoading] = useState(false);

  function handleSave() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 1500);
  }

  return (
    <>
      {visible === false && (
        <div style={{ cursor: "pointer" }} onClick={() => setVisible(true)}>
          {value}
        </div>
      )}
      <EditMessagePanel
        visible={visible}
        loading={loading}
        onRequestClose={() => setVisible(false)}
        onOk={handleSave}
        onHandleValueChange={event => setValue(event.target.value)}
        value={value}
      />
    </>
  );
};
