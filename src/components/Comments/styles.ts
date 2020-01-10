import { makeStyles } from '@material-ui/core';

import { color, fontsize, padding, margin } from '../../Css';

export const useStyles = makeStyles(theme => ({
  comments: {
    height: '100vh',
    backgroundColor: color.deepBlue,
    position: 'relative',
    borderTop: `1px solid ${color.darkThemeLightBorder}`,
  },
  commentsBody: {
    overflow: 'scroll',
    paddingBottom: theme.spacing(17),
  },
  comment: {
    backgroundColor: 'inherit',
    transition: 'all 0.3s',
    ...padding(16, 'lr'),
  },
  commentUserImage: {
    height: 35,
    width: 35,
    borderRadius: 5,
  },
  commentUsername: {
    cursor: 'pointer',
    display: 'inline-block',
    ...margin(4, 'b'),
  },
  commentTime: {
    fontSize: fontsize.xsmall,
  },
  commentUserComment: {
    fontSize: fontsize.small,
  },
  commentInput: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundImage: 'linear-gradient(to top,rgba(28, 32, 34) 70%,rgba(28, 32, 34, 0.1) 100%)',
  },
  commentInputFieldContainer: {
    height: 50,
    boxSizing: 'border-box',
    border: `1px solid ${color.darkThemeDarkBorder}`,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.deepBlue,
    borderRadius: 3,
    margin: theme.spacing(0, 4, 4),
  },
  commentInputField: {
    height: '100%',
    color: color.white,
    width: '100%',
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    fontSize: fontsize.base,
    paddingLeft: theme.spacing(4),
    '&:focus': {
      outline: 'none',
    },
  },
  commentInputSendIcon: {
    height: 18,
    width: 18,
    color: color.themeBlue,
    marginRight: theme.spacing(2),
  },
  commentNotLive: {
    color: `${color.darkThemeDarkBorder} !important`,
  },
}));
