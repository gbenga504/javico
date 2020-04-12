import React, { useState, useRef, useEffect } from "react";
import { TextareaAutosize, makeStyles } from "@material-ui/core";
import { Send as SendIcon } from "@material-ui/icons";

import { IComment } from "../../utils/Apis";
import {
  useStyles as commonUseStyles,
  color,
  fontsize,
  padding
} from "../../design-language/Css";
import Typography from "../Typography";
import ContentLoader from "../ContentLoader";
import { getReadableDate } from "../../utils/TimeUtils";
import { usePrevious } from "../../hooks";

interface IProps {
  visible: boolean;
  loading: boolean;
  onTopReached?: (info: { distanceFromEnd: number }) => void;
  onTopReachedThreshold: number;
  data: Array<IComment>;
  onMount?: () => void;
  onUnMount?: () => void;
  onSend: (
    comment: string,
    type: "COMMENT" | "REPLY",
    idOfQuotedComment?: string
  ) => void;
  renderItem: (item: IComment) => any;
}

const CommentList: React.FC<IProps> = ({
  visible,
  loading,
  onTopReached,
  onTopReachedThreshold = 0.9,
  data,
  onMount,
  onUnMount,
  onSend,
  renderItem
}) => {
  const [quotedComment, setQuotedComment] = useState<string>("");
  const [idOfQuotedComment, setIdOfQuotedComment] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const classes = useStyles();
  const commonCss = commonUseStyles();
  const commentInputRef = useRef<any>(null);
  const commentContainerRef = useRef<any>(null);
  const previousComments = usePrevious(data);

  useEffect(() => {
    if (visible === true) {
      onMount && onMount();
      focusCommentInput();
    }

    let tempCommentContainerRef: any = commentContainerRef.current;
    function handleScroll() {
      let boundingContainerClientRect = tempCommentContainerRef.getBoundingClientRect();
      if (
        tempCommentContainerRef.scrollTop <=
          boundingContainerClientRect.height -
            boundingContainerClientRect.height * onTopReachedThreshold &&
        visible === true
      ) {
        // Trigger onTopReached
        onTopReached &&
          onTopReached({ distanceFromEnd: onTopReachedThreshold });
      }
    }
    tempCommentContainerRef.addEventListener("scroll", handleScroll);

    return () => {
      onUnMount && onUnMount();
      tempCommentContainerRef.removeEventListener("scroll", handleScroll);
    };
  }, [visible]);

  useEffect(() => {
    let _previousComments = previousComments || [];
    if (data.length !== _previousComments.length) {
      focusLastComment();
    }
  }, [data]);

  function focusLastComment() {
    commentContainerRef.current.scrollTop =
      commentContainerRef.current.scrollHeight;
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
    if (
      event.keyCode === 8 &&
      !!quotedComment === true &&
      newMessage.length === 0
    ) {
      setQuotedComment("");
      setIdOfQuotedComment("");
    }

    //Send comment when user presses enter and the shift key is not pressed
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      onSend(
        newMessage,
        !!quotedComment === true ? "REPLY" : "COMMENT",
        !!quotedComment === true ? idOfQuotedComment : undefined
      );
    }
  }

  function handleSendMessage() {
    onSend(
      newMessage,
      !!quotedComment === true ? "REPLY" : "COMMENT",
      !!quotedComment === true ? idOfQuotedComment : undefined
    );
  }

  //This is an imperative function which can be called to reset the input box
  function resetInputBox() {
    setNewMessage("");
    setQuotedComment("");
    setIdOfQuotedComment("");
  }

  function renderDateSeperator(date: number) {
    return (
      <React.Fragment>
        <div className={classes.commentDateSeperatorContainer}>
          <hr className={classes.commentDateSeperatorHr} />
        </div>
        <div className={classes.commentStickyDateContainer}>
          <div>
            <Typography
              thickness="semi-bold"
              className={classes.commentDateSeperatorText}
            >
              {getReadableDate(date)}
            </Typography>
          </div>
        </div>
      </React.Fragment>
    );
  }

  function renderContentLoaders() {
    return data.length > 0 ? (
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
        {data.map((item, index) => {
          let currentDate = new Date(item.createdAt).getDate();
          let component = (
            <React.Fragment key={item.id}>
              {currentDate !== previousDate &&
                renderDateSeperator(item.createdAt)}
              {loading === true && index === 0 && renderContentLoaders()}
              {React.cloneElement(renderItem(item), {
                onRequestReply: handleQuoteComment
              })}
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
      <div
        ref={commentContainerRef}
        className={`${commonCss.fullHeightAndWidth} ${classes.commentsBody}`}
      >
        {renderComments()}
      </div>
      <div className={classes.commentInput}>
        {!!quotedComment === true && renderQuotedComment()}
        <div
          className={`${classes.commentInputFieldContainer} ${
            commonCss.flexRow
          } ${!!quotedComment === true && "hide-border"}`}
        >
          <TextareaAutosize
            aria-label="Drop a review"
            className={classes.commentInputField}
            placeholder={
              !!quotedComment === true
                ? "Drop a reply"
                : "Drop a review on this code"
            }
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
          />
        </div>
      </div>
    </section>
  );
};

const useStyles = makeStyles(theme => ({
  comments: {
    height: "100%",
    backgroundColor: color.deepBlue,
    position: "relative",
    borderTop: `1px solid ${color.darkThemeLightBorder}`
  },
  commentsBody: {
    overflowY: "scroll",
    marginTop: 38,
    paddingBottom: theme.spacing(25)
  },
  commentInput: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 4,
    backgroundImage:
      "linear-gradient(to top,rgba(28, 32, 34) 70%,rgba(28, 32, 34, 0.1) 100%)"
  },
  commentInputFieldContainer: {
    height: "auto",
    boxSizing: "border-box",
    border: `1px solid ${color.darkThemeDarkBorder}`,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: color.deepBlue,
    borderRadius: 3,
    margin: theme.spacing(0, 4, 4),
    "&.hide-border": {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderTop: 0
    }
  },
  commentInputField: {
    color: color.white,
    width: "100%",
    border: "1px solid transparent",
    backgroundColor: "transparent",
    fontSize: fontsize.base,
    resize: "none",
    padding: theme.spacing(3, 0),
    paddingLeft: theme.spacing(4),
    "&:focus": {
      outline: "none"
    }
  },
  commentInputSendIcon: {
    height: 18,
    alignSelf: "flex-end",
    width: 18,
    color: color.themeBlue,
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(2),
    cursor: "pointer"
  },
  commentQuotedCommentContainer: {
    margin: theme.spacing(0, 4),
    border: `1px solid ${color.darkThemeDarkBorder}`,
    padding: theme.spacing(2, 3, 0.5, 3),
    borderRadius: 3,
    borderBottom: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    background: color.deepBlue,
    "& p": {
      width: "100%",
      fontSize: fontsize.small,
      borderLeft: `6px solid ${color.themeBlue}`,
      background: color.themeBlueLighter,
      padding: theme.spacing(2),
      margin: 0
    }
  },
  commentNotLive: {
    color: `${color.darkThemeDarkBorder} !important`
  },
  commentDateSeperatorContainer: {
    position: "sticky",
    top: 0,
    display: "flex",
    paddingTop: 10,
    alignItems: "center",
    background: color.deepBlue,
    zIndex: 2
  },
  commentDateSeperatorHr: {
    border: 0,
    borderTop: "1px solid rgba(53,55,59,1)",
    position: "relative",
    width: "100%",
    margin: 0
  },
  commentDateSeperatorText: {
    fontSize: fontsize.base
  },
  commentStickyDateContainer: {
    top: 12,
    position: "sticky",
    display: "flex",
    zIndex: 3,
    justifyContent: "center",
    "& div": {
      marginTop: -12,
      background: color.deepBlue,
      ...padding(0, "tb"),
      ...padding(10, "lr")
    }
  }
}));

export default React.memo(CommentList);
