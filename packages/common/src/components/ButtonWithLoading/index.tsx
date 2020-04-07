import React from "react";
import { Button, CircularProgress, makeStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { color } from "../../design-language/Css";

interface IProps extends ButtonProps {
  loading: boolean;
}

const ButtonWithLoading: React.FC<IProps> = props => {
  const { loading, children, ...rest } = props;
  const classes = useStyles();

  return (
    <Button
      className={`${classes.button} ${loading && classes.buttonLoading}`}
      color="primary"
      variant="contained"
      {...rest}
    >
      <span
        className={`${classes.content} ${loading && classes.contentLoading}`}
      >
        {children}
      </span>
      {loading === true && (
        <CircularProgress
          color="primary"
          size={14}
          thickness={8}
          classes={{ root: classes.spinner }}
        />
      )}
    </Button>
  );
};

const useStyles = makeStyles(theme => ({
  button: {
    position: "relative",
    transition: "all 0.5s"
  },
  buttonLoading: {},
  content: {
    transition: "0.5s"
  },
  contentLoading: {
    opacity: 0.5
  },
  spinner: {
    position: "absolute",
    top: "30%",
    left: "45%",
    color: color.white
  }
}));

export default ButtonWithLoading;
