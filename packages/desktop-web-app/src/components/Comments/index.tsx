import React, { useState, useRef, useEffect } from 'react';
import { TextareaAutosize } from '@material-ui/core';
import { Send as SendIcon } from '@material-ui/icons';
import { useSelector } from 'react-redux'

import { useStyles } from './styles';
import { useStyles as commonUseStyles } from '../../Css';
import { Typography, withNotificationBanner } from '../../atoms';
import Comment from './Comment';
import { Apis, IComment } from '../../utils/Apis';
import ContentLoader from '../../atoms/ContentLoader';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';
import CommentUtils from '../../utils/CommentUtils';
import { getReadableDate } from '../../utils/TimeUtils';
import { getCurrentUserState } from '../../redux/auth/reducers';

interface IProps {
  visible: boolean;
  onSetNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
  sourceCodeId: string;
}

const Comments: React.FC<IProps> = ({ visible, onSetNotificationSettings, sourceCodeId }) => {
  const [quotedComment, setQuotedComment] = useState<string>('');
  const [idOfQuotedComment, setIdOfQuotedComment] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<null | undefined | number>(null);
  const [comments, setComments] = useState<Array<IComment>>([]);
  const user = useSelector(getCurrentUserState);
  const classes = useStyles();
  const commonCss = commonUseStyles();
  const commentInputRef = useRef<any>(null);
  const commentContainerRef = useRef<any>(null);

  useEffect(() => {
    if (visible === true) {
      if (comments.length === 0 && isLoadingComments === false && !!sourceCodeId === true) {
        /**
         * Initialize the load process using the API
         * and set comment loading state to false after success or error
         * also focus last comment after successful load
         */
        setIsLoadingComments(true);
        Apis.comments.onSnapshotChanged(
          { params: { sourceCodeID: sourceCodeId, limit: 15 } },
          function(querySnapshot: Array<any>) {
            const { comments, next } = CommentUtils.parseComments(querySnapshot);
            setNextCursor(next);
            setIsLoadingComments(false);
            setComments(comments);
            focusLastComment();
          },
          function(error: any) {
            onSetNotificationSettings(error, 'danger', 'long');
          },
        );
      }
      focusCommentInput();
    }
    // eslint-disable-next-line
  }, [visible]);

  useEffect(() => {
    let tempCommentContainerRef: any = commentContainerRef.current;

    function handleScroll() {
      if (
        tempCommentContainerRef.scrollTop <= 40 &&
        isLoadingComments !== true &&
        visible === true &&
        nextCursor !== null
      ) {
        /**
         * load more comments
         * and set isLoadingMoreComments = true
         */
        setIsLoadingComments(true);
        Apis.comments
          .fetchMoreComments({
            params: {
              sourceCodeID: sourceCodeId,
              after: comments[0].clientTimestamp,
              limit: 15,
            },
          })
          .then(function(querySnapshot: Array<any>) {
            const { comments, next } = CommentUtils.parseComments(querySnapshot, 'fetchMore');
            setNextCursor(next);
            setIsLoadingComments(false);
            setComments(comments);
          });
      }
    }

    tempCommentContainerRef.addEventListener('scroll', handleScroll);
    return () => {
      tempCommentContainerRef.removeEventListener('scroll', handleScroll);
    };
  }, [visible, comments, isLoadingComments, sourceCodeId, nextCursor]);

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

  function handleQuoteComment(comment: string, commentId: string): void {
    setQuotedComment(comment);
    setIdOfQuotedComment(commentId);
    focusCommentInput();
  }

  function handleCommentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setNewMessage(event.target.value);
  }

  function handleRemoveQuotedComment(event: React.KeyboardEvent) {
    //Remove quoted comment when user presses the delete button
    if (event.keyCode === 8 && !!quotedComment === true && newMessage.length === 0) {
      setQuotedComment('');
      setIdOfQuotedComment('');
    }

    //Send comment when user presses enter and the shift key is not pressed
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      !!quotedComment === true ? handleSendReply() : handleSendComment();
    }
  }

  function handleSendMessage() {
    !!quotedComment === true ? handleSendReply() : handleSendComment();
  }

  function handleSendComment() {
    if (newMessage.trim().length > 0) {
      if (!!user === false) {
        onSetNotificationSettings('Please login to add a review', 'danger', 'long');
      } else if (!!sourceCodeId === false) {
        onSetNotificationSettings(
          'Cannot make comment on an unsaved source code',
          'danger',
          'long',
        );
      } else {
        Apis.comments
          .createComment({
            data: {
              sourceCodeId,
              author: {
                id: user.uid,
                name: user.username,
                photoURL: user.photoURL,
              },
              text: newMessage,
            },
            params: {
              sourceCodeID: sourceCodeId,
            },
          })
          .catch(err => onSetNotificationSettings(err, 'danger', 'long'));
        setNewMessage('');
      }
    }
  }

  function handleSendReply() {
    if (newMessage.trim().length > 0) {
      if (!!user === false) {
        onSetNotificationSettings('Please login to add a review', 'danger', 'long');
      } else if (!!sourceCodeId === false) {
        onSetNotificationSettings('Cannot make reply on an unsaved source code', 'danger', 'long');
      } else {
        Apis.replies
          .createReply({
            data: {
              author: {
                id: user.uid,
                name: user.username,
                photoURL: user.photoURL,
              },
              text: newMessage,
              commentId: idOfQuotedComment,
            },
            params: {
              sourceCodeID: sourceCodeId,
              commentID: idOfQuotedComment,
            },
          })
          .catch(err => onSetNotificationSettings(err, 'danger', 'long'));
        setNewMessage('');
        setQuotedComment('');
        setIdOfQuotedComment('');
      }
    }
  }

  function renderDateSeperator(date: number) {
    return (
      <React.Fragment>
        <div className={classes.commentDateSeperatorContainer}>
          <hr className={classes.commentDateSeperatorHr} />
        </div>
        <div className={classes.commentStickyDateContainer}>
          <div>
            <Typography thickness="semi-bold" className={classes.commentDateSeperatorText}>
              {getReadableDate(date)}
            </Typography>
          </div>
        </div>
      </React.Fragment>
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
    let previousDate: number | null = null;
    return (
      <>
        {comments.map((comment, index) => {
          let currentDate = new Date(comment.createdAt).getDate();
          let component = (
            <React.Fragment key={comment.id}>
              {currentDate !== previousDate && renderDateSeperator(comment.createdAt)}
              {isLoadingComments === true && index === 0 && renderContentLoaders()}
              <Comment
                text={comment.text}
                codeReference={comment.codeReference}
                id={comment.id}
                authorName={comment.author.name}
                authorPhotoURL={comment.author.photoURL}
                userId={(user && user.uid) || null}
                authorId={comment.author.id}
                numReplies={comment.numReplies}
                createdAt={comment.createdAt}
                onHandleReply={handleQuoteComment}
                sourceCodeId={sourceCodeId}
              />
            </React.Fragment>
          );
          currentDate !== previousDate && (previousDate = currentDate);
          return component;
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
            value={newMessage}
            onChange={handleCommentChange}
            onKeyDown={handleRemoveQuotedComment}
          />
          <SendIcon
            className={classes.commentInputSendIcon}
            onClick={handleSendMessage}
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

export default withNotificationBanner(React.memo(Comments));
