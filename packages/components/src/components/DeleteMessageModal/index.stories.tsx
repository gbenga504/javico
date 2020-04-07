import React, { useState } from "react";
import DeleteMessageModal from ".";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "@javico/common/lib/design-language/Css";

export default {
  title: "DeleteMessageModal",
  decorators: [
    storyFn => <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>
  ]
};

export const withoutLoading = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <button onClick={() => setVisible(true)}>Delete</button>
      <DeleteMessageModal
        visible={visible}
        loading={false}
        onRequestClose={() => setVisible(false)}
        onOk={() => alert(5)}
      />
    </>
  );
};

export const withLoading = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <button onClick={() => setVisible(true)}>Delete</button>
      <DeleteMessageModal
        visible={visible}
        loading={true}
        onRequestClose={() => setVisible(false)}
        onOk={() => alert(5)}
      />
    </>
  );
};
