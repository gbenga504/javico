import React from "react";
import { makeStyles } from "@material-ui/core";
import { color, fontsize } from "@javico/common/lib/design-language/Css";
import { getSourcecodeUrl, getBaseUrl } from "@javico/common/lib/utils";

import MarDownRenderer from "../MarkDownRenderer";

const Preview: React.FC<{ readMe: string }> = ({ readMe }) => {
  const classes = useStyles();
  const isInCleanSlate = getSourcecodeUrl() === `${getBaseUrl()}/`;
  const optionalMessage = isInCleanSlate
    ? "**Please sign in and save your code to add a README**"
    : "**No README to display**";

  return (
    <div className={classes.consolePreview}>
      <MarDownRenderer source={readMe || optionalMessage} />
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  consolePreview: {
    padding: theme.spacing(2),
    color: color.white,
    width: "100%",
    height: "100%",
    fontSize: fontsize.base
  }
}));

export default Preview;
