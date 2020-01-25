import { makeStyles } from '@material-ui/core';

import { color, fontsize } from '../../Css';

export const useStyles = makeStyles(theme => ({
  menubarContainer: {
    width: 56,
    height: '100vh',
    backgroundColor: color.deepBlue,
    color: color.white,
    textAlign: 'center',
    alignItems: 'center',
  },
  menubarTitle: {
    backgroundColor: color.black,
    borderRadius: 5,
    boxShadow: `0 0 0 2pt ${color.white}`,
    height: 40,
    width: 40,
    textAlign: 'center',
    fontSize: fontsize.large,
    color: color.white,
    margin: theme.spacing(4, 0, 2),
    padding: 2,
  },
  menubarTitleText: {
    backgroundColor: color.themeBlue,
    borderRadius: 5,
    width: 36,
    height: 36,
  },
  menubarUser: {
    borderRadius: 5,
    width: 36,
    height: 36,
  },
  menubarIcon: {
    width: 56,
    height: 56,
    fontSize: 25,
    color: color.darkThemeMenubarIcon,
    cursor: 'pointer',
    textAlign: 'center',
    '&:hover': {
      color: color.white,
    },
  },
  shareCodeOptions: {
    position: 'absolute',
    zIndex: 10,
  },
  showShareOptions: {
    left: 50,
    animationName: `$showShareOptions`,
    animationDuration: '1000ms',
    animationTimingFunction: 'cubic-bezier(.57,.43,.57,1.98)',
  },
  hideShareOptions: {
    left: -50,
    opacity: 0,
    visibility: 'hidden',
    animationName: `$hideShareOptions`,
    animationDuration: '1000ms',
    animationTimingFunction: 'cubic-bezier(.25,-0.95,.54,.94)',
  },
  copyIcon: {
    height: 35,
    width: 35,
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid transparent',
    boxShadow: 'none',
    transition: 'all .3s',
    '&:hover': {
      border: `1px solid ${color.themeBlue}`,
      transform: 'scale(1.2)',
      boxShadow: '0 1px 15px 1px rgba(52, 40, 104, 0.08)',
    },
    '&:active': {
      boxShadow: 'none',
    },
  },
  '@keyframes showShareOptions': {
    '0%': {
      opacity: 0,
      left: -50,
      visibility: 'hidden',
    },
    '50%': {
      left: 0,
      visibility: 'hidden',
    },
    '75%': {
      opacity: 0,
      left: 25,
    },
    '100%': {
      opacity: 1,
      left: 50,
    },
  },
  '@keyframes hideShareOptions': {
    '0%': {
      opacity: 1,
      left: 50,
    },
    '25%': {
      opacity: 0,
    },
    '50%': {
      left: 0,
      opacity: 0,
    },
    '100%': {
      opacity: 0,
      left: -50,
    },
  },
}));
