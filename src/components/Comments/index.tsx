import React, { useState, useRef } from 'react';
import { TextareaAutosize } from '@material-ui/core';

import { useStyles } from './styles';
import { useStyles as commonUseStyles } from '../../Css';
import { Typography, Icon } from '../../atoms';
import { comments as _comments } from './comments_dummy';
import Comment from './Comment';

const Comments: React.FC<{ comments: any[] }> = ({ comments }) => {
  const [quotedComment, setQuotedComment] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const classes = useStyles();
  const commonCss = commonUseStyles();
  const commentInputRef = useRef<any>(null);

  function handleQuoteComment(comment: string): void {
    setQuotedComment(comment);
    setTimeout(() => commentInputRef.current.focus(), 100);
  }

  function handleCommentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(event.target.value);
  }

  function handleRemoveQuotedComment(event: React.KeyboardEvent) {
    if (event.keyCode === 8 && !!quotedComment === true && comment.length === 0) {
      setQuotedComment('');
    }
  }

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
        <Comment key={comment._id} comment={comment} onHandleReply={handleQuoteComment} />
      ) : (
        renderDateSeperator()
      );
    });
  }

  function renderQuotedComment() {
    return (
      <div className={classes.commentQuotedCommentContainer}>
        <p>{quotedComment}</p>
      </div>
    );
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
        {!!quotedComment === true && renderQuotedComment()}
        <div
          className={`${classes.commentInputFieldContainer} ${
            commonCss.flexRow
          } ${!!quotedComment === true && 'hide-border'}`}>
          <TextareaAutosize
            aria-label="Drop a review"
            className={classes.commentInputField}
            placeholder={!!quotedComment === true ? 'Drop a reply' : 'Drop a review on this code'}
            rowsMax={6}
            rows={1}
            ref={commentInputRef}
            value={comment}
            onChange={handleCommentChange}
            onKeyDown={handleRemoveQuotedComment}
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
