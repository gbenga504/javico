import React, { useState, useEffect } from 'react';
import { Tooltip, Menu, MenuItem, Button } from '@material-ui/core';

import { useStyles } from './styles';
import { useStyles as commonUseStyles, color } from '../../Css';
import { Icon, withNotificationBanner } from '../../atoms';
import { withApi } from '../../utils/ApiConnector';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';
import ShareIcon from './ShareIcon';

interface IProps {
  Api: any;
  onSetNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
}

const doc: any = window.document;
const docEl: any = doc.documentElement;

const requestFullScreen =
  docEl.requestFullscreen ||
  docEl.mozRequestFullScreen ||
  docEl.webkitRequestFullScreen ||
  docEl.msRequestFullscreen;
const cancelFullScreen =
  doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
const fullScreenEnabled =
  doc.fullscreenElement ||
  doc.mozFullscreenElement ||
  doc.webkitFullscreenElement ||
  doc.msFullscreenElement;

const iconList = (fullScreenMode: boolean) => [
  { text: 'Search file', action: '', icon: 'ios-search' },
  {
    text: fullScreenMode === false ? 'Make full screen' : 'Resize screen',
    action: 'toggleFullScreen',
    icon: fullScreenMode === false ? 'ios-expand' : 'ios-contract',
  },
  { text: 'Share code', action: 'toggleCodeOptions', icon: 'ios-share-alt' },
  { text: 'Sign in', action: 'signInWithGithub', icon: 'logo-github' },
  { text: 'Light theme', action: '', icon: 'ios-bulb' },
];

const shareOptionsList = [
  { name: 'twitter', color: color.themeBlue, iconName: 'logo-twitter' },
  { name: 'copy', color: '#0c85b2', iconName: 'ios-copy' },
  { name: 'twitter', color: color.themeBlue, iconName: 'logo-twitter' },
  { name: 'copy', color: '#0c85b2', iconName: 'ios-copy' },
];

const MenuBar: React.FC<IProps> = ({ Api, onSetNotificationSettings }) => {
  const [fullScreenMode, setFullScreenMode] = useState<boolean>(!!fullScreenEnabled);
  const [showShareOptions, setShowShareOptions] = useState<boolean | null>(null);
  const [menuElement, setMenuElement] = React.useState<null | HTMLElement>(null);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const classes = useStyles();
  const commonCss = commonUseStyles();

  useEffect(() => {
    window.addEventListener('resize', function() {
      if (window.screen.height !== window.innerHeight) {
        setFullScreenMode(false);
      }
    });
    return () => {
      window.removeEventListener('resize', () => null);
    };
  }, []);

  useEffect(() => {
    Api.onAuthStateChanged(function(user: any) {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, [Api]);

  function handleOpenMenu(event: React.MouseEvent<HTMLElement>) {
    setMenuElement(event.currentTarget);
  }

  function handleCloseMenu() {
    setMenuElement(null);
  }

  function handleToggleFullScreen() {
    if (fullScreenMode === false) {
      requestFullScreen.call(docEl).then(() => setFullScreenMode(true));
    } else {
      if (cancelFullScreen) {
        cancelFullScreen.call(doc).then(() => setFullScreenMode(false));
      }
    }
  }

  function handleSignInWithGithub() {
    Api.signInWithGithub()
      .then(function(result: any) {
        /**
         * @todo
         * Save the users code in firestore
         */
      })
      .catch(function(error: any) {
        onSetNotificationSettings(error.message, 'danger', 'long');
      });
  }

  function handleLogout() {
    Api.logout()
      .then(function() {
        setCurrentUser(null);
        handleCloseMenu();
      })
      .catch(function(error: any) {
        onSetNotificationSettings(error.message, 'danger', 'long');
      });
  }

  function handleShowShareOptions() {
    setShowShareOptions(!showShareOptions);
  }

  function triggerAction(action: string) {
    switch (action) {
      case 'toggleFullScreen':
        handleToggleFullScreen();
        break;
      case 'signInWithGithub':
        handleSignInWithGithub();
        break;
      case 'toggleCodeOptions':
        handleShowShareOptions();
        break;
      default:
        break;
    }
  }

  return (
    <section className={`${classes.menubarContainer} ${commonCss.flexColumn}`}>
      {!!currentUser === true && (
        <Button onClick={handleOpenMenu}>
          <div className={`${classes.menubarTitle} ${commonCss.flexColumn}`}>
            <img src={currentUser.photoURL} alt="Current User" className={classes.menubarUser} />
          </div>
        </Button>
      )}
      <Menu
        id="current-user-menu"
        anchorEl={menuElement}
        keepMounted
        open={Boolean(menuElement)}
        onClose={handleCloseMenu}>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      {iconList(fullScreenMode).map(el => {
        return el.text === 'Sign in' && !!currentUser === true ? null : (
          <div style={{ position: 'relative' }}>
            <div
              key={el.icon}
              className={`${commonCss.flexRow} ${commonCss.center} ${classes.menubarIcon}`}
              onClick={() => triggerAction(el.action)}>
              <Tooltip title={el.text} leaveDelay={300} placement="bottom" enterDelay={100}>
                <span className={commonCss.flexRow}>
                  <Icon name={el.icon} />
                </span>
              </Tooltip>
            </div>
            {el.action === 'toggleCodeOptions' &&
              shareOptionsList.map((el, i) => {
                return (
                  <ShareIcon
                    key={i}
                    index={i}
                    iconName={el.iconName}
                    color={el.color}
                    showShareOptions={showShareOptions}
                  />
                );
              })}
          </div>
        );
      })}
    </section>
  );
};

export default React.memo(withNotificationBanner(withApi(MenuBar)));
