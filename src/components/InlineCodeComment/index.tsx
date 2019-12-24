import React, { useState, useRef } from 'react';
import { Paper, Button, Tabs, Tab, withStyles } from '@material-ui/core';

import { useStyles } from './styles';
import { withFirebase } from '../../utils/FirebaseConnector';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';
import userAvatar from '../../assets/images/user.svg';
import { withNotificationBanner, Typography } from '../../atoms';
import { useStyles as commonUseStyles, margin, color, fontsize } from '../../Css';
import MarkdownRenderer from '../MarkDownRenderer';

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

const MuiTabs = withStyles({
  root: {
    minHeight: 0,
  },
  indicator: {
    backgroundColor: color.themeBlue,
    height: 2,
    minWidth: 80,
  },
})(Tabs);

const MuiTab = withStyles({
  root: {
    color: `${color.gray60} !important`,
    padding: 0,
    minHeight: 31,
    minWidth: 80,
    fontSize: `${fontsize.small}px !important`,
    textTransform: 'capitalize !important',
  },
  selected: {
    color: `${color.black} !important`,
  },
} as any)(Tab);

function a11yProps(index: number) {
  return {
    id: `inline-comment-tab-${index}`,
    'aria-controls': `inline-comment-tabpanel-${index}`,
  };
}

const InlineCodeComment: React.FC<IProps> = ({
  user,
  onOpenSignInModal,
  onHideCommentBox,
  mousePosition,
}) => {
  const [comment, setComment] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
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

  function handleTabChange(event: React.ChangeEvent<{}>, currentTab: number) {
    setCurrentTab(currentTab);
  }

  function renderWriteComment() {
    return (
      <>
        <textarea
          onChange={handleChange}
          required={true}
          value={comment}
          autoFocus={true}
          rows={7}
          placeholder="Drop your comment"></textarea>
        <div className="inline-comment__footer">
          <Typography
            variant="a"
            href="https://www.markdownguide.org/basic-syntax/"
            target="_blank"
            className={classes.markdownLink}>
            Markdown is supported
          </Typography>
        </div>
      </>
    );
  }

  function renderPreviewComment() {
    return comment.length === 0 ? (
      <Typography className={classes.nothingToPreview}>Nothing to preview.</Typography>
    ) : (
      <MarkdownRenderer source={comment} linkTarget="_blank" />
    );
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
              ...margin(12, 'r'),
            }}>
            <img
              src={user ? user.photoURL : userAvatar}
              alt="User commenting"
              className={classes.commentUser}
            />
          </div>

          <div className={commonCss.fullWidth}>
            <div className={commonCss.relative}>
              <div className={classes.inlineCommentContainer}>
                <div className="inline-comment__header">
                  <MuiTabs
                    value={currentTab}
                    onChange={handleTabChange}
                    aria-label="inline comment tabs">
                    <MuiTab label="Write" {...a11yProps(0)} />
                    <MuiTab label="Preview" {...a11yProps(1)} />
                  </MuiTabs>
                </div>
                {currentTab === 0 ? renderWriteComment() : renderPreviewComment()}
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
