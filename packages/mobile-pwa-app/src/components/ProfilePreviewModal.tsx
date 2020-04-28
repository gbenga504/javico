import React from 'react';
import { makeStyles, withStyles, ButtonBase, Popover as MuiPopover } from '@material-ui/core';
import {
  Close as CloseIcon,
  WbIncandescent as ThemeIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';
import {
  useStyles as commonUseStyles,
  color,
  fontsize,
} from '@javico/common/lib/design-language/Css';
import { Typography } from '@javico/common/lib/components';
import history from '../history';
import { Paths } from '../Routes';

interface IProps {
  isVisible: boolean;
  onRequestClose: () => void;
  id: string | undefined;
  anchorElement: HTMLElement | null;
}

const Popover = withStyles({
  root: {
    background: 'rgba(0,0,0,0.5)',
  },
  paper: {
    width: '100%',
  },
})(MuiPopover);

const ProfilePreviewModal: React.FC<IProps> = ({
  isVisible,
  onRequestClose,
  id,
  anchorElement,
}) => {
  const classes = useStyles();
  const commonCss = commonUseStyles();

  function renderAvatar() {
    return <div className={classes.avatarContainer}></div>;
  }

  function handleNavigateToSettingsView() {
    history.push(Paths.SETTINGS);
  }

  return (
    <Popover
      id={id}
      open={isVisible}
      anchorEl={anchorElement}
      onClose={onRequestClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}>
      <div className={`${classes.addPadding} ${commonCss.flexRow}`}>
        <CloseIcon className={classes.icon} onClick={onRequestClose} />
      </div>
      <div className={`${classes.addPadding} ${commonCss.flexRow}`}>
        {renderAvatar()}
        <div style={{ marginLeft: 8 }} className={commonCss.flexColumn}>
          <Typography thickness="semi-bold" className={classes.text}>
            Gbenga504
          </Typography>
          <Typography className={`${classes.text} ${classes.email}`}>
            daveanifowoshe@gmail.com
          </Typography>
        </div>
      </div>
      <div className={classes.seperator} />
      <ButtonBase className={`${classes.addPadding} ${commonCss.flexRow} ${classes.button}`}>
        <ThemeIcon className={classes.icon} />
        <Typography thickness="semi-bold" className={`${classes.text} ${classes.buttonText}`}>
          Change Theme
        </Typography>
      </ButtonBase>
      <ButtonBase className={`${classes.addPadding} ${commonCss.flexRow} ${classes.button}`}>
        <LogoutIcon className={classes.icon} />
        <Typography thickness="semi-bold" className={`${classes.text} ${classes.buttonText}`}>
          Logout
        </Typography>
      </ButtonBase>
      <div className={classes.seperator} />
      <ButtonBase
        className={`${classes.addPadding} ${commonCss.flexRow} ${classes.button}`}
        onClick={handleNavigateToSettingsView}>
        <SettingsIcon className={classes.icon} />
        <Typography thickness="semi-bold" className={`${classes.text} ${classes.buttonText}`}>
          Settings
        </Typography>
      </ButtonBase>
    </Popover>
  );
};

const useStyles = makeStyles(theme => ({
  addPadding: {
    padding: theme.spacing(2, 3),
  },
  avatarContainer: {
    background: color.imageBackground,
    width: 30,
    height: 30,
    borderRadius: '50%',
    '& img': {
      width: 'inherit',
      height: 'inherit',
      borderRadius: '50%',
    },
  },
  text: {
    color: `${color.gray60} !important`,
    fontSize: fontsize.xsmall,
  },
  email: {
    fontSize: 10,
    marginTop: 2,
  },
  seperator: {
    borderBottom: `1px solid ${color.gray20}`,
  },
  button: {
    justifyContent: 'flex-start',
    width: '100%',
  },
  buttonText: {
    marginLeft: 15,
  },
  icon: {
    fontSize: fontsize.large,
    color: color.gray60,
  },
}));

export default ProfilePreviewModal;
