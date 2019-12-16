import React, { useEffect, useState, useRef } from 'react';
import { Paper, withStyles } from '@material-ui/core';

import { Icon, Typography } from '../index';
import { INotificationBannerProps } from './typeDefinition';

interface IProps extends INotificationBannerProps {
  classes: any;
}

const styles = {
  container: {
    position: 'absolute',
    bottom: -100,
    right: 10,
    padding: 15,
    maxWidth: 350,
    minHeight: 80,
    zIndex: 1000,
    background: '#1e1e1e',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    transition: 'bottom 1s',
    '& ion-icon': {
      fontSize: '20px',
      color: '#fff',
      cursor: 'pointer',
    },
  },
  containerShow: {
    bottom: 10,
  },
  leftContainer: {
    display: 'flex',
  },
  text: {
    fontSize: 12,
    marginLeft: 8,
  },
} as any;

const DefaultNotificationView: React.FC<IProps> = ({
  classes,
  style,
  text,
  id,
  duration = 'short',
}) => {
  const [isBannerHidden, setIsBannerHidden] = useState<boolean>(true);
  const bannerTimerRef = useRef<any>(null);

  useEffect(() => {
    let timeOut = duration === 'short' ? 1000 : 5000;
    setIsBannerHidden(false);
    bannerTimerRef.current = setTimeout(() => {
      setIsBannerHidden(true);
    }, timeOut);

    return () => {
      clearTimeout(bannerTimerRef.current);
    };
    // eslint-disable-next-line
  }, [id]);

  function handleCloseBanner() {
    setIsBannerHidden(true);
    clearTimeout(bannerTimerRef.current);
  }

  function getPaperStyle() {
    switch (style) {
      case 'danger':
        return { background: '#DD2C00' };
      case 'warning':
        return { background: 'rgb(247, 168, 41)' }; //Mapped to --warning-light-color
      case 'success':
        return { background: '#1B5E20' };
      case 'info':
      default:
        return { background: '#1e1e1e' };
    }
  }

  function renderIcon(iconName: string, style?: any, onClick?: Function) {
    return (
      <span>
        <Icon onClick={onClick} className={classes.icon} name={iconName} style={style} />
      </span>
    );
  }

  return (
    <Paper
      style={getPaperStyle()}
      classes={{
        root: `${classes.container} ${isBannerHidden === false && classes.containerShow}`,
      }}>
      <div className={classes.leftContainer}>
        {renderIcon('ios-alert', { color: style === 'info' ? '#0076c6' : '#fff' })}
        <Typography className={classes.text}>{text}</Typography>
      </div>
      <span>{renderIcon('ios-close', null, handleCloseBanner)}</span>
    </Paper>
  );
};

export default withStyles(styles)(DefaultNotificationView);
