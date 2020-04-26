import React, { useRef, useEffect } from "react";
import { makeStyles, TextareaAutosize, Button } from "@material-ui/core";
import { KeyboardReturn as KeyboardReturnIcon } from "@material-ui/icons";

import {
  color,
  fontsize,
  useStyles as commonUseStyles,
  margin
} from "../../design-language/Css";
import ButtonWithLoading from "../ButtonWithLoading";

interface IProps {
  visible: boolean;
  onHandleValueChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  onOk: () => void;
  onRequestClose: () => void;
  loading: boolean;
  inputClassName?: string;
  cancelButtonClassName?: string;
}

const EditMessagePanel: React.FC<IProps> = ({
  visible,
  onHandleValueChange,
  value,
  onOk,
  onRequestClose,
  loading,
  inputClassName,
  cancelButtonClassName
}) => {
  const messageInputRef = useRef<any>(null);
  const classes = useStyles();
  const commonCss = commonUseStyles();

  useEffect(() => {
    /**
     * @todo
     * Research on if this is necessary. Why do we debounce here; quite explanable based on the way useEffect works
     * however can this be done declaratively?
     */
    visible === true && setTimeout(() => messageInputRef.current.focus(), 500);
  }, [visible]);

  function handleSaveChanges(event: React.KeyboardEvent) {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      onOk();
    }
  }

  return visible === true ? (
    <div className={commonCss.flexColumn} style={{ flex: 1 }}>
      <TextareaAutosize
        aria-label="Drop a review"
        className={`${classes.inputField} ${inputClassName}`}
        placeholder="Edit Message"
        rowsMax={6}
        rows={1}
        autoFocus
        ref={messageInputRef}
        value={value}
        onChange={onHandleValueChange}
        onKeyDown={handleSaveChanges}
      />
      <div className={commonCss.flexRow} style={{ ...margin(4, "t") }}>
        <Button
          className={`${classes.button} ${classes.cancelButton} ${cancelButtonClassName}`}
          variant="outlined"
          onClick={onRequestClose}
        >
          Cancel
        </Button>
        <ButtonWithLoading
          className={`${classes.button} ${classes.editButton}`}
          loading={loading}
          color="primary"
          variant="contained"
          onClick={onOk}
          startIcon={<KeyboardReturnIcon />}
        >
          Save Changes
        </ButtonWithLoading>
      </div>
    </div>
  ) : null;
};

const useStyles = makeStyles(theme => ({
  inputField: {
    border: "1px solid #818385",
    backgroundColor: "transparent",
    fontSize: fontsize.small + 0.5,
    resize: "none",
    borderRadius: 3,
    padding: `4px 10px`,
    paddingRight: theme.spacing(1),
    "&:focus": {
      outline: "none",
      border: `1px solid #1B9BD1`
    }
  },
  button: {
    fontSize: fontsize.small,
    height: 28,
    minWidth: 56,
    padding: "0 12px 1px",
    width: "auto"
  },
  cancelButton: {
    border: `1px solid ${color.darkThemeLightBorder}`
  },
  editButton: {
    margin: theme.spacing(0, 2),
    "& ion-icon": {
      fontSize: 18
    }
  }
}));

export default React.memo(EditMessagePanel);
