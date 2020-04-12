import React, { useState } from "react";
import SignInViaGithubModal from ".";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "../../design-language/Css";

export default {
  title: "SignInViaGithubModal",
  decorators: [
    storyFn => <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>
  ]
};

export const withAndwithoutLoading = () => {
  const [visible, setVisible] = useState(false);
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
      <button onClick={() => setVisible(true)}>
        open github confirm modal
      </button>
      <SignInViaGithubModal
        visible={visible}
        loading={loading}
        onRequestClose={() => setVisible(false)}
        onOk={handleSave}
      />
    </>
  );
};
