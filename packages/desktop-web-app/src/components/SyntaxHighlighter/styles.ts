import { makeStyles } from "@material-ui/core";

import { color, fontsize } from "../../Css";

export const useStyles = makeStyles(theme => ({
  codeContainer: {
    overflow: "scroll",
    height: "auto",
    fontSize: fontsize.xsmall,
    borderRadius: 4,
    border: `1px solid ${color.darkThemeLightBorder}`,
    background: color.deepBlue,
    width: "100%",
    maxHeight: 120,
    minHeight: 40,
    display: "flex"
  },
  lineNumbersContainer: {
    width: 32,
    background: "#212529",
    borderRight: `1px solid ${color.darkThemeLightBorder}`,
    paddingRight: theme.spacing(0.5),
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    height: "100%",
    minHeight: "inherit",
    maxHeight: "inherit"
  },
  lineNumber: {
    color: "#727576 !important",
    fontSize: `${fontsize.xsmall}px !important`
  }
}));
