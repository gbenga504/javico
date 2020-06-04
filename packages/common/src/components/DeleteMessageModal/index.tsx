import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  makeStyles
} from "@material-ui/core";

import ButtonWithLoading from "../ButtonWithLoading";
import { useStyles as commonUseStyles } from "../../design-language/Css";

interface IProps {
  visible: boolean;
  loading: boolean;
  onRequestClose: () => void;
  onOk: () => void;
}

const DeleteMessageModal: React.FC<IProps> = ({
  visible,
  onRequestClose,
  onOk,
  loading
}) => {
  const commonCss = commonUseStyles();
  const classes = useStyles();

  return (
    <Dialog
      open={visible}
      onClose={onRequestClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Message</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this message? This cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button
          className={commonCss.cancelButton}
          onClick={onRequestClose}
          autoFocus
        >
          Cancel
        </Button>
        <ButtonWithLoading
          className={classes.button}
          loading={loading}
          color="primary"
          variant="contained"
          onClick={onOk}
        >
          Delete
        </ButtonWithLoading>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles({
  button: {
    background: "#E01E5A !important",
    "&:hover": {
      background: "#E22F67 !important"
    }
  }
});

export default React.memo(DeleteMessageModal);
