import React, { useState, useRef } from 'react';
import { Paper, Button } from '@material-ui/core';

import { useStyles } from './styles';
import { withFirebase } from '../../utils/FirebaseConnector';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';
import userAvatar from '../../assets/images/user.svg';
import { withNotificationBanner } from '../../atoms';
import { useStyles as commonUseStyles } from '../../Css';

interface IProps {
  visible: boolean;
  user: any;
  onHideCommentBox: any;
  mousePosition: any;
  onRequestClose: () => null;
  onOpenSignInModal: () => null;
  onSignInSuccess: (user: any) => null;
  firebase: any;
  onSetNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
}

const InlineCodeComment: React.FC<IProps> = ({
  user,
  onOpenSignInModal,
  onHideCommentBox,
  mousePosition,
}) => {
  const [comment, setComment] = useState('');
  const commentRef = useRef<any>(null);
  const commonCss = commonUseStyles();
  const classes = useStyles();

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
    <div className={`${classes.commentBoxContainer} ${commonCss.fullHeightAndWidth}`}>
      <Paper
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.commentBox}
        style={{
          top: mousePosition.y + 20,
        }}>
        <form ref={commentRef} onSubmit={e => e.preventDefault()} className={commonCss.flexRow}>
          <div
            style={{
              borderRadius: '50%',
              margin: '5px 20px 0 10px',
            }}>
            <img
              src={user ? user.photoURL : userAvatar}
              alt="User commenting"
              className={classes.commentUser}
            />
          </div>

          <div className={commonCss.fullWidth}>
            <div className={commonCss.relative}>
              <div className={`${classes.monacoEditorInlineComment} left show`}>
                <textarea
                  onChange={handleChange}
                  required={true}
                  value={comment}
                  autoFocus={true}
                  rows={7}
                  placeholder="Drop your comment"></textarea>
              </div>
            </div>
            <div className={classes.commentButtonContainer}>
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

export default React.memo(withNotificationBanner(withFirebase(InlineCodeComment)));
