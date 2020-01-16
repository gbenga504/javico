import React, { useRef, useEffect } from 'react';
import { makeStyles, TextareaAutosize, Button } from '@material-ui/core';

import { color, fontsize, useStyles as commonUseStyles, margin } from '../Css';
import { ButtonWithLoading, Icon } from '../atoms';

interface IProps {
  visible: boolean;
  handleValueChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  onEditMessage: () => void;
  onRequestClose: () => void;
  loading: boolean;
}

const EditMessagePanel: React.FC<IProps> = ({
  visible,
  handleValueChange,
  value,
  onEditMessage,
  onRequestClose,
  loading,
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

  return visible === true ? (
    <>
      <TextareaAutosize
        aria-label="Drop a review"
        className={classes.inputField}
        placeholder="Edit Message"
        rowsMax={6}
        rows={1}
        autoFocus
        ref={messageInputRef}
        value={value}
        onChange={handleValueChange}
      />
      <div className={commonCss.flexRow} style={{ ...margin(4, 't') }}>
        <Button
          className={`${classes.button} ${classes.cancelButton}`}
          variant="outlined"
          onClick={onRequestClose}>
          Cancel
        </Button>
        <ButtonWithLoading
          className={`${classes.button} ${classes.editButton}`}
          loading={loading}
          color="primary"
          variant="contained"
          onClick={onEditMessage}
          startIcon={<Icon name="ios-return-left" />}>
          Save Changes
        </ButtonWithLoading>
      </div>
    </>
  ) : null;
};

const useStyles = makeStyles(theme => ({
  inputField: {
    color: color.white,
    width: '100%',
    border: '1px solid #818385',
    backgroundColor: 'transparent',
    fontSize: fontsize.small + 0.5,
    resize: 'none',
    borderRadius: 3,
    padding: `4px 10px`,
    paddingRight: theme.spacing(1),
    '&:focus': {
      outline: 'none',
      border: `1px solid #1B9BD1`,
    },
  },
  button: {
    fontSize: fontsize.small,
    height: 28,
    minWidth: 56,
    padding: '0 12px 1px',
    width: 'auto',
  },
  cancelButton: {
    border: `1px solid ${color.darkThemeLightBorder}`,
    color: color.white,
  },
  editButton: {
    margin: theme.spacing(0, 2),
    '& ion-icon': {
      fontSize: 18,
    },
  },
}));

export default EditMessagePanel;
