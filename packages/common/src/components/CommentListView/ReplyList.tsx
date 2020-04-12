import React, { useState, useRef, useEffect } from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import {
  KeyboardReturn as KeyboardReturnIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from "@material-ui/icons";

import Typography from "../Typography";
import { IReply } from "../../utils/Apis";
import Reply from "./Reply";
import { color, fontsize } from "../../design-language/Css";

interface IProps {
  onToggleRepliesVisibility: () => void;
  onLoadMore: (nextCursor: string) => void;
  numReplies: number;
  data: any;
  userId: string;
  commentId: string;
  visible: boolean;
  loading: boolean;
  onRequestDelete: (authorId: string) => void;
  onEdit: (
    authorId: string,
    previousReplyText: string,
    currentReplyText: string
  ) => void;
  isEditing: { [key: string]: boolean };
}

const ReplyList: React.FC<IProps> = ({
  onToggleRepliesVisibility,
  userId,
  data,
  numReplies,
  visible,
  loading,
  commentId,
  onLoadMore,
  onRequestDelete,
  onEdit,
  isEditing
}) => {
  const [repliesHeight, setRepliesHeight] = useState<number>(0);
  const replyRef = useRef<any>(null);
  const classes = useStyles();

  useEffect(() => {
    if (replyRef.current) {
      if (!visible) {
        return setRepliesHeight(0);
      }
      setRepliesHeight(replyRef.current.scrollHeight);
    }
  }, [visible]);

  function handleLoadMoreReplies() {
    onLoadMore(data[data.length - 1].clientTimestamp);
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
    height: `${visible ? repliesHeight : 0}px`,
    opacity: visible ? 1 : 0
  };

  const IconComponent = visible === true ? ExpandLessIcon : ExpandMoreIcon;

  return (
    <>
      <div
        onClick={onToggleRepliesVisibility}
        className={classes.commentReplyActionButtonContainer}
      >
        <IconComponent style={{ color: color.themeBlue }} />
        <Typography thickness="semi-bold">
          {visible === true ? "Hide" : "View"} {numReplies}{" "}
          {numReplies === 1 ? "reply" : "replies"}
        </Typography>
      </div>
      <div
        ref={replyRef}
        style={{ ...innerStyle }}
        className={classes.repliesReply}
      >
        {visible === true &&
          data.map((reply: IReply) => {
            return (
              <Reply
                key={reply.id}
                id={reply.id}
                authorName={reply.author.name}
                authorPhotoURL={reply.author.photoURL}
                text={reply.text}
                createdAt={reply.createdAt}
                isReplyOwner={reply.author.id === userId}
                onRequestDelete={onRequestDelete}
                onEdit={onEdit}
                isEditing={isEditing[reply.id]}
              />
            );
          })}
      </div>
      {loading === false &&
        visible === true &&
        data.length < numReplies &&
        data.length !== 0 &&
        renderShowMoreRepliesButton()}
      {loading === true && <CircularProgress color="primary" size={20} />}
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
    transition: "all 0.4s cubic-bezier(0.65, 0.05, 0.36, 1)"
  }
}));

export default React.memo(ReplyList);
