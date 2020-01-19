import React, { useState } from 'react';
import { makeStyles, Menu, MenuItem } from '@material-ui/core';

import { useStyles as commonUseStyles, padding, color, fontsize } from '../../Css';
import { Typography, Icon } from '../../atoms';
import DeleteMessageModal from '../DeleteMessageModal';
import EditMessagePanel from '../EditMessagePanel';
import { parseTime } from '../../utils/TimeUtils';

interface IProps {
  id: string;
  authorName: string;
  authorPhotoURL: string;
  text: string;
  createdAt: string;
}

const Reply: React.FC<IProps> = ({ id, authorName, authorPhotoURL, text, createdAt }) => {
  const classes = useStyles();
  const commonCss = commonUseStyles();
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | HTMLElement>(null);
  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState<boolean>(false);
  const [isDeleteReplyLoading, setIsDeleteReplyLoading] = useState<boolean>(false);
  const [editableReply, setEditableReply] = useState<string>(text);
  const [isEditMessagePanelVisible, setIsEditMessagePanelVisible] = useState<boolean>(false);
  const [isEditingReply, setIsEditingReply] = useState<boolean>(false);

  function handleShowOptions(event: React.MouseEvent<HTMLButtonElement>) {
    setOptionsAnchorEl(event.currentTarget);
  }

  function handleCloseOptions() {
    setOptionsAnchorEl(null);
  }

  function handleCloseConfirmDeleteModal() {
    setIsConfirmDeleteModalVisible(false);
  }

  function handleOpenConfirmDeleteModal() {
    handleCloseOptions();
    setIsConfirmDeleteModalVisible(true);
  }

  function handleDeleteReply() {
    setIsDeleteReplyLoading(true);
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
    setIsEditingReply(true);
  }

  function renderMenuOptions() {
    return (
      <Menu
        anchorEl={optionsAnchorEl}
        keepMounted
        open={Boolean(optionsAnchorEl)}
        onClose={handleCloseOptions}>
        <MenuItem onClick={handleOpenEditMessagePanel}>Edit</MenuItem>
        <MenuItem onClick={handleOpenConfirmDeleteModal}>Delete</MenuItem>
      </Menu>
    );
  }

  function renderReply() {
    return (
      <>
        <img className={classes.replyUserImage} src={authorPhotoURL} alt={authorName} />
        <div className={commonCss.flexColumn} style={padding(8, 'l')}>
          <div
            className={commonCss.flexRow}
            style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography className={classes.replyUsername} thickness="bold" variant="span">
              {authorName}{' '}
              <Typography className={classes.replyTime}>{parseTime(createdAt)}</Typography>
            </Typography>
            <Icon
              name="ios-more"
              className={`${classes.replyMoreIcon} reply__show-more-button`}
              onClick={handleShowOptions}
            />
          </div>
          <Typography className={classes.replyUserText} variant="span">
            {text}
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
        loading={isEditingReply}
        handleValueChange={handleReplyChange}
        value={editableReply}
        onRequestClose={handleCloseEditMessagePanel}
        onEditMessage={handleEditMessage}
      />
      {renderMenuOptions()}
      <DeleteMessageModal
        visible={isConfirmDeleteModalVisible}
        loading={isDeleteReplyLoading}
        onRequestClose={handleCloseConfirmDeleteModal}
        onDeleteMessage={handleDeleteReply}
      />
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  reply: {
    backgroundColor: 'inherit',
    transition: 'all 0.3s',
    cursor: 'pointer',
    marginTop: 10,
    '&:hover': {
      background: '#222529',
    },
    '&:hover .reply__show-more-button': {
      display: 'block',
    },
  },
  replyUserImage: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  replyUsername: {
    cursor: 'pointer',
    display: 'inline-block',
    margin: theme.spacing(0, 0, 1),
    fontSize: fontsize.small,
  },
  replyTime: {
    fontSize: fontsize.xsmall,
    color: `#ABABAD !important`,
  },
  replyUserText: {
    fontSize: fontsize.small,
  },
  replyMoreIcon: {
    color: color.white,
    fontSize: fontsize.large,
    display: 'none',
  },
}));

export default Reply;
