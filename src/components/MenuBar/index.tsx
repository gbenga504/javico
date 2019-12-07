import React, { useState, useEffect } from 'react';
import { Tooltip } from '@material-ui/core';

import './index.css';
import { Typography, Icon } from '../../atoms';

const doc: any = window.document;
const docEl: any = doc.documentElement;

const requestFullScreen =
  docEl.requestFullscreen ||
  docEl.mozRequestFullScreen ||
  docEl.webkitRequestFullScreen ||
  docEl.msRequestFullscreen;
const cancelFullScreen =
  doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
const notFullScreen = () =>
  !doc.fullscreenElement &&
  !doc.mozFullScreenElement &&
  !doc.webkitFullscreenElement &&
  !doc.msFullscreenElement;

const iconList = (screenSize: boolean) => [
  { text: 'Search file', action: '', icon: 'ios-search' },
  {
    text: screenSize ? 'Make full screen' : 'Resize screen',
    action: 'toggleFullScreen',
    icon: screenSize ? 'ios-expand' : 'ios-contract',
  },
  { text: 'Share code', action: '', icon: 'ios-share-alt' },
  { text: 'Sign in', action: '', icon: 'logo-github' },
  { text: 'Light theme', action: '', icon: 'ios-bulb' },
];

const MenuBar: React.FC = () => {
  const [fullScreen, toggleFullScreen] = useState(notFullScreen());

  useEffect(() => {
    window.addEventListener('resize', function() {
      if (window.screen.height !== window.innerHeight) {
        toggleFullScreen(notFullScreen());
      }
    });
    return () => {
      window.removeEventListener('resize', () => null);
    };
  }, []);

  function handleToggleFullScreen() {
    if (fullScreen) {
      requestFullScreen.call(docEl).then(() => toggleFullScreen(!fullScreen));
    } else {
      if (cancelFullScreen) {
        cancelFullScreen.call(doc).then(() => toggleFullScreen(!fullScreen));
      }
    }
  }

  function triggerAction(action: string) {
    switch (action) {
      case 'toggleFullScreen':
        handleToggleFullScreen();
        break;
      default:
        break;
    }
  }

  return (
    <section className="menubar flex-column">
      <Tooltip title={'placement.js'} placement="bottom" enterDelay={100}>
        <div className="menubar__title flex-column center mt-16 mb-8">
          <div className="menubar__title-text flex-column center">
            <Typography thickness="semi-bold">P</Typography>
          </div>
        </div>
      </Tooltip>
      {iconList(fullScreen).map(el => {
        return (
          <div key={el.icon} className="menubar__icon" onClick={() => triggerAction(el.action)}>
            <Tooltip title={el.text} placement="bottom" enterDelay={100}>
              <span style={{ display: 'flex' }}>
                <Icon name={el.icon} />
              </span>
            </Tooltip>
          </div>
        );
      })}
    </section>
  );
};

export default React.memo(MenuBar);
