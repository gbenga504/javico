import React, { useState, useRef, useEffect } from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import {
  KeyboardReturn as KeyboardReturnIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from "@material-ui/icons";

import Typography from "@javico/common/lib/components/Typography";
import { Apis, IReply } from "../../utils/Apis";
import Reply from "./Reply";
import CommentUtils from "../../utils/CommentUtils";
import { color, fontsize } from "@javico/common/lib/design-language/Css";

interface IProps {
  onHandleToggleRepliesVisibility: () => void;
  numReplies: number;
  replies: any;
  userId: string;
  commentId: string;
  sourceCodeId: string;
  isRepliesVisible: boolean;
  isRepliesLoading: boolean;
  setIsRepliesLoading: any;
  setReplies: any;
}

const Replies: React.FC<IProps> = ({
  onHandleToggleRepliesVisibility,
  setIsRepliesLoading,
  setReplies,
  userId,
  sourceCodeId,
  replies,
  numReplies,
  isRepliesVisible,
  isRepliesLoading,
  commentId
}) => {
  const [repliesHeight, setRepliesHeight] = useState<number>(0);
  const replyRef = useRef<any>(null);
  const classes = useStyles();

  useEffect(() => {
    if (replyRef.current) {
      if (!isRepliesVisible) {
        return setRepliesHeight(0);
      }
      setRepliesHeight(replyRef.current.scrollHeight);
    }
  }, [isRepliesVisible, replies]);

  function handleLoadMoreReplies() {
    /**
     * @todo
     * Load more replies
     * setReplies and setIsRepliesLoading function
     */
    setIsRepliesLoading(true);
    Apis.replies
      .fetchMoreReplies({
        params: {
          sourceCodeID: sourceCodeId,
          after: replies[replies.length - 1].clientTimestamp,
          limit: 10,
          commentID: commentId
        }
      })
      .then(function(querySnapshot: Array<any>) {
        const { replies } = CommentUtils.parseReplies(querySnapshot, commentId);
        setIsRepliesLoading(false);
        setReplies(replies);
      });
  }

  function renderShowMoreRepliesButton() {
    return (
      <div
        onClick={handleLoadMoreReplies}
        className={classes.commentReplyActionButtonContainer}
      >
        <KeyboardReturnIcon />
        <Typography thickness="semi-bold">Show more replies</Typography>
      </div>
    );
  }

  const innerStyle = {
    height: `${isRepliesVisible ? repliesHeight : 0}px`,
    opacity: isRepliesVisible ? 1 : 0
  };

  const IconComponent =
    isRepliesVisible === true ? ExpandLessIcon : ExpandMoreIcon;

  return (
    <>
      <div
        onClick={onHandleToggleRepliesVisibility}
        className={classes.commentReplyActionButtonContainer}
      >
        <IconComponent style={{ color: color.themeBlue }} />
        <Typography thickness="semi-bold">
          {isRepliesVisible === true ? "Hide" : "View"} {numReplies}{" "}
          {numReplies === 1 ? "reply" : "replies"}
        </Typography>
      </div>
      <div
        ref={replyRef}
        style={{ ...innerStyle }}
        className={classes.repliesReply}
      >
        {isRepliesVisible === true &&
          replies.map((reply: IReply) => {
            return (
              <Reply
                key={reply.id}
                id={reply.id}
                authorName={reply.author.name}
                authorPhotoURL={reply.author.photoURL}
                text={reply.text}
                createdAt={reply.createdAt}
                sourceCodeId={sourceCodeId}
                commentId={commentId}
                isReplyOwner={reply.author.id === userId}
              />
            );
          })}
      </div>
      {isRepliesLoading === false &&
        isRepliesVisible === true &&
        replies.length < numReplies &&
        replies.length !== 0 &&
        renderShowMoreRepliesButton()}
      {isRepliesLoading === true && (
        <CircularProgress color="primary" size={20} />
      )}
    </>
  );
};

const useStyles = makeStyles(theme => ({
  commentReplyActionButtonContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: color.themeBlue,
    marginTop: theme.spacing(2),
    "& ion-icon": {
      color: color.themeBlue,
      fontSize: 16
    },
    "& span": {
      color: `${color.themeBlue} !important`,
      marginLeft: 10,
      fontSize: fontsize.small
    }
  },
  repliesReply: {
    willChange: "height",
    display: "block",
    opacity: 1,
    // -webkit-transition: height 0.4s cubic-bezier(0.65, 0.05, 0.36, 1);
    transition: "all 0.4s cubic-bezier(0.65, 0.05, 0.36, 1)"
  }
}));

export default React.memo(Replies);
