import { makeStyles } from '@material-ui/core';

import { color, fontsize } from '../../Css';

export const useStyles = makeStyles({
  console: {
    height: '50vh',
    backgroundColor: color.darkThemeBlack,
  },
  consoleTab: {
    color: color.white,
  },
  consoleTerminal: {
    width: '100%',
    height: 'calc(100% - 48px)',
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
});
