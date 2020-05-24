import React, { useState, useEffect, useRef } from "react";
import {
  withNotificationBanner,
  Comment,
  CommentList,
  DeleteMessageModal
} from "@javico/common/lib/components";
import { Apis, IComment, IReply } from "@javico/common/lib/utils/Apis";
import {
  IBannerStyle,
  IDuration
} from "@javico/common/lib/components/NotificationBanner";
import CommentUtils from "@javico/common/lib/utils/CommentUtils";
import { useSelector } from "react-redux";

import { getCurrentUserState } from "../../redux/auth/reducers";
import { useStyles } from "./styles";

interface IProps {
  visible: boolean;
  onSetNotificationSettings: (
    text: string,
    style?: IBannerStyle,
    duration?: IDuration
  ) => null;
  sourceCodeId: string;
}

const CommentListHandler: React.FC<IProps> = ({
  visible,
  onSetNotificationSettings,
  sourceCodeId
}) => {
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [metasOfMessageToDelete, setMetasOfMessageToDelete] = useState<{
    id: string;
    type: "COMMENT" | "REPLY";
    commentId?: string;
  } | null>(null);
  const [isDeleteCommentLoading, setIsDeleteCommentLoading] = useState<boolean>(
    false
  );
  const [isEditingComment, setIsEditingComment] = useState<{
    [key: string]: boolean;
  } | null>(null);
  const [isEditingReply, setIsEditingReply] = useState<{
    [key: string]: boolean;
  } | null>(null);
  const [isLoadingReplies, setIsLoadingReplies] = useState<{
    [key: string]: boolean;
  } | null>(null);
  const [comments, setComments] = useState<Array<IComment>>([]);
  const [replies, setReplies] = useState<{
    [key: string]: Array<IReply>;
  } | null>(null);
  const commentListRef = useRef<null | any>(null);
  const [nextCursor, setNextCursor] = useState<null | undefined | number>(null);
  const currentUser = useSelector(getCurrentUserState);
  const classes = useStyles();

  useEffect(() => {
    if (visible === true) {
      if (
        comments.length === 0 &&
        isLoadingComments === false &&
        !!sourceCodeId === true
      ) {
        /**
         * Initialize the load process using the API
         * and set comment loading state to false after success or error
         * also focus last comment after successful load
         */
        setIsLoadingComments(true);
        Apis.comments.onSnapshotChanged(
          { params: { sourceCodeID: sourceCodeId, limit: 15 } },
          function(querySnapshot: Array<any>) {
            const { comments, next } = CommentUtils.parseComments(
              querySnapshot
            );
            setIsLoadingComments(false);
            setComments(comments);
            setNextCursor(next);
          },
          function(error: any) {
            onSetNotificationSettings(error, "danger", "long");
          }
        );
      }
    }
    // eslint-disable-next-line
  }, [visible]);

  function toggleEditCommentLoadingState(id: string, loading: boolean) {
    setIsEditingComment((prevState: any) => {
      let _prevState = prevState || {};
      return { ..._prevState, [id]: loading };
    });
  }

  function toggleEditReplyLoadingState(id: string, loading: boolean) {
    setIsEditingReply((prevState: any) => {
      let _prevState = prevState || {};
      return { ..._prevState, [id]: loading };
    });
  }

  function toggleRepliesLoadingState(id: string, loading: boolean) {
    setIsLoadingReplies((prevState: any) => {
      let _prevState = prevState || {};
      return { ..._prevState, [id]: loading };
    });
  }

  function handleLoadMoreComments() {
    /**
     * load more comments
     * and set isLoadingMoreComments = true
     */
    if (isLoadingComments !== true && nextCursor !== null) {
      setIsLoadingComments(true);
      Apis.comments
        .fetchMoreComments({
          params: {
            sourceCodeID: sourceCodeId,
            after: comments[0].clientTimestamp,
            limit: 15
          }
        })
        .then(function(querySnapshot: Array<any>) {
          const { comments, next } = CommentUtils.parseComments(
            querySnapshot,
            "fetchMore"
          );
          setNextCursor(next);
          setIsLoadingComments(false);
          setComments(comments);
        });
    }
  }

  function handleSend(
    newMessage: string,
    type: "COMMENT" | "REPLY",
    idOfQuotedComment?: string
  ) {
    if (type === "COMMENT") {
      handleSendComment(newMessage);
    } else {
      handleSendReply(newMessage, idOfQuotedComment);
    }
  }

  function handleSendComment(newMessage: string) {
    if (newMessage.trim().length > 0) {
      const user = Apis.users.getCurrentUser();

      if (!!user === false) {
        onSetNotificationSettings(
          "Please login to add a review",
          "danger",
          "long"
        );
      } else if (!!sourceCodeId === false) {
        onSetNotificationSettings(
          "Cannot make comment on an unsaved source code",
          "danger",
          "long"
        );
      } else {
        Apis.comments
          .createComment({
            data: {
              sourceCodeId,
              author: {
                id: currentUser.uid,
                name: currentUser.displayName,
                photoURL: currentUser.photoURL
              },
              text: newMessage
            },
            params: {
              sourceCodeID: sourceCodeId
            }
          })
          .catch(err => onSetNotificationSettings(err, "danger", "long"));
        commentListRef && commentListRef.current.resetInputBox();
      }
    }
  }

  function handleSendReply(
    newMessage: string,
    idOfQuotedComment: string | undefined
  ) {
    if (newMessage.trim().length > 0) {
      const user = Apis.users.getCurrentUser();
      const _idOfQuotedComment = idOfQuotedComment || "";

      if (!!user === false) {
        onSetNotificationSettings(
          "Please login to add a review",
          "danger",
          "long"
        );
      } else if (!!sourceCodeId === false) {
        onSetNotificationSettings(
          "Cannot make reply on an unsaved source code",
          "danger",
          "long"
        );
      } else {
        Apis.replies
          .createReply({
            data: {
              author: {
                id: currentUser.uid,
                name: currentUser.displayName,
                photoURL: currentUser.photoURL
              },
              text: newMessage,
              commentId: _idOfQuotedComment
            },
            params: {
              sourceCodeID: sourceCodeId,
              commentID: _idOfQuotedComment
            }
          })
          .catch(err => onSetNotificationSettings(err, "danger", "long"));
        commentListRef && commentListRef.current.resetInputBox();
      }
    }
  }

  function handleDeleteMessage() {
    if (metasOfMessageToDelete) {
      if (metasOfMessageToDelete.type === "COMMENT") {
        handleDeleteComment();
      } else {
        handleDeleteReply();
      }
    }
  }

  function handleDeleteComment() {
    setIsDeleteCommentLoading(true);
    const ID = metasOfMessageToDelete ? metasOfMessageToDelete.id : "";
    Apis.comments
      .deleteComment({ params: { sourceCodeID: sourceCodeId, ID } })
      .then(res => {
        setIsDeleteCommentLoading(false);
        setMetasOfMessageToDelete(null);
      })
      .catch(error => {
        onSetNotificationSettings(error, "danger", "long");
      });
  }

  function handleDeleteReply() {
    setIsDeleteCommentLoading(true);
    const ID = metasOfMessageToDelete ? metasOfMessageToDelete.id : "";
    const commentID =
      metasOfMessageToDelete && metasOfMessageToDelete.commentId
        ? metasOfMessageToDelete.commentId
        : "";

    Apis.replies
      .deleteReply({
        params: { sourceCodeID: sourceCodeId, commentID, ID }
      })
      .then(res => {
        setIsDeleteCommentLoading(true);
        setMetasOfMessageToDelete(null);
      })
      .catch(error => {
        onSetNotificationSettings(error, "danger", "long");
      });
  }

  function handleEditComment(
    id: string,
    text: string,
    editableComment: string
  ) {
    toggleEditCommentLoadingState(id, true);
    return new Promise((resolve, reject) => {
      Apis.comments
        .updateComment({
          data: { text: editableComment.trim() },
          params: { sourceCodeID: sourceCodeId, ID: id }
        })
        .then(res => {
          toggleEditCommentLoadingState(id, false);
          resolve();
        })
        .catch(error => {
          onSetNotificationSettings(error, "danger", "long");
          toggleEditCommentLoadingState(id, false);
          reject();
        });
    });
  }

  function handleEditReply(commentId: string) {
    return (id: string, text: string, editableReply: string) => {
      toggleEditReplyLoadingState(id, true);
      return new Promise((resolve, reject) => {
        Apis.replies
          .updateReply({
            data: { text: editableReply.trim() },
            params: { sourceCodeID: sourceCodeId, commentID: commentId, ID: id }
          })
          .then(res => {
            toggleEditReplyLoadingState(id, false);
            resolve();
          })
          .catch(error => {
            onSetNotificationSettings(error, "danger", "long");
            toggleEditReplyLoadingState(id, false);
            reject();
          });
      });
    };
  }

  function handleLoadReplies(commentId: string) {
    return () => {
      if (
        replies === null ||
        (replies && replies[commentId] === undefined) ||
        (replies && replies[commentId].length === 0)
      ) {
        toggleRepliesLoadingState(commentId, true);
        Apis.replies.onSnapshotChanged(
          {
            params: {
              sourceCodeID: sourceCodeId,
              limit: 10,
              commentID: commentId
            }
          },
          function(querySnapshot: Array<any>) {
            const { replies } = CommentUtils.parseReplies(
              querySnapshot,
              commentId
            );
            toggleRepliesLoadingState(commentId, false);
            setReplies((prevState: any) => {
              let _prevState = prevState || {};
              return { ..._prevState, [commentId]: replies };
            });
          },
          function(error: any) {
            onSetNotificationSettings(error, "danger", "long");
          }
        );
      }
    };
  }

  function handleLoadMoreReplies(commentId: string) {
    /**
     * @todo
     * Load more replies
     * setReplies and setIsRepliesLoading function
     */
    return () => {
      toggleRepliesLoadingState(commentId, true);
      Apis.replies
        .fetchMoreReplies({
          params: {
            sourceCodeID: sourceCodeId,
            after: replies
              ? replies[commentId][replies[commentId].length - 1]
                  .clientTimestamp
              : "",
            limit: 10,
            commentID: commentId
          }
        })
        .then(function(querySnapshot: Array<any>) {
          const { replies } = CommentUtils.parseReplies(
            querySnapshot,
            commentId
          );
          toggleRepliesLoadingState(commentId, false);
          setReplies((prevState: any) => {
            let _prevState = prevState || {};
            return { ..._prevState, [commentId]: replies };
          });
        });
    };
  }

  return (
    <>
      <CommentList
        ref={commentListRef}
        visible={visible}
        loading={isLoadingComments}
        onTopReached={handleLoadMoreComments}
        data={comments}
        onSend={handleSend}
        renderItem={(item: IComment) => (
          <Comment
            text={item.text}
            codeReference={item.codeReference}
            id={item.id}
            authorName={item.author.name}
            authorPhotoURL={item.author.photoURL}
            createdAt={item.createdAt}
            userId={(currentUser && currentUser.uid) || null}
            authorId={item.author.id}
            startingLineNumber={item.codeReferenceStartLine}
            editMessagePanelProps={{
              inputClassName: classes.editPanelInput,
              cancelButtonClassName: classes.editPanelCancelButton
            }}
            onRequestDelete={() =>
              setMetasOfMessageToDelete({ id: item.id, type: "COMMENT" })
            }
            onEdit={handleEditComment}
            isEditing={Boolean(isEditingComment && isEditingComment[item.id])}
            onShowReplies={handleLoadReplies(item.id)}
            repliesProps={{
              numReplies: item.numReplies,
              data: !!replies ? replies[item.id] : [],
              loading: !!isLoadingReplies ? isLoadingReplies[item.id] : false,
              onLoadMore: handleLoadMoreReplies(item.id),
              onRequestDelete: (id: string) =>
                setMetasOfMessageToDelete({
                  id,
                  type: "REPLY",
                  commentId: item.id
                }),
              onEdit: handleEditReply(item.id),
              isEditing: !!isEditingReply ? isEditingReply : {}
            }}
          />
        )}
      />
      <DeleteMessageModal
        visible={Boolean(metasOfMessageToDelete)}
        loading={isDeleteCommentLoading}
        onRequestClose={() => setMetasOfMessageToDelete(null)}
        onOk={handleDeleteMessage}
      />
    </>
  );
};

export default withNotificationBanner(React.memo(CommentListHandler));
