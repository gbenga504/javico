import React from 'react';
import { TwitterShareButton } from 'react-share';

import { useStyles } from './styles';
import { Icon } from '../../atoms';
import { getSourcecodeUrl } from '../../utils/UrlUtils';

const ShareIcon: React.FC<{
  showShareOptions: boolean | null;
  iconName: string;
  color: string;
  index: any;
}> = ({ showShareOptions, iconName, index, color }) => {
  const classes = useStyles();
  const DEVELOPER_CODE_URL = getSourcecodeUrl();

  return (
    <div
      className={`${
        showShareOptions === null
          ? classes.hideShareicons
          : !!showShareOptions
          ? classes.showShareOptions
          : classes.hideShareOptions
      } ${classes.shareCodeOptions}`}
      style={{ top: index * 45, animationDelay: `${index * 150}ms` }}>
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
    </div>
  );
};

export default React.memo(ShareIcon);
