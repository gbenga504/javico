import React, { useState, useRef } from 'react';
import { withStyles, Paper, Button } from '@material-ui/core';

import { withFirebase } from '../utils/FirebaseConnector';
import { IBannerStyle, IDuration } from '../atoms/NotificationBanner';
import userAvatar from '../assets/images/user.svg';
import { withNotificationBanner } from '../atoms';
import { useStyles, fonts, fontsize } from '../Css';

interface IProps {
  classes: any;
  visible: boolean;
  displayComment: boolean;
  user: any;
  onHideCommentBox: any;
  mousePosition: any;
  onRequestClose: () => null;
  onOpenSignInModal: () => null;
  onSignInSuccess: (user: any) => null;
  firebase: any;
  onSetNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
}

const styles = {
  commentBoxContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    background: 'transparent',
    zIndex: 2,
    top: 0,
  },
  commentBox: {
    position: 'absolute',
    left: 60,
    width: 'calc(100% - 160px)',
    backgroundColor: '#f7f7f7',
  },
  commentUser: {
    height: 40,
    width: 40,
    borderRadius: '50%',
    border: '2px solid #074e68',
  },
  commentDialogContent: {
    fontSize: 15,
  },
  commentButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
} as any;

const InlineCodeComment: React.FC<IProps> = ({
  classes,
  user,
  onOpenSignInModal,
  onHideCommentBox,
  mousePosition,
}) => {
  const [comment, setComment] = useState('');
  const commentRef = useRef<any>(null);
  const commonCss = useStyles();

  function handleChange(e: any) {
    setComment(e.target.value);
  }

  function handleSubmitComment(e: any) {
    e.preventDefault();
    if (!commentRef.current.reportValidity()) {
      return;
    }
    if (!user) {
      onOpenSignInModal();
    }
  }

  function handleCancelComment(e: any) {
    setComment('');
    onHideCommentBox();
  }

  return (
    <div className={classes.commentBoxContainer}>
      <Paper
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.commentBox}
        style={{
          top: mousePosition.y + 20,
        }}>
        <form ref={commentRef} onSubmit={e => e.preventDefault()} className="m-12 flex-row">
          <div
            style={{
              borderRadius: '50%',
              margin: '5px 20px 0 10px',
            }}>
            <img
              src={user ? user.photoURL : userAvatar}
              alt="User commenting"
              className=""
              style={styles.commentUser}
            />
          </div>

          <div className="full-width">
            <div className="relative">
              <div className="monaco-editor__inline-comment left show">
                <textarea
                  onChange={handleChange}
                  required={true}
                  value={comment}
                  autoFocus={true}
                  rows={7}
                  style={{
                    width: '100%',
                    border: 0,
                    fontFamily: fonts.regular,
                    padding: 5,
                    fontSize: fontsize.base,
                  }}
                  placeholder="Drop your comment"></textarea>
              </div>
            </div>
            <div className={`${classes.commentButtonContainer} mt-12`}>
              <Button className={commonCss.cancelButton} onClick={handleCancelComment}>
                Cancel
              </Button>
              <Button color="primary" variant="contained" onClick={handleSubmitComment}>
                Comment
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default React.memo(
  withNotificationBanner(withFirebase(withStyles(styles)(InlineCodeComment))),
);
