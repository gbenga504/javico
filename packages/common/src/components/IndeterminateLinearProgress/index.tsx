import React from "react";
import { withStyles, LinearProgress } from "@material-ui/core";

import { color } from "../../design-language/Css";

interface IProps {
  backgroundColor?: string;
  progressColor?: string;
  isVisible: boolean;
}

const IndeterminateLinearProgress: React.FC<IProps> = ({
  backgroundColor = color.white,
  progressColor = color.themeBlue,
  isVisible
}) => {
  const ColorLinearProgress = withStyles({
    colorPrimary: {
      backgroundColor
    },
    barColorPrimary: {
      backgroundColor: progressColor
    },
    root: {
      height: 2
    }
  })(LinearProgress);

  if (!isVisible) return null;

  return <ColorLinearProgress />;
};

export default IndeterminateLinearProgress;
