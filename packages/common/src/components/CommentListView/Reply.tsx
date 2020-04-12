import React, { useState } from "react";
import { makeStyles, Menu, MenuItem } from "@material-ui/core";
import { MoreHoriz as MoreHorizIcon } from "@material-ui/icons";

import {
  useStyles as commonUseStyles,
  padding,
  color,
  fontsize
} from "../../design-language/Css";
import Typography from "../Typography";
import EditMessagePanel from "../EditMessagePanel";
import { getRelativeTime } from "../../utils/TimeUtils";
import MarkdownRenderer from "../MarkDownRenderer";

interface IProps {
  id: string;
  authorName: string;
  authorPhotoURL: string;
  text: string;
  createdAt: number;
  isReplyOwner: boolean;
  onRequestDelete: (id: string) => void;
  onEdit: (
    id: string,
    previousReplyText: string,
    currentReplyText: string
  ) => void;
  isEditing: boolean;
}

const Reply: React.FC<IProps> = ({
  id,
  authorName,
  authorPhotoURL,
  text,
  createdAt,
  isReplyOwner,
  onRequestDelete,
  onEdit,
  isEditing
}) => {
  const classes = useStyles();
  const commonCss = commonUseStyles();
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | SVGSVGElement>(
    null
  );
  const [editableReply, setEditableReply] = useState<string>(text);
  const [isEditMessagePanelVisible, setIsEditMessagePanelVisible] = useState<
    boolean
  >(false);

  function handleShowOptions(event: React.MouseEvent<SVGSVGElement>) {
    setOptionsAnchorEl(event.currentTarget);
  }

  function handleCloseOptions() {
    setOptionsAnchorEl(null);
  }

  function handleOpenConfirmDeleteModal() {
    handleCloseOptions();
    onRequestDelete(id);
  }

  function handleReplyChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setEditableReply(event.target.value);
  }

  function handleOpenEditMessagePanel() {
    handleCloseOptions();
    setIsEditMessagePanelVisible(true);
  }

  function handleCloseEditMessagePanel() {
    setIsEditMessagePanelVisible(false);
  }

  function handleEditMessage() {
    onEdit(id, text, editableReply);
  }

  function renderMenuOptions() {
    return (
      <Menu
        anchorEl={optionsAnchorEl}
        keepMounted
        open={Boolean(optionsAnchorEl)}
        onClose={handleCloseOptions}
      >
        <MenuItem onClick={handleOpenEditMessagePanel}>Edit</MenuItem>
        <MenuItem onClick={handleOpenConfirmDeleteModal}>Delete</MenuItem>
      </Menu>
    );
  }

  function renderReply() {
    return (
      <>
        <div className={classes.replyUserImageContainer}>
          {!!authorPhotoURL === true && (
            <img src={authorPhotoURL} alt={authorName} />
          )}
        </div>
        <div
          className={commonCss.flexColumn}
          style={{ ...padding(8, "l"), width: "100%" }}
        >
          <div
            className={commonCss.flexRow}
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography
              className={classes.replyUsername}
              thickness="bold"
              variant="span"
            >
              {!!authorName ? authorName : "Anonymous"}{" "}
              <Typography className={classes.replyTime}>
                {getRelativeTime(createdAt)}
              </Typography>
            </Typography>

            {isReplyOwner && (
              <MoreHorizIcon
                className={`${classes.replyMoreIcon} reply__show-more-button`}
                onClick={e => handleShowOptions(e)}
              />
            )}
          </div>
          <Typography className={classes.replyUserText} variant="span">
            <MarkdownRenderer source={text} linkTarget="_blank" />
          </Typography>
        </div>
      </>
    );
  }

  return (
    <div className={`${classes.reply} ${commonCss.flexRow}`}>
      {isEditMessagePanelVisible === false && renderReply()}
      <EditMessagePanel
        visible={isEditMessagePanelVisible}
        loading={isEditing}
        onHandleValueChange={handleReplyChange}
        value={editableReply}
        onRequestClose={handleCloseEditMessagePanel}
        onOk={handleEditMessage}
      />
      {renderMenuOptions()}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  reply: {
    backgroundColor: "inherit",
    transition: "all 0.3s",
    cursor: "pointer",
    marginTop: 10,
    "&:hover": {
      background: "#222529"
    },
    "&:hover .reply__show-more-button": {
      display: "block"
    }
  },
  replyUserImageContainer: {
    width: 24,
    height: 24,
    borderRadius: 5,
    background: "#313438",
    "& img": {
      width: "inherit",
      height: "inherit",
      borderRadius: 5
    }
  },
  replyUsername: {
    cursor: "pointer",
    display: "inline-block",
    margin: theme.spacing(0, 0, 1),
    fontSize: fontsize.small
  },
  replyTime: {
    fontSize: fontsize.xsmall,
    color: `#ABABAD !important`,
    marginLeft: 5
  },
  replyUserText: {
    fontSize: fontsize.small,
    "& p": {
      margin: 0
    }
  },
  replyMoreIcon: {
    color: color.white,
    fontSize: fontsize.large,
    display: "none"
  }
}));

export default React.memo(Reply);
