import React from 'react';

import { useStyles } from './styles';
import { useStyles as commonUseStyles, padding } from '../../Css';
import { Typography, Icon } from '../../atoms';
import { image } from './comments_dummy';

const Comments: React.FC<{ comments: any[] }> = ({ comments }) => {
  const classes = useStyles();
  const commonCss = commonUseStyles();

  function renderComments() {
    return comments.map(el => {
      return (
        <div className={classes.comment} key={el._id}>
          <div className={commonCss.flexRow} style={padding(12, 'bt')}>
            <img className={classes.commentUserImage} src={`${image}`} alt={el.username} />
            <div style={padding(8, 'l')}>
              <Typography className={classes.commentUsername} thickness="semi-bold" variant="p">
                {el.username}{' '}
                <Typography className={classes.commentTime}>yesterday at 4.38PM</Typography>
              </Typography>
              <Typography className={classes.commentUserComment} variant="p">
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
