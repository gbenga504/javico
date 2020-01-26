import React from 'react';
import { TwitterShareButton } from 'react-share';

import { useStyles } from './styles';
import { Icon } from '../../atoms';
import { getSourcecodeUrl } from '../../utils/UrlUtils';
import { Tooltip } from '@material-ui/core';

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
          <button
            id="shareIcon"
            className={classes.copyIcon}
            onClick={copyToClipboard}
            style={{
              color,
              fontSize: 16,
            }}>
            <Icon name={iconName} />
          </button>
        ) : (
          <TwitterShareButton url={DEVELOPER_CODE_URL}>
            <button
              id="shareIcon"
              className={classes.copyIcon}
              style={{
                color,
                fontSize: 16,
              }}>
              <Icon name={iconName} />
            </button>
          </TwitterShareButton>
        )}
      </div>
    </Tooltip>
  );
};

export default React.memo(ShareIcon);
