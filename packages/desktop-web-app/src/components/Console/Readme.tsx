import React from "react";
import { makeStyles } from "@material-ui/core";
import { color, fontsize } from "@javico/common/lib/design-language/Css";
import { ButtonWithLoading } from "@javico/common/lib/components";

const Readme: React.FC<{
  onHandleReadMeTextChange: any;
  isLoading: boolean;
  onSubmitReadme: any;
  readMe: string;
}> = ({ onHandleReadMeTextChange, onSubmitReadme, isLoading, readMe }) => {
  const classes = useStyles();
  return (
    <>
      <textarea
        onChange={onHandleReadMeTextChange}
        required={true}
        className={classes.consoleReadMeTextarea}
        value={readMe}
        autoFocus={true}
        rows={7}
        placeholder="Add a ReadMe (Helps others understand your code. Markdown is supported)"
      ></textarea>
      <ButtonWithLoading
        variant="contained"
        onClick={onSubmitReadme}
        loading={isLoading}
        className={classes.saveReadmeButton}
        color="primary"
      >
        save
      </ButtonWithLoading>
    </>
  );
};

const useStyles = makeStyles(theme => ({
  saveReadmeButton: {
    margin: theme.spacing(1),
    fontSize: fontsize.xsmall,
    position: "absolute",
    bottom: 10,
    right: 10
  },
  consoleReadMeTextarea: {
    width: "100%",
    height: "100%",
    fontSize: fontsize.base,
    resize: "none",
    background: "transparent",
    outline: "none",
    color: color.white,
    padding: theme.spacing(2)
  }
}));

export default React.memo(Readme);
