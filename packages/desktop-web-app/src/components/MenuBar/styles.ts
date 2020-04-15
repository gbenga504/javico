import { makeStyles } from "@material-ui/core";

import { fontsize, color } from "@javico/common/lib/design-language/Css";

export const useStyles = makeStyles(theme => ({
  menubarContainer: {
    width: 56,
    height: "100vh",
    backgroundColor: color.deepBlue,
    color: color.white,
    textAlign: "center",
    alignItems: "center"
  },
  menubarTitle: {
    backgroundColor: color.black,
    borderRadius: 5,
    boxShadow: `0 0 0 2pt ${color.white}`,
    height: 40,
    width: 40,
    textAlign: "center",
    fontSize: fontsize.large,
    color: color.white,
    margin: theme.spacing(4, 0, 2),
    padding: 2
  },
  menubarTitleText: {
    backgroundColor: color.themeBlue,
    borderRadius: 5,
    width: 36,
    height: 36
  },
  menubarUser: {
    borderRadius: 5,
    width: 36,
    height: 36
  },
  menubarIcon: {
    width: 56,
    height: 56,
    fontSize: 25,
    color: color.darkThemeMenubarIcon,
    cursor: "pointer",
    textAlign: "center",
    "&:hover": {
      color: color.white
    }
  }
}));
