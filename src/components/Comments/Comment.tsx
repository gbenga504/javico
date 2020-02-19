import React, { useState, useEffect } from 'react';
import { makeStyles, Menu, MenuItem } from '@material-ui/core';

import { useStyles as commonUseStyles, padding, color, fontsize } from '../../Css';
import { Typography, Icon, withNotificationBanner } from '../../atoms';
import SyntaxHighlighter from '../SyntaxHighlighter';
import DeleteMessageModal from '../DeleteMessageModal';
import EditMessagePanel from '../EditMessagePanel';
import { parseTime } from '../../utils/TimeUtils';
import CommentReplyService, { IReply } from '../../services/CommentReplyServices';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';
import CommentService from '../../services/CommentsServices';
import CommentUtils from '../../utils/CommentUtils';
import MarkdownRenderer from '../MarkDownRenderer';
import Replies from './Replies';

interface IProps {
  text: string;
  codeReference?: string;
  id: string;
  authorName: string;
  authorPhotoURL: string;
  createdAt: number;
  numReplies: number;
  onHandleReply: (comment: string, commentId: string) => void;
  onSetNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
  sourceCodeId: string;
  userId: string;
  authorId: string;
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
  sourceCodeId,
  onSetNotificationSettings,
  userId,
  authorId,
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
       * Fetch the initial replies and setIsRepliesLoading and setReplies
       */
      setIsRepliesLoading(true);
      CommentReplyService.onSnapshotChanged(
        {
          params: { sourceCodeID: sourceCodeId, limit: 10, commentID: id },
        },
        function(querySnapshot: Array<any>) {
          const { replies } = CommentUtils.parseReplies(querySnapshot, id);
          setIsRepliesLoading(false);
          setReplies(replies);
        },
        function(error: any) {
          onSetNotificationSettings(error, 'danger', 'long');
        },
      );
    }
    // eslint-disable-next-line
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
    onHandleReply(text, id);
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
    CommentService.deleteComment({ params: { sourceCodeID: sourceCodeId, ID: id } })
      .then(res => {
        setIsDeleteCommentLoading(false);
        setIsConfirmDeleteModalVisible(false);
      })
      .catch(error => {
        onSetNotificationSettings(error, 'danger', 'long');
      });
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
    if (text.trim() === editableComment.trim()) {
      handleCloseEditMessagePanel();
      return;
    }
    setIsEditingComment(true);
    CommentService.updateComment({
      data: { text: editableComment.trim() },
      params: { sourceCodeID: sourceCodeId, ID: id },
    })
      .then(res => {
        setIsEditingComment(false);
        setIsEditMessagePanelVisible(false);
      })
      .catch(error => {
        onSetNotificationSettings(error, 'danger', 'long');
      });
  }

  function renderMenuOptions() {
    return (
      <Menu
        anchorEl={optionsAnchorEl}
        keepMounted
        open={Boolean(optionsAnchorEl)}
        onClose={handleCloseOptions}>
        <MenuItem onClick={() => handleReplyComment(text)}>Reply</MenuItem>
        {authorId === userId && <MenuItem onClick={handleOpenEditMessagePanel}>Edit</MenuItem>}
        {authorId === userId && <MenuItem onClick={handleOpenConfirmDeleteModal}>Delete</MenuItem>}
      </Menu>
    );
  }

  function renderComment() {
    return (
      <>
        <div
          className={commonCss.flexRow}
          style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography className={classes.commentUsername} thickness="bold" variant="span">
            {!!authorName ? authorName : 'Anonymous'}{' '}
            <Typography className={classes.commentTime}>{parseTime(createdAt)}</Typography>
          </Typography>
          <Icon
            name="ios-more"
            className={`${classes.commentMoreIcon} comment__show-more-button`}
            onClick={handleShowOptions}
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
      style={{ ...padding(16, 'lr'), ...padding(10, 'bt') }}>
      <div className={`${classes.comment} ${commonCss.flexRow}`} key={id}>
        <img className={classes.commentUserImage} src={authorPhotoURL} alt={authorName} />
        <div className={`${commonCss.flexColumn} ${commonCss.fullWidth}`} style={padding(8, 'l')}>
          {isEditMessagePanelVisible === false && renderComment()}
          <EditMessagePanel
            visible={isEditMessagePanelVisible}
            loading={isEditingComment}
            onHandleValueChange={handleCommentChange}
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
        {!!numReplies === true && numReplies > 0 && (
          <Replies
            onHandleToggleRepliesVisibility={handleToggleRepliesVisibility}
            classes={classes}
            numReplies={numReplies}
            replies={replies}
            sourceCodeId={sourceCodeId}
            setIsRepliesLoading={setIsRepliesLoading}
            isRepliesLoading={isRepliesLoading}
            isRepliesVisible={isRepliesVisible}
            setReplies={setReplies}
            commentId={id}
            userId={userId}
          />
        )}
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
    fontSize: fontsize.small,
  },
  commentTime: {
    fontSize: fontsize.xsmall,
    color: `#ABABAD !important`,
    marginLeft: 5,
  },
  commentUserComment: {
    fontSize: fontsize.small + 0.5,
    '& p': {
      margin: 0,
    },
  },
  commentMoreIcon: {
    color: color.white,
    fontSize: fontsize.large,
    display: 'none',
  },
  repliesReply: {
    willChange: 'height',
    display: 'block',
    // -webkit-transition: height 0.4s cubic-bezier(0.65, 0.05, 0.36, 1);
    transition: 'height 0.4s cubic-bezier(0.65, 0.05, 0.36, 1)',
  },
}));

export default withNotificationBanner(React.memo(Comment));
