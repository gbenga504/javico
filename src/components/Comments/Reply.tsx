import React, { useState } from 'react';
import { makeStyles, Menu, MenuItem } from '@material-ui/core';

import { useStyles as commonUseStyles, padding, color, fontsize } from '../../Css';
import { Typography, Icon } from '../../atoms';
import { image } from './comments_dummy';

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

const Reply: React.FC<any> = ({ reply }) => {
  const classes = useStyles();
  const commonCss = commonUseStyles();
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | HTMLElement>(null);

  function handleShowOptions(event: React.MouseEvent<HTMLButtonElement>) {
    setOptionsAnchorEl(event.currentTarget);
  }

  function handleCloseOptions() {
    setOptionsAnchorEl(null);
  }

  function renderMenuOptions() {
    return (
      <Menu
        anchorEl={optionsAnchorEl}
        keepMounted
        open={Boolean(optionsAnchorEl)}
        onClose={handleCloseOptions}>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Delete</MenuItem>
      </Menu>
    );
  }

  return (
    <div className={`${classes.reply} ${commonCss.flexRow}`} key={reply._id}>
      <img className={classes.replyUserImage} src={`${image}`} alt={reply.username} />
      <div className={commonCss.flexColumn} style={padding(8, 'l')}>
        <div
          className={commonCss.flexRow}
          style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography className={classes.replyUsername} thickness="bold" variant="span">
            {reply.username} <Typography className={classes.replyTime}>4.38PM</Typography>
          </Typography>
          <Icon
            name="ios-more"
            className={`${classes.replyMoreIcon} reply__show-more-button`}
            onClick={handleShowOptions}
          />
        </div>
        <Typography className={classes.replyUserText} variant="span">
          {reply.comment}
        </Typography>
      </div>
      {renderMenuOptions()}
    </div>
  );
};

export default Reply;
