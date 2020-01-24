import React, { useState, useRef, useEffect } from 'react';
import { TextareaAutosize } from '@material-ui/core';

import { useStyles } from './styles';
import { useStyles as commonUseStyles } from '../../Css';
import { Typography, Icon } from '../../atoms';
import Comment from './Comment';
import { IComment } from '../../services/CommentsServices';
import ContentLoader from '../../atoms/ContentLoader';

const Comments: React.FC<{ visible: boolean }> = ({ visible }) => {
  const [quotedComment, setQuotedComment] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [comments, setComments] = useState<Array<IComment>>([]);
  const classes = useStyles();
  const commonCss = commonUseStyles();
  const commentInputRef = useRef<any>(null);
  const commentContainerRef = useRef<any>(null);

  useEffect(() => {
    if (visible === true) {
      if (comments.length === 0 && isLoadingComments === false) {
        /**
         * Initialize the load process using the API
         * and set comment loading state to false after success or error
         * also focus last comment after successful load
         */
        setIsLoadingComments(true);
        focusLastComment();
        setComments([]);
      }
      focusCommentInput();
    }
    // eslint-disable-next-line
  }, [visible]);

  useEffect(() => {
    function handleScroll() {
      if (commentContainerRef.current.scrollTop <= 40 && isLoadingComments !== true) {
        /**
         * load more comments
         * and set isLoadingMoreComments = true
         */
        setIsLoadingComments(true);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line
  }, []);

  function focusLastComment() {
    /**
     * @todo
     * This function should also be called when the send button is clicked
     * and when this components mounts and the comments has been fetched
     *
     * Currently we delay this by 500ms
     * Not sure if this is necessary but perfectly works if the main thread is still busy constructing the layout when it is called.
     */
    setTimeout(
      () => (commentContainerRef.current.scrollTop = commentContainerRef.current.scrollHeight),
      500,
    );
  }

  function focusCommentInput() {
    setTimeout(() => commentInputRef.current.focus(), 100);
  }

  function handleQuoteComment(comment: string): void {
    setQuotedComment(comment);
    focusCommentInput();
  }

  function handleCommentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setNewComment(event.target.value);
  }

  function handleRemoveQuotedComment(event: React.KeyboardEvent) {
    if (event.keyCode === 8 && !!quotedComment === true && newComment.length === 0) {
      setQuotedComment('');
    }
  }

  function handleSendComment() {}

  function renderDateSeperator(date: string, id: string) {
    return (
      <>
        <div className={classes.commentDateSeperatorContainer} key={id}>
          <hr className={classes.commentDateSeperatorHr} />
        </div>
        <div className={classes.commentStickyDateContainer} key={`${Number(id) + 1}`}>
          <div>
            <Typography thickness="semi-bold" className={classes.commentDateSeperatorText}>
              {date}
            </Typography>
          </div>
        </div>
      </>
    );
  }

  function renderContentLoaders() {
    return comments.length > 0 ? (
      <ContentLoader />
    ) : (
      Array.apply(null, Array(11)).map((value: any, index: number) => (
        <ContentLoader key={value || index} />
      ))
    );
  }

  function renderComments() {
    return (
      <>
        {isLoadingComments === true && renderContentLoaders()}
        {comments.map(comment => {
          return comment.type !== 'seperator' ? (
            <Comment
              key={comment.id}
              text={comment.text}
              codeReference={comment.codeReference}
              id={comment.id}
              authorName={comment.author.name}
              authorPhotoURL={comment.author.photoURL}
              numReplies={comment.numReplies}
              createdAt={comment.createdAt}
              onHandleReply={handleQuoteComment}
            />
          ) : (
            renderDateSeperator(comment.text, comment.id)
          );
        })}
      </>
    );
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
      <div
        ref={commentContainerRef}
        className={`${commonCss.fullHeightAndWidth} ${classes.commentsBody}`}>
        {renderComments()}
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
            value={newComment}
            onChange={handleCommentChange}
            onKeyDown={handleRemoveQuotedComment}
          />
          <Icon
            className={classes.commentInputSendIcon}
            onClick={handleSendComment}
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
