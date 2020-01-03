import { makeStyles } from '@material-ui/core';

import { color, fontsize } from '../../Css';

export const useStyles = makeStyles(theme => ({
  console: {
    height: '50vh',
    backgroundColor: color.darkThemeBlack,
  },
  consoleTab: {
    color: color.white,
  },
  consoleSection: {
    width: '100%',
    height: 'calc(100% - 48px)',
    position: 'relative',
    overflowY: 'scroll',
    borderTop: `1px solid ${color.darkThemeLightBorder}`,
  },
  consoleTerminalLogMessages: {
    padding: '3px 15px',
    borderBottom: `1px solid ${color.darkThemeLightBorder}`,
    fontSize: `${fontsize.terminal}px !important`,
  },
  consoleTerminalWarningMessages: {
    padding: '3px 15px',
    borderBottom: `1px solid ${color.warningLight}`,
    fontSize: `${fontsize.terminal}px !important`,
    whiteSpace: 'pre-wrap',
    background: color.warningDark,
  },
  consoleTerminalWarningIcon: {
    fontSize: fontsize.small,
    marginRight: 6,
    color: color.warningLight,
  },
  consoleTerminalErrorMessages: {
    padding: '3px 15px',
    borderBottom: `1px solid ${color.errorLight}`,
    fontSize: `${fontsize.terminal}px !important`,
    whiteSpace: 'pre-wrap',
    background: color.errorDark,
  },
  consoleTerminalErrorIcon: {
    fontSize: fontsize.base,
    marginRight: 6,
    color: color.errorLight,
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
  },
  saveReadme: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  saveReadmeButton: {
    margin: theme.spacing(1),
    fontSize: 12,
  },
}));
