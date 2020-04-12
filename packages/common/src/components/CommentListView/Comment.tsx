import React, { useState, useEffect } from "react";
import { makeStyles, Menu, MenuItem } from "@material-ui/core";
import { MoreHoriz as MoreHorizIcon } from "@material-ui/icons";

import {
  useStyles as commonUseStyles,
  padding,
  color,
  fontsize
} from "../../design-language/Css";
import Typography from "../Typography";
import SyntaxHighlighter from "../SyntaxHighlighter";
import EditMessagePanel from "../EditMessagePanel";
import { parseTime } from "../../utils/TimeUtils";
import { IReply } from "../../utils/Apis";
import MarkdownRenderer from "../MarkDownRenderer";
import ReplyList from "./ReplyList";
import { useUpdateEffect } from "../../hooks";

interface IReplyProps {
  numReplies: number;
  data: Array<IReply>;
  loading: boolean;
  onLoadMore: (nextCursor: string) => void;
  onRequestDelete: (id: string) => void;
  onEdit: (
    id: string,
    previousReplyText: string,
    currentReplyText: string
  ) => void;
  isEditing: { [key: string]: boolean };
}

interface IProps {
  text: string;
  codeReference?: string;
  id: string;
  authorName: string;
  authorPhotoURL: string;
  createdAt: number;
  onRequestReply?: (comment: string, id: string) => void;
  userId: string;
  authorId: string;
  onRequestDelete: (id: string) => void;
  onEdit: (
    id: string,
    previousCommentText: string,
    currentCommentText: string
  ) => void;
  isEditing: boolean;
  onShowReplies?: () => void;
  onHideReplies?: () => void;
  repliesProps: IReplyProps;
}

const Comment: React.FC<IProps> = ({
  text,
  codeReference,
  id,
  authorName,
  authorPhotoURL,
  createdAt,
  onRequestReply,
  userId,
  authorId,
  onRequestDelete,
  onEdit,
  isEditing,
  onShowReplies,
  onHideReplies,
  repliesProps
}) => {
  const [isRepliesVisible, setIsRepliesVisible] = useState<boolean>(false);
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | SVGSVGElement>(
    null
  );
  const [editableComment, setEditableComment] = useState<string>(text);
  const [isEditMessagePanelVisible, setIsEditMessagePanelVisible] = useState<
    boolean
  >(false);
  const commonCss = commonUseStyles();
  const classes = useStyles();

  useUpdateEffect(() => {
    if (isRepliesVisible === true) {
      onShowReplies && onShowReplies();
    } else {
      onHideReplies && onHideReplies();
    }
  }, [isRepliesVisible]);

  function handleToggleRepliesVisibility() {
    setIsRepliesVisible(prevIsRepliesVisible => !prevIsRepliesVisible);
  }

  function handleShowOptions(event: React.MouseEvent<SVGSVGElement>) {
    setOptionsAnchorEl(event.currentTarget);
  }

  function handleCloseOptions() {
    setOptionsAnchorEl(null);
  }

  function handleReplyComment(text: string) {
    handleCloseOptions();
    onRequestReply && onRequestReply(text, id);
  }

  function handleOpenConfirmDeleteModal() {
    handleCloseOptions();
    onRequestDelete(id);
  }

  function handleCommentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setEditableComment(event.target.value);
  }

  function handleOpenEditMessagePanel() {
    handleCloseOptions();
    setIsEditMessagePanelVisible(true);
  }

  function handleCloseEditMessagePanel() {
    setIsEditMessagePanelVisible(false);
  }

  function handleEditMessage() {
    onEdit(id, text, editableComment);
  }

  function renderMenuOptions() {
    return (
      <Menu
        anchorEl={optionsAnchorEl}
        keepMounted
        open={Boolean(optionsAnchorEl)}
        onClose={handleCloseOptions}
      >
        <MenuItem onClick={() => handleReplyComment(text)}>Reply</MenuItem>
        {authorId === userId && (
          <MenuItem onClick={handleOpenEditMessagePanel}>Edit</MenuItem>
        )}
        {authorId === userId && (
          <MenuItem onClick={handleOpenConfirmDeleteModal}>Delete</MenuItem>
        )}
      </Menu>
    );
  }

  function renderComment() {
    return (
      <>
        <div
          className={commonCss.flexRow}
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography
            className={classes.commentUsername}
            thickness="bold"
            variant="span"
          >
            {!!authorName ? authorName : "Anonymous"}{" "}
            <Typography className={classes.commentTime}>
              {parseTime(createdAt)}
            </Typography>
          </Typography>
          <MoreHorizIcon
            className={`${classes.commentMoreIcon} comment__show-more-button`}
            onClick={e => handleShowOptions(e)}
          />
        </div>
        <Typography className={classes.commentUserComment} variant="span">
          <MarkdownRenderer source={text} linkTarget="_blank" />
        </Typography>
      </>
    );
  }

  return (
    <div
      className={`${commonCss.flexColumn} ${commonCss.relative}`}
      style={{ ...padding(16, "lr"), ...padding(10, "bt") }}
    >
      <div className={`${classes.comment} ${commonCss.flexRow}`} key={id}>
        <div className={classes.commentUserImageContainer}>
          {!!authorPhotoURL === true && (
            <img src={authorPhotoURL} alt={authorName} />
          )}
        </div>
        <div
          className={`${commonCss.flexColumn} ${commonCss.fullWidth}`}
          style={padding(8, "l")}
        >
          {isEditMessagePanelVisible === false && renderComment()}
          <EditMessagePanel
            visible={isEditMessagePanelVisible}
            loading={isEditing}
            onHandleValueChange={handleCommentChange}
            value={editableComment}
            onRequestClose={handleCloseEditMessagePanel}
            onOk={handleEditMessage}
          />
        </div>
      </div>
      <div className={classes.commentBottomContainer}>
        {codeReference && (
          <SyntaxHighlighter
            containerStyle={{ marginTop: 5 }}
            sourceCode={codeReference}
          />
        )}
        {!!repliesProps.numReplies === true && repliesProps.numReplies > 0 && (
          <ReplyList
            onToggleRepliesVisibility={handleToggleRepliesVisibility}
            numReplies={repliesProps.numReplies}
            data={repliesProps.data}
            loading={repliesProps.loading}
            visible={isRepliesVisible}
            commentId={id}
            userId={userId}
            onLoadMore={repliesProps.onLoadMore}
            onRequestDelete={repliesProps.onRequestDelete}
            onEdit={repliesProps.onEdit}
            isEditing={repliesProps.isEditing}
          />
        )}
      </div>
      {renderMenuOptions()}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  commentBottomContainer: {
    marginLeft: 40,
    display: "flex",
    flexDirection: "column"
  },
  comment: {
    backgroundColor: "inherit",
    transition: "all 0.3s",
    cursor: "pointer",
    "&:hover": {
      background: "#222529"
    },
    "&:hover .comment__show-more-button": {
      display: "block"
    }
  },
  commentUserImageContainer: {
    height: 35,
    width: 35,
    borderRadius: 5,
    background: "#313438",
    "& img": {
      height: "inherit",
      width: "inherit",
      borderRadius: 5
    }
  },
  commentUsername: {
    cursor: "pointer",
    display: "inline-block",
    fontSize: fontsize.small
  },
  commentTime: {
    fontSize: fontsize.xsmall,
    color: `#ABABAD !important`,
    marginLeft: 5
  },
  commentUserComment: {
    fontSize: fontsize.small + 0.5,
    "& p": {
      margin: 0
    }
  },
  commentMoreIcon: {
    color: color.white,
    fontSize: fontsize.large,
    display: "none"
  }
}));

export default React.memo(Comment);
