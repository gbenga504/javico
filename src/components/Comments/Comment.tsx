import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';

import { useStyles as commonUseStyles, padding, color, fontsize } from '../../Css';
import { Typography, Icon } from '../../atoms';
import { image } from './comments_dummy';

const useStyles = makeStyles(theme => ({
  commentRepliesContainer: {
    marginLeft: 40,
    display: 'flex',
    flexDirection: 'column',
  },
  commentReplyActionButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginTop: theme.spacing(2),
    '& ion-icon': {
      color: color.themeBlue,
      fontSize: 16,
    },
    '& span': {
      color: `${color.themeBlue} !important`,
      marginLeft: 10,
      fontSize: fontsize.small,
    },
  },
  comment: {
    backgroundColor: 'inherit',
    transition: 'all 0.3s',
    cursor: 'pointer',
    '&:hover': {
      background: '#222529',
    },
  },
  commentUserImage: {
    height: 35,
    width: 35,
    borderRadius: 5,
  },
  commentUsername: {
    cursor: 'pointer',
    display: 'inline-block',
    margin: theme.spacing(0, 0, 1),
    fontSize: fontsize.small,
  },
  commentTime: {
    fontSize: fontsize.xsmall,
    color: `#ABABAD !important`,
  },
  commentUserComment: {
    fontSize: fontsize.small,
  },
}));

const Comment: React.FC<any> = ({ comment }) => {
  const [isRepliesVisible, setIsRepliesVisible] = useState<boolean>(false);
  const commonCss = commonUseStyles();
  const classes = useStyles();

  function handleToggleRepliesVisibility() {
    setIsRepliesVisible(prevIsRepliesVisible => !prevIsRepliesVisible);
  }

  function showMoreRepliesButton() {
    return null;
    // <div className={classes.commentReplyActionButtonContainer}>
    //     <Icon name="ios-return-right" />
    //     <Typography thickness="semi-bold">Show more replies</Typography>
    // </div>
  }

  function renderCommentUI(comment: any, avatarStyle?: any, containerStyle?: any) {
    return (
      <div
        className={`${classes.comment} ${commonCss.flexRow}`}
        key={comment._id}
        style={containerStyle}>
        <img
          className={classes.commentUserImage}
          src={`${image}`}
          alt={comment.username}
          style={avatarStyle}
        />
        <div className={commonCss.flexColumn} style={padding(8, 'l')}>
          <Typography className={classes.commentUsername} thickness="bold" variant="span">
            {comment.username} <Typography className={classes.commentTime}>4.38PM</Typography>
          </Typography>
          <Typography className={classes.commentUserComment} variant="span">
            {comment.comment}
          </Typography>
        </div>
      </div>
    );
  }

  function renderReplies(replies: any) {
    return (
      <div className={classes.commentRepliesContainer}>
        <div
          onClick={handleToggleRepliesVisibility}
          className={classes.commentReplyActionButtonContainer}>
          <Icon name="ios-arrow-down" />
          <Typography thickness="semi-bold">
            {isRepliesVisible === true ? 'Hide' : 'View'} 11 replies
          </Typography>
        </div>
        {isRepliesVisible === true &&
          replies.map((reply: any) => {
            return renderCommentUI(reply, { width: 24, height: 24 }, { marginTop: 10 });
          })}
        {showMoreRepliesButton()}
        {/* <CircularProgress color="primary" size={20} /> */}
      </div>
    );
  }

  return (
    <div
      className={`${commonCss.flexColumn} ${commonCss.relative}`}
      style={{ ...padding(16, 'lr'), ...padding(10, 'bt') }}>
      {renderCommentUI(comment)}
      {comment.replies && comment.replies.length > 0 && renderReplies(comment.replies)}
    </div>
  );
};

export default Comment;
