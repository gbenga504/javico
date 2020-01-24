import React from 'react';
import { makeStyles } from '@material-ui/core';

import { useStyles as commonUseStyles, padding } from '../Css';

interface IProps {
  contentColor?: string;
  shimColor?: string;
}

const ContentLoader: React.FC<IProps> = (props: IProps) => {
  let composedProps = {} as IProps;
  if (props.contentColor === undefined) composedProps['contentColor'] = '#313438';
  if (props.shimColor === undefined) composedProps['shimColor'] = '#41454a';
  const classes = useStyles(composedProps);
  const commonCss = commonUseStyles();

  function getRandomizedLength() {
    return Math.floor(Math.random() * 10 + 10);
  }

  return (
    <div
      className={`${commonCss.flexColumn} ${commonCss.fullWidth}`}
      style={{ ...padding(16, 'lr'), ...padding(10, 'bt') }}>
      <div className={`${commonCss.flexRow} ${commonCss.fullWidth}`}>
        <div className={classes.image}></div>
        <div className={`${commonCss.flexColumn} ${commonCss.fullWidth}`} style={padding(8, 'l')}>
          <div className={`${commonCss.flexRow} ${commonCss.fullWidth}`}>
            <div
              className={classes.text}
              style={{ width: `${getRandomizedLength()}%`, marginRight: '1%' }}
            />
            <div
              className={classes.text}
              style={{ width: `${getRandomizedLength()}%`, marginLeft: '1%' }}
            />
          </div>
          <div className={classes.text} />
          <div className={`${commonCss.flexRow} ${commonCss.fullWidth}`}>
            <div
              className={classes.text}
              style={{ width: `${getRandomizedLength()}%`, marginRight: '1%' }}
            />
            <div
              className={classes.text}
              style={{ width: `${getRandomizedLength()}%`, marginLeft: '2%' }}
            />
          </div>
        </div>
      </div>
      <div className={classes.code}></div>
    </div>
  );
};

const useStyles = makeStyles({
  image: {
    animationDuration: '2s',
    animationFillMode: 'forwards',
    animationIterationCount: 'infinite',
    animationName: '$placeHolderShimmer',
    animationTimingFunction: 'linear',
    backgroundSize: '800px 200px',
    background: `linear-gradient(to right, #313438 8%, #41454a 18%, #313438 33%)`,
    height: 35,
    width: 35,
    borderRadius: 5,
  },
  text: {
    animationDuration: '2s',
    animationFillMode: 'forwards',
    animationIterationCount: 'infinite',
    animationName: '$placeHolderShimmer',
    animationTimingFunction: 'linear',
    backgroundSize: '800px 200px',
    background: `linear-gradient(to right, #313438 8%, #41454a 18%, #313438 33%)`,
    height: 6,
    width: '30%',
    borderRadius: 10,
    marginBottom: 6,
  },
  code: {
    animationDuration: '0.9s',
    animationFillMode: 'forwards',
    animationIterationCount: 'infinite',
    animationName: '$placeHolderShimmer',
    animationTimingFunction: 'linear',
    backgroundSize: '1200px 200px',
    background: `linear-gradient(to right, #313438 8%, #41454a 18%, #313438 33%)`,
    height: 40,
    width: '100%',
    marginTop: 5,
    borderRadius: 4,
  },
  '@-webkit-keyframes placeHolderShimmer': {
    '0%': {
      backgroundPosition: `-100% 0`,
    },
    '100%': {
      backgroundPosition: `100% 0`,
    },
  },
  '@keyframes placeHolderShimmer': {
    '0%': {
      backgroundPosition: `-100% 0`,
    },
    '100%': {
      backgroundPosition: `100% 0`,
    },
  },
});

export default ContentLoader;
