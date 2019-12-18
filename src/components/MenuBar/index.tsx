import React, { useState, useEffect } from 'react';
import { Tooltip, Menu, MenuItem, Button } from '@material-ui/core';

import './index.css';
import { Icon, withNotificationBanner } from '../../atoms';
import { withFirebase } from '../../utils/FirebaseConnector';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';

interface IProps {
  firebase: any;
  setNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
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
  { text: 'Share code', action: '', icon: 'ios-share-alt' },
  { text: 'Sign in', action: 'signInWithGithub', icon: 'logo-github' },
  { text: 'Light theme', action: '', icon: 'ios-bulb' },
];

const MenuBar: React.FC<IProps> = ({ firebase, setNotificationSettings }) => {
  const [fullScreenMode, setFullScreenMode] = useState<boolean>(!!fullScreenEnabled);
  const [menuElement, setMenuElement] = React.useState<null | HTMLElement>(null);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

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
    firebase.onAuthStateChanged(function(user: any) {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, [firebase]);

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
    firebase
      .signInWithGithub()
      .then(function(result: any) {
        /**
         * @todo
         * Save the users code in firestore
         */
      })
      .catch(function(error: any) {
        setNotificationSettings(error.message, 'danger', 'long');
      });
  }

  function handleLogout() {
    firebase
      .logout()
      .then(function() {
        setCurrentUser(null);
        handleCloseMenu();
      })
      .catch(function(error: any) {
        setNotificationSettings(error.message, 'danger', 'long');
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
    <section className="menubar-container flex-column">
      {!!currentUser === true && (
        <Button onClick={handleOpenMenu}>
          <div className="menubar__title flex-column center mt-16 mb-8">
            <img src={currentUser.photoURL} alt="Current User" className="menubar__user" />
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
            className="flex-row center menubar__icon"
            onClick={() => triggerAction(el.action)}>
            <Tooltip title={el.text} placement="bottom" enterDelay={100}>
              <span className="flex-row">
                <Icon name={el.icon} />
              </span>
            </Tooltip>
          </div>
        );
      })}
    </section>
  );
};

export default React.memo(withNotificationBanner(withFirebase(MenuBar)));
