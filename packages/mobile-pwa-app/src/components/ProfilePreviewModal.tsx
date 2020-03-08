import React from 'react';
import {
  Dialog,
  DialogContent as MuiDialogContent,
  makeStyles,
  withStyles,
  ButtonBase,
  Slide,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import {
  Close as CloseIcon,
  WbIncandescent as ThemeIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';
import { useStyles as commonUseStyles, color, fontsize } from '../Css';
import Typography from '../atoms/Typography';

interface IProps {
  isVisible: boolean;
  onRequestClose: () => void;
}

const DialogContent = withStyles(theme => ({
  root: {
    padding: 0,
  },
}))(MuiDialogContent);

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ProfilePreviewModal: React.FC<IProps> = ({ isVisible, onRequestClose }) => {
  const classes = useStyles();
  const commonCss = commonUseStyles();

  function renderAvatar() {
    return <div className={classes.avatarContainer}></div>;
  }

  return (
    <Dialog
      open={isVisible}
      onClose={onRequestClose}
      TransitionComponent={Transition}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogContent>
        <div className={`${classes.addPadding} ${commonCss.flexRow}`}>
          <CloseIcon className={classes.icon} onClick={onRequestClose} />
        </div>
        <div className={`${classes.addPadding} ${commonCss.flexRow}`}>
          {renderAvatar()}
          <div style={{ marginLeft: 8 }} className={commonCss.flexColumn}>
            <Typography thickness="semi-bold" className={classes.text}>
              Gbenga504
            </Typography>
            <Typography className={`${classes.text} ${classes.email}`}>
              daveanifowoshe@gmail.com
            </Typography>
          </div>
        </div>
        <div className={classes.seperator} />
        <ButtonBase className={`${classes.addPadding} ${commonCss.flexRow} ${classes.button}`}>
          <ThemeIcon className={classes.icon} />
          <Typography thickness="semi-bold" className={`${classes.text} ${classes.buttonText}`}>
            Change Theme
          </Typography>
        </ButtonBase>
        <ButtonBase className={`${classes.addPadding} ${commonCss.flexRow} ${classes.button}`}>
          <LogoutIcon className={classes.icon} />
          <Typography thickness="semi-bold" className={`${classes.text} ${classes.buttonText}`}>
            Logout
          </Typography>
        </ButtonBase>
        <div className={classes.seperator} />
        <ButtonBase className={`${classes.addPadding} ${commonCss.flexRow} ${classes.button}`}>
          <SettingsIcon className={classes.icon} />
          <Typography thickness="semi-bold" className={`${classes.text} ${classes.buttonText}`}>
            Settings
          </Typography>
        </ButtonBase>
      </DialogContent>
    </Dialog>
  );
};

const useStyles = makeStyles(theme => ({
  addPadding: {
    padding: theme.spacing(2, 3),
  },
  avatarContainer: {
    background: color.imageBackground,
    width: 30,
    height: 30,
    borderRadius: '50%',
    '& img': {
      width: 'inherit',
      height: 'inherit',
      borderRadius: '50%',
    },
  },
  text: {
    color: `${color.gray60} !important`,
    fontSize: fontsize.xsmall,
  },
  email: {
    fontSize: 10,
    marginTop: 2,
  },
  seperator: {
    borderBottom: `1px solid ${color.gray20}`,
  },
  button: {
    justifyContent: 'flex-start',
    width: '100%',
  },
  buttonText: {
    marginLeft: 15,
  },
  icon: {
    fontSize: fontsize.large,
    color: color.gray60,
  },
}));

export default ProfilePreviewModal;
