import React, { useState, useRef } from 'react';
import { withStyles, Paper, Button } from '@material-ui/core';
import { withFirebase } from '../utils/FirebaseConnector';
import { IBannerStyle, IDuration } from '../atoms/NotificationBanner';
import userAvatar from '../assets/images/user.svg';
import { withNotificationBanner } from '../atoms';

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
  setNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
}

const styles = {
  commentBox: {
    position: 'absolute',
    left: 100,
    width: 450,
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
  commentCancelButton: {
    width: 100,
    marginRight: 5,
    fontSize: 13,
    fontFamily: 'Eina SemiBold',
  },
  submitButton: {
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

const InlineCodeComment: React.FC<IProps> = ({
  classes,
  user,
  onOpenSignInModal,
  onHideCommentBox,
  mousePosition,
}) => {
  const [comment, setComment] = useState('');
  const commentRef = useRef<any>(null);

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
    <Paper
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={classes.commentBox}
      style={{
        top: mousePosition.y + 20,
      }}>
      <form ref={commentRef} className="m-12 flex-row">
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
              <input
                type="text"
                onChange={handleChange}
                value={comment}
                placeholder="Drop your comment"
              />
            </div>
          </div>
          <div className="mt-12">
            <Button className={classes.submitButton} onClick={handleSubmitComment}>
              Comment
            </Button>
            <Button className={classes.commentCancelButton} onClick={handleCancelComment}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Paper>
  );
};

export default React.memo(
  withNotificationBanner(withFirebase(withStyles(styles)(InlineCodeComment))),
);
