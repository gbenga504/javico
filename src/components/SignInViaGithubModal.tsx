import React from 'react';
import { Dialog, DialogContent, DialogActions, DialogTitle, Button } from '@material-ui/core';
import { withFirebase } from '../utils/FirebaseConnector';
import { IBannerStyle, IDuration } from '../atoms/NotificationBanner';
import { withNotificationBanner } from '../atoms';
import { useStyles } from '../Css';

interface IProps {
  classes: any;
  visible: boolean;
  onRequestClose: () => null;
  onSignInSuccess: (user: any) => null;
  firebase: any;
  onSetNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
}

const SignInViaGithubModal: React.FC<IProps> = ({
  classes,
  visible,
  onRequestClose,
  firebase,
  onSetNotificationSettings,
  onSignInSuccess,
}) => {
  const commonCss = useStyles();

  function handleSignInWithGithub() {
    firebase
      .signInWithGithub()
      .then(function(result: any) {
        onRequestClose();
        onSignInSuccess(result.user);
      })
      .catch(function(error: any) {
        onSetNotificationSettings(error.message, 'danger', 'long');
      });
  }

  return (
    <Dialog
      open={visible}
      onClose={onRequestClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">SignIn via Github</DialogTitle>
      <DialogContent>You need to signin via github to save your code.</DialogContent>
      <DialogActions>
        <Button className={commonCss.cancelButton} onClick={onRequestClose}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={handleSignInWithGithub} autoFocus>
          Sign In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(withNotificationBanner(withFirebase(SignInViaGithubModal)));
