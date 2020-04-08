import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button
} from "@material-ui/core";
import { useStyles } from "@javico/common/lib/design-language/Css";
import { ButtonWithLoading } from "@javico/common/lib/components";

interface IProps {
  visible: boolean;
  onRequestClose: () => void;
  onOk: () => void;
  loading: boolean;
}

const SignInViaGithubModal: React.FC<IProps> = ({
  visible,
  onRequestClose,
  onOk,
  loading
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
        <ButtonWithLoading
          color="primary"
          loading={loading}
          variant="contained"
          onClick={onOk}
          autoFocus
        >
          Sign In
        </ButtonWithLoading>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(SignInViaGithubModal);
