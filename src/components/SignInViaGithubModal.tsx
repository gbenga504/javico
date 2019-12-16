import React from 'react';
import {
  withStyles,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
} from '@material-ui/core';
import { withFirebase } from '../utils/FirebaseConnector';
import { IBannerStyle, IDuration } from '../atoms/NotificationBanner';
import { withNotificationBanner } from '../atoms';

interface IProps {
  classes: any;
  visible: boolean;
  onRequestClose: () => null;
  onSignInSuccess: (user: any) => null;
  firebase: any;
  setNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
}

const styles = {
  signInDialog: {
    width: 600,
  },
  signInDialogTitle: {
    marginBottom: '5px',
    padding: '15px 24px',
    borderBottom: '1px solid #e0e0e0',
    '& span': {
      fontSize: 14,
      fontFamily: 'Eina SemiBold',
    },
  },
  signInDialogContent: {
    fontSize: 15,
  },
  signInCancelButton: {
    width: 100,
    marginRight: 5,
    fontSize: 13,
    fontFamily: 'Eina SemiBold',
  },
  signInWithGithubModalButton: {
    background: '#0076c6',
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Eina SemiBold',
    width: 100,
    '&:hover': {
      background: '#0076c6',
    },
  },
} as any;

const SignInViaGithubModal: React.FC<IProps> = ({
  classes,
  visible,
  onRequestClose,
  firebase,
  setNotificationSettings,
  onSignInSuccess,
}) => {
  function handleSignInWithGithub() {
    firebase
      .signInWithGithub()
      .then(function(result: any) {
        onRequestClose();
        onSignInSuccess(result.user);
      })
      .catch(function(error: any) {
        setNotificationSettings(error.message, 'danger', 'long');
      });
  }

  return (
    <Dialog
      open={visible}
      onClose={onRequestClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      classes={{ paper: classes.signInDialog }}>
      <DialogTitle id="alert-dialog-title" className={classes.signInDialogTitle}>
        SignIn via Github
      </DialogTitle>
      <DialogContent classes={{ root: classes.signInDialogContent }}>
        You need to signin via github to save your code.
      </DialogContent>
      <DialogActions>
        <Button className={classes.signInCancelButton} onClick={onRequestClose}>
          Cancel
        </Button>
        <Button
          className={classes.signInWithGithubModalButton}
          onClick={handleSignInWithGithub}
          autoFocus>
          Sign In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(
  withNotificationBanner(withFirebase(withStyles(styles)(SignInViaGithubModal))),
);
