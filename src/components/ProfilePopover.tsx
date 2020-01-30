import React from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

interface IProps {
  anchorEl: any;
  onHandlePopoverClose: any;
}

const ProfilePopover: React.FC<IProps> = ({ anchorEl, onHandlePopoverClose }) => {
  const classes = useStyles();

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    console.log('yes oooooo');
  };

  return (
    <Popover
      id="mouse-over-popover"
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={onHandlePopoverClose}
      disableRestoreFocus>
      <div onClick={handlePopoverOpen} onMouseOver={handlePopoverOpen}>
        <Typography>I use Popover.</Typography>
      </div>
    </Popover>
  );
};

export default ProfilePopover;
