import React, { useState, useEffect } from 'react';
import { makeStyles, Menu, MenuItem, CircularProgress } from '@material-ui/core';

import { useStyles as commonUseStyles, padding, color, fontsize } from '../../Css';
import { Typography, Icon } from '../../atoms';
import Reply from './Reply';
import SyntaxHighlighter from '../SyntaxHighlighter';
import DeleteMessageModal from '../DeleteMessageModal';
import EditMessagePanel from '../EditMessagePanel';
import { parseTime } from '../../utils/TimeUtils';
import { IReply } from '../../services/CommentReplyServices';

interface IProps {
  text: any;
  codeReference?: string;
  id: string;
  authorName: string;
  authorPhotoURL: string;
  createdAt: string;
  numReplies: number;
  onHandleReply: (comment: string) => void;
}

const Comment: React.FC<IProps> = ({
  text,
  codeReference,
  id,
  authorName,
  authorPhotoURL,
  numReplies,
  createdAt,
  onHandleReply,
}) => {
  const [isRepliesVisible, setIsRepliesVisible] = useState<boolean>(false);
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | HTMLElement>(null);
  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState<boolean>(false);
  const [isDeleteCommentLoading, setIsDeleteCommentLoading] = useState<boolean>(false);
  const [editableComment, setEditableComment] = useState<string>(text);
  const [isEditMessagePanelVisible, setIsEditMessagePanelVisible] = useState<boolean>(false);
  const [isEditingComment, setIsEditingComment] = useState<boolean>(false);
  const [replies, setReplies] = useState<Array<IReply>>([]);
  const [isRepliesLoading, setIsRepliesLoading] = useState<boolean>(false);
  const commonCss = commonUseStyles();
  const classes = useStyles();

  useEffect(() => {
    if (isRepliesVisible === true && replies && replies.length === 0) {
      /**
       * @todo
       * Fetch the initial replies and setIsRepliesLoading and setReplies
       */
      setIsRepliesLoading(true);
      setReplies([]);
    }
  }, [isRepliesVisible, replies]);

  function handleToggleRepliesVisibility() {
    setIsRepliesVisible(prevIsRepliesVisible => !prevIsRepliesVisible);
  }

  function handleShowOptions(event: React.MouseEvent<HTMLButtonElement>) {
    setOptionsAnchorEl(event.currentTarget);
  }

  function handleCloseOptions() {
    setOptionsAnchorEl(null);
  }

  function handleReplyComment(text: string) {
    onHandleReply(text);
    handleCloseOptions();
  }

  function handleCloseConfirmDeleteModal() {
    setIsConfirmDeleteModalVisible(false);
  }

  function handleOpenConfirmDeleteModal() {
    handleCloseOptions();
    setIsConfirmDeleteModalVisible(true);
  }

  function handleDeleteComment() {
    setIsDeleteCommentLoading(true);
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
    setIsEditingComment(true);
  }

  function handleLoadMoreReplies() {
    /**
     * @todo
     * Load more replies
     * setReplies and setIsRepliesLoading function
     */
  }

  function renderMenuOptions() {
    return (
      <Menu
        anchorEl={optionsAnchorEl}
        keepMounted
        open={Boolean(optionsAnchorEl)}
        onClose={handleCloseOptions}>
        <MenuItem onClick={() => handleReplyComment(text)}>Reply</MenuItem>
        <MenuItem onClick={handleOpenEditMessagePanel}>Edit</MenuItem>
        <MenuItem onClick={handleOpenConfirmDeleteModal}>Delete</MenuItem>
      </Menu>
    );
  }

  function renderShowMoreRepliesButton() {
    return (
      <div onClick={handleLoadMoreReplies} className={classes.commentReplyActionButtonContainer}>
        <Icon name="ios-return-right" />
        <Typography thickness="semi-bold">Show more replies</Typography>
      </div>
    );
  }

  function renderReplies() {
    return (
      <>
        <div
          onClick={handleToggleRepliesVisibility}
          className={classes.commentReplyActionButtonContainer}>
          <Icon name={isRepliesVisible === true ? 'ios-arrow-up' : 'ios-arrow-down'} />
          <Typography thickness="semi-bold">
            {isRepliesVisible === true ? 'Hide' : 'View'} {numReplies} replies
          </Typography>
        </div>
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
              />
            );
          })}
        {replies.length < numReplies && isRepliesLoading === false && renderShowMoreRepliesButton()}
        {isRepliesLoading === true && <CircularProgress color="primary" size={20} />}
      </>
    );
  }

  function renderComment() {
    return (
      <>
        <div
          className={commonCss.flexRow}
          style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography className={classes.commentUsername} thickness="bold" variant="span">
            {authorName}{' '}
            <Typography className={classes.commentTime}>{parseTime(createdAt)}</Typography>
          </Typography>
          <Icon
            name="ios-more"
            className={`${classes.commentMoreIcon} comment__show-more-button`}
            onClick={handleShowOptions}
          />
        </div>
        <Typography className={classes.commentUserComment} variant="span">
          {text}
        </Typography>
      </>
    );
  }

  return (
    <div
      className={`${commonCss.flexColumn} ${commonCss.relative}`}
      style={{ ...padding(16, 'lr'), ...padding(10, 'bt') }}>
      <div className={`${classes.comment} ${commonCss.flexRow}`} key={id}>
        <img className={classes.commentUserImage} src={authorPhotoURL} alt={authorName} />
        <div className={`${commonCss.flexColumn} ${commonCss.fullWidth}`} style={padding(8, 'l')}>
          {isEditMessagePanelVisible === false && renderComment()}
          <EditMessagePanel
            visible={isEditMessagePanelVisible}
            loading={isEditingComment}
            handleValueChange={handleCommentChange}
            value={editableComment}
            onRequestClose={handleCloseEditMessagePanel}
            onEditMessage={handleEditMessage}
          />
        </div>
      </div>
      <div className={classes.commentBottomContainer}>
        {codeReference && (
          <SyntaxHighlighter containerStyle={{ marginTop: 5 }} sourceCode={codeReference} />
        )}
        {numReplies && numReplies > 0 && renderReplies()}
      </div>
      {renderMenuOptions()}
      <DeleteMessageModal
        visible={isConfirmDeleteModalVisible}
        loading={isDeleteCommentLoading}
        onRequestClose={handleCloseConfirmDeleteModal}
        onDeleteMessage={handleDeleteComment}
      />
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  commentBottomContainer: {
    marginLeft: 40,
    display: 'flex',
    flexDirection: 'column',
  },
  commentReplyActionButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginTop: theme.spacing(2),
    '& ion-icon': {
      color: color.themeBlue,
      fontSize: 16,
    },
    '& span': {
      color: `${color.themeBlue} !important`,
      marginLeft: 10,
      fontSize: fontsize.small,
    },
  },
  comment: {
    backgroundColor: 'inherit',
    transition: 'all 0.3s',
    cursor: 'pointer',
    '&:hover': {
      background: '#222529',
    },
    '&:hover .comment__show-more-button': {
      display: 'block',
    },
  },
  commentUserImage: {
    height: 35,
    width: 35,
    borderRadius: 5,
  },
  commentUsername: {
    cursor: 'pointer',
    display: 'inline-block',
    margin: theme.spacing(0, 0, 1),
    fontSize: fontsize.small,
  },
  commentTime: {
    fontSize: fontsize.xsmall,
    color: `#ABABAD !important`,
  },
  commentUserComment: {
    fontSize: fontsize.small + 0.5,
  },
  commentMoreIcon: {
    color: color.white,
    fontSize: fontsize.large,
    display: 'none',
  },
}));

export default Comment;
