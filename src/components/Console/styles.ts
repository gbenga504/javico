import { makeStyles } from '@material-ui/core';

import { color, fontsize } from '../../Css';

export const useStyles = makeStyles(theme => ({
  console: {
    height: '100vh',
    backgroundColor: color.darkThemeBlack,
    '&>div:first-child': {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      paddingRight: theme.spacing(25),
    },
  },
  consoleTerminalBasedActionsContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  consoleTerminalClearIcon: {
    color: color.white,
    fontSize: 16,
    cursor: 'pointer',
  },
  consoleSection: {
    width: '100%',
    height: 'calc(100% - 48px)',
    position: 'relative',
    overflowY: 'scroll',
    borderTop: `1px solid ${color.darkThemeLightBorder}`,
    fontSize: `${fontsize.terminal}px !important`,
  },
  consoleTab: {
    color: color.white,
  },
  consoleReadMeTextarea: {
    width: '100%',
    height: '100%',
    fontSize: fontsize.base,
    resize: 'none',
    background: 'transparent',
    outline: 'none',
    color: color.white,
    padding: theme.spacing(2),
  },
  consolePreview: {
    padding: theme.spacing(2),
    color: color.white,
    width: '100%',
    height: '100%',
    fontSize: fontsize.base,
  },
  saveReadmeButton: {
    margin: theme.spacing(1),
    fontSize: fontsize.xsmall,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
}));
