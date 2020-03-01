import React from 'react';
import { TwitterShareButton } from 'react-share';
import { makeStyles } from '@material-ui/core';
import { Twitter as TwitterIcon, FileCopy as FileCopyIcon } from '@material-ui/icons';

import { getSourcecodeUrl } from '../../utils/UrlUtils';
import { Tooltip } from '@material-ui/core';
import { color } from '../../Css';

interface IProps {
  showShareOptions: boolean | null;
  iconName: string;
  onSetNotificationSettings: any;
  onHandleShowShareOptions: any;
  color: string;
  text: string;
  index: any;
}

const ShareIcon: React.FC<IProps> = ({
  showShareOptions,
  onHandleShowShareOptions,
  onSetNotificationSettings,
  text,
  iconName,
  index,
  color,
}) => {
  const classes = useStyles();
  const DEVELOPER_CODE_URL = getSourcecodeUrl();

  function copyToClipboard(e: any) {
    if (document) {
      var aux = document.createElement('input');

      aux.setAttribute('value', DEVELOPER_CODE_URL);

      document.body.appendChild(aux);

      aux.select();

      document.execCommand('copy');

      document.body.removeChild(aux);
      onSetNotificationSettings('Copied to clipboard', 'info', 'long');
      setTimeout(onHandleShowShareOptions, 300);
    }
  }

  return (
    <Tooltip title={text} leaveDelay={50} placement="bottom" enterDelay={50}>
      <div
        className={`${
          showShareOptions === null
            ? classes.hideShareicons
            : !!showShareOptions
            ? classes.showShareOptions
            : classes.hideShareOptions
        } ${classes.shareCodeOptions}`}
        style={{ top: index * 45, animationDelay: `${index * 150}ms` }}>
        {iconName === 'ios-copy' ? (
          <button id="shareIcon" className={classes.copyIcon} onClick={copyToClipboard}>
            <FileCopyIcon
              style={{
                color,
                fontSize: 16,
              }}
            />
          </button>
        ) : (
          <TwitterShareButton url={DEVELOPER_CODE_URL}>
            <button id="shareIcon" className={classes.copyIcon}>
              <TwitterIcon
                style={{
                  color,
                  fontSize: 16,
                }}
              />
            </button>
          </TwitterShareButton>
        )}
      </div>
    </Tooltip>
  );
};

const useStyles = makeStyles({
  shareCodeOptions: {
    position: 'absolute',
    zIndex: 10,
  },
  showShareOptions: {
    visibility: 'hidden',
    animationName: `$showShareOptions`,
    animationDuration: '500ms',
    animationTimingFunction: 'cubic-bezier(.57,.43,.57,2.98)',
    animationFillMode: 'forwards',
  },
  hideShareicons: { display: 'none', visibilty: 'hidden' },
  hideShareOptions: {
    left: 50,
    animationName: `$hideShareOptions`,
    animationDuration: '1500ms',
    animationTimingFunction: 'cubic-bezier(.25,-0.95,.54,.94)',
    animationFillMode: 'forwards',
  },
  copyIcon: {
    height: 30,
    width: 30,
    cursor: 'pointer',
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid transparent',
    outline: 'transparent',
    boxShadow: 'none',
    transition: 'all .3s',
    '&:hover': {
      border: `1px solid ${color.themeBlue}`,
      transform: 'scale(1.2)',
      boxShadow: '0 1px 15px 1px rgba(52, 40, 104, 0.08)',
    },
    '&:active': {
      boxShadow: 'none',
      transform: 'scale(1.1)',
    },
  },
  '@keyframes showShareOptions': {
    '0%': {
      opacity: 0,
      left: 25,
    },
    '100%': {
      opacity: 1,
      left: 50,
      visibility: 'visible',
      display: 'block',
    },
  },
  '@keyframes hideShareOptions': {
    '0%': {
      opacity: 1,
      visibility: 'visible',
    },
    '25%': {
      left: 25,
      opacity: 0,
      visibility: 'hidden',
      display: 'none',
    },
    '50%': {
      left: 0,
    },
    '100%': {
      left: 0,
      opacity: 0,
      visibility: 'hidden',
      display: 'none',
    },
  },
});

export default React.memo(ShareIcon);
