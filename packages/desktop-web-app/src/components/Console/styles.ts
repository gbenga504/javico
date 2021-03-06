import { makeStyles } from "@material-ui/core";

import { color, fontsize } from "@javico/common/lib/design-language/Css";

export const useStyles = makeStyles(theme => ({
  console: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: color.deepBlue,
    "&>div:first-child": {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      paddingRight: theme.spacing(25)
    }
  },
  consoleTerminalBasedActionsContainer: {
    display: "flex",
    alignItems: "center"
  },
  consoleSection: {
    width: "100%",
    flex: 1,
    minHeight: "20%",
    position: "relative",
    overflowY: "scroll",
    borderTop: `1px solid ${color.darkThemeDarkBorder}`,
    fontSize: `${fontsize.terminal}px !important`
  },
  terminalSection: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflowY: "scroll",
    borderTop: `1px solid ${color.darkThemeLightBorder}`,
    fontSize: `${fontsize.terminal}px !important`,
    padding: 5
  }
}));
