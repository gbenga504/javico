import React from 'react';
import { makeStyles } from '@material-ui/core';

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
          <Icon name="ios-more" className={`${classes.replyMoreIcon} reply__show-more-button`} />
        </div>
        <Typography className={classes.replyUserText} variant="span">
          {reply.comment}
        </Typography>
      </div>
    </div>
  );
};

export default Reply;
