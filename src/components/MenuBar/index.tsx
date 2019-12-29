import React, { useState, useEffect } from 'react';
import { Tooltip, Menu, MenuItem, Button } from '@material-ui/core';
import { TwitterShareButton } from 'react-share';

import { useStyles } from './styles';
import { useStyles as commonUseStyles } from '../../Css';
import { Icon, withNotificationBanner } from '../../atoms';
import { withApi } from '../../utils/ApiConnector';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';

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
  { text: 'Share code', action: 'shareCodeViaTwitter', icon: 'ios-share-alt' },
  { text: 'Sign in', action: 'signInWithGithub', icon: 'logo-github' },
  { text: 'Light theme', action: '', icon: 'ios-bulb' },
];

const MenuBar: React.FC<IProps> = ({ Api, onSetNotificationSettings }) => {
  const [fullScreenMode, setFullScreenMode] = useState<boolean>(!!fullScreenEnabled);
  const [menuElement, setMenuElement] = React.useState<null | HTMLElement>(null);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const classes = useStyles();
  const commonCss = commonUseStyles();
  const DEVELOPER_CODE_URL = 'https://www.google.com'; //@todo This needs to be changed to the actual developer code

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

  function triggerAction(action: string) {
    switch (action) {
      case 'toggleFullScreen':
        handleToggleFullScreen();
        break;
      case 'signInWithGithub':
        handleSignInWithGithub();
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
          <div
            key={el.icon}
            className={`${commonCss.flexRow} ${commonCss.center} ${classes.menubarIcon}`}
            onClick={() => triggerAction(el.action)}>
            {el.action === 'shareCodeViaTwitter' ? (
              <TwitterShareButton url={DEVELOPER_CODE_URL}>
                <Tooltip title={el.text} placement="bottom" enterDelay={100}>
                  <span className={commonCss.flexRow}>
                    <Icon name={el.icon} />
                  </span>
                </Tooltip>
              </TwitterShareButton>
            ) : (
              <Tooltip title={el.text} placement="bottom" enterDelay={100}>
                <span className={commonCss.flexRow}>
                  <Icon name={el.icon} />
                </span>
              </Tooltip>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default React.memo(withNotificationBanner(withApi(MenuBar)));
