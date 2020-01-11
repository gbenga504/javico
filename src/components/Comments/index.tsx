import React from 'react';

import { useStyles } from './styles';
import { useStyles as commonUseStyles, padding } from '../../Css';
import { Typography, Icon } from '../../atoms';
import { image, comments as _comments } from './comments_dummy';

const Comments: React.FC<{ comments: any[] }> = ({ comments }) => {
  const classes = useStyles();
  const commonCss = commonUseStyles();

  function renderDateSeperator() {
    return (
      <>
        <div className={classes.commentDateSeperatorContainer}>
          <hr className={classes.commentDateSeperatorHr} />
        </div>
        <div className={classes.commentStickyDateContainer}>
          <div>
            <Typography thickness="semi-bold" className={classes.commentDateSeperatorText}>
              December 5th, 2019
            </Typography>
          </div>
        </div>
      </>
    );
  }

  function renderComments() {
    return _comments.map(comment => {
      return comment.type !== 'seperator' ? (
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
      ) : (
        renderDateSeperator()
      );
    });
  }

  return (
    <section className={classes.comments}>
      <div className={classes.commentsHeader} />
      <div className={`${commonCss.fullHeightAndWidth} ${classes.commentsBody}`}>
        {process.env.REACT_APP_IS_COMMENT_FEATURE_AVAILABLE === 'true' ? (
          renderComments()
        ) : (
          <div
            className={`${commonCss.flexRow} ${commonCss.center} ${commonCss.fullHeightAndWidth}`}
            style={{ cursor: 'not-allowed' }}>
            <Typography variant="div" thickness="bold" className={classes.commentNotLive}>
              COMMENTS NOT LIVE
            </Typography>
          </div>
        )}
      </div>
      <div className={classes.commentInput}>
        <div className={`${classes.commentInputFieldContainer} ${commonCss.flexRow}`}>
          <input
            className={classes.commentInputField}
            type="text"
            placeholder="Drop a review on this code"
          />
          <Icon
            className={classes.commentInputSendIcon}
            name="send"
            style={{
              cursor:
                process.env.REACT_APP_IS_COMMENT_FEATURE_AVAILABLE === 'true'
                  ? 'pointer'
                  : 'not-allowed',
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Comments;
