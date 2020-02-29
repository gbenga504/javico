import React from "react";
import { makeStyles } from "@material-ui/core";

import { color, useStyles as commonUseStyles, fontsize } from "../Css";
import { Typography } from "../atoms";
import ErrorImage from "../assets/images/mobile-not-optimized.png";

const NotOptimizedForMobile: React.FC = () => {
  const classes = useStyles();
  const commonCss = commonUseStyles();

  return (
    <div
      className={`${classes.container} ${commonCss.fullHeightAndWidth} ${commonCss.flexColumn} ${commonCss.center}`}
    >
      <img alt="error" src={ErrorImage} />
      <div
        className={`${classes.textContainer} ${commonCss.flexColumn} ${commonCss.center}`}
      >
        <Typography variant="h1" thickness="semi-bold">
          Oh oh!
        </Typography>
        <Typography>
          Looks like you are using a mobile browser. We are not currently
          optimized for mobile.
        </Typography>
      </div>
      <Typography
        variant="a"
        target="_blank"
        href="https://github.com/gbenga504/javico"
        className={classes.githubLink}
      >
        Github
      </Typography>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    background: color.darkThemeBlack,
    padding: theme.spacing(3)
  },
  textContainer: {
    marginTop: theme.spacing(7),
    "& h1": {
      fontSize: 30,
      margin: 0
    },
    "& span": {
      fontSize: fontsize.base,
      marginTop: theme.spacing(2),
      textAlign: "center"
    }
  },
  githubLink: {
    marginTop: theme.spacing(7),
    fontSize: fontsize.large,
    color: `${color.themeBlue} !important`,
    textDecoration: "underline"
  }
}));

export default React.memo(NotOptimizedForMobile);
