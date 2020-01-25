import React, { useEffect, useState, useRef } from 'react';
import { Paper, makeStyles } from '@material-ui/core';

import { Icon, Typography } from '../index';
import { INotificationBannerProps } from './typeDefinition';
import { color, fontsize } from '../../Css';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'absolute',
    bottom: -100,
    right: 10,
    padding: 15,
    maxWidth: 350,
    minHeight: 50,
    zIndex: 1000,
    background: color.darkThemeBlack,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    transition: 'bottom 1s',
    '& ion-icon': {
      fontSize: fontsize.xlarge,
      color: color.white,
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
    fontSize: fontsize.xsmall,
    marginLeft: theme.spacing(2),
  },
})) as any;

const DefaultNotificationView: React.FC<INotificationBannerProps> = ({
  style,
  text,
  id,
  duration = 'short',
}) => {
  const [isBannerHidden, setIsBannerHidden] = useState<boolean>(true);
  const bannerTimerRef = useRef<any>(null);
  const classes = useStyles();

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
        return { background: color.alertDanger };
      case 'warning':
        return { background: color.warningLight };
      case 'success':
        return { background: color.success };
      case 'info':
      default:
        return { background: color.themeBlue };
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
        {renderIcon('ios-alert', { color: style === 'info' ? color.white : color.white })}
        <Typography className={classes.text}>{text}</Typography>
      </div>
      <span>{renderIcon('ios-close', null, handleCloseBanner)}</span>
    </Paper>
  );
};

export default DefaultNotificationView;
