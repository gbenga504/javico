import React from 'react';
import { makeStyles } from '@material-ui/core';

import { useStyles as commonUseStyles, padding, color, fontsize } from '../../Css';
import { Typography, Icon } from '../../atoms';
import { image } from './comments_dummy';

const useStyles = makeStyles(theme => ({
  commentRepliesContainer: {
    marginLeft: 40,
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(2, 0),
  },
  commentToggleReplyButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
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
      background: 'rgba(34,37,41,1)',
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
  const commonCss = commonUseStyles();
  const classes = useStyles();

  function renderReplies() {
    return (
      <div className={classes.commentRepliesContainer}>
        <div className={classes.commentToggleReplyButtonContainer}>
          <Icon name="ios-arrow-down" />
          <Typography thickness="semi-bold">View 11 replies</Typography>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${commonCss.flexColumn} ${commonCss.relative}`}
      style={{ ...padding(16, 'lr'), ...padding(10, 'bt') }}>
      <div className={`${classes.comment} ${commonCss.flexRow}`} key={comment._id}>
        <img className={classes.commentUserImage} src={`${image}`} alt={comment.username} />
        <div className={commonCss.flexColumn} style={padding(8, 'l')}>
          <Typography className={classes.commentUsername} thickness="semi-bold" variant="span">
            {comment.username} <Typography className={classes.commentTime}>4.38PM</Typography>
          </Typography>
          <Typography className={classes.commentUserComment} variant="span">
            {comment.comment}
          </Typography>
        </div>
      </div>
      {renderReplies()}
    </div>
  );
};

export default Comment;
