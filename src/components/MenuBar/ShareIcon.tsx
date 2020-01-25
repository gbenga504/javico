import React, { useRef, useEffect } from 'react';
import { TwitterShareButton } from 'react-share';

import { useStyles } from './styles';
import { Icon } from '../../atoms';

const ShareIcon: React.FC<{
  showShareOptions: boolean;
  iconName: string;
  onHandleShowShareOptions: any;
  color: string;
  index: any;
}> = ({ showShareOptions, onHandleShowShareOptions, iconName, index, color }) => {
  const shareIconRef = useRef<any>(null);

  useEffect(() => {
    shareIconRef.current.addEventListener('focusout', onHandleShowShareOptions);

    return () => {
      shareIconRef.current.removeEventListener('focusout', onHandleShowShareOptions);
    };
    // eslint-disable-next-line
  }, []);

  const classes = useStyles();
  const DEVELOPER_CODE_URL = 'https://www.google.com'; //@todo This needs to be changed to the actual developer code

  return (
    <div
      ref={ref => (shareIconRef.current = ref)}
      className={`${!!showShareOptions ? classes.showShareOptions : classes.hideShareOptions} ${
        classes.shareCodeOptions
      }`}
      style={{ top: index * 45, animationDelay: `${index * 50}ms` }}>
      <TwitterShareButton url={DEVELOPER_CODE_URL}>
        <button
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

export default ShareIcon;
