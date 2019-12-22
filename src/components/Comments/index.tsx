import React from 'react';

import { useStyles } from './styles';
import { useStyles as commonUseStyles } from '../../Css';
import { Typography, Icon } from '../../atoms';
import { image } from './comments_dummy';

const Comments: React.FC<{ comments: any[] }> = ({ comments }) => {
  const classes = useStyles();
  const commonCss = commonUseStyles();

  function renderComments() {
    return comments.map(el => {
      return (
        <div className="comment pl-16 pr-16" key={el._id}>
          <div className="pb-12 pt-12 flex-row">
            <img className="comment__user-image" src={`${image}`} alt={el.username} />
            <div className="pl-8">
              <Typography className="comment__username mb-4" thickness="semi-bold" variant="p">
                {el.username} <Typography className="comment__time">yesterday at 4.38PM</Typography>
              </Typography>
              <Typography className="comment__user-comment" variant="p">
                {el.comment}
              </Typography>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <section className={classes.comments}>
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
