import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  makeStyles
} from "@material-ui/core";
import { ButtonWithLoading } from "../atoms";
import { useStyles as commonUseStyles } from "../Css";

interface IProps {
  visible: boolean;
  loading: boolean;
  onRequestClose: () => void;
  onDeleteMessage: () => void;
}

const DeleteMessageModal: React.FC<IProps> = ({
  visible,
  onRequestClose,
  onDeleteMessage,
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
          onClick={onDeleteMessage}
        >
          Delete
        </ButtonWithLoading>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles(theme => ({
  button: {
    background: "#E01E5A",
    "&:hover": {
      background: "#E22F67"
    }
  }
}));

export default React.memo(DeleteMessageModal);
