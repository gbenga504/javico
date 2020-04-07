import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button
} from "@material-ui/core";
import { useStyles } from "@javico/common/lib/design-language/Css";

interface IProps {
  visible: boolean;
  onRequestClose: () => null;
  onOk: () => null;
}

const SignInViaGithubModal: React.FC<IProps> = ({
  visible,
  onRequestClose,
  onOk
}) => {
  const commonCss = useStyles();

  return (
    <Dialog
      open={visible}
      onClose={onRequestClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">SignIn via Github</DialogTitle>
      <DialogContent>
        You need to signin via github to save your code.
      </DialogContent>
      <DialogActions>
        <Button className={commonCss.cancelButton} onClick={onRequestClose}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={onOk} autoFocus>
          Sign In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(SignInViaGithubModal);
