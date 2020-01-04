import React from 'react';
import { withStyles, LinearProgress } from '@material-ui/core';

import { color } from '../Css';

interface IProps {
  backgroundColor?: string;
  progressColor?: string;
}

const IndeterminateLinearProgress: React.FC<IProps> = ({
  backgroundColor = color.white,
  progressColor = color.themeBlue,
}) => {
  const ColorLinearProgress = withStyles({
    colorPrimary: {
      backgroundColor,
    },
    barColorPrimary: {
      backgroundColor: progressColor,
    },
    root: {
      height: 2,
    },
  })(LinearProgress);

  return <ColorLinearProgress />;
};

export default IndeterminateLinearProgress;
