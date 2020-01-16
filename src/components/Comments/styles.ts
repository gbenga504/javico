import { makeStyles } from '@material-ui/core';

import { color, fontsize, padding } from '../../Css';

export const useStyles = makeStyles(theme => ({
  comments: {
    height: '100vh',
    backgroundColor: color.deepBlue,
    position: 'relative',
    borderTop: `1px solid ${color.darkThemeLightBorder}`,
  },
  commentsHeader: {
    height: 48,
    position: 'fixed',
    background: color.deepBlue,
    width: '100%',
  },
  commentsBody: {
    overflowY: 'scroll',
    marginTop: 38,
    paddingBottom: theme.spacing(17),
  },
  commentInput: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundImage: 'linear-gradient(to top,rgba(28, 32, 34) 70%,rgba(28, 32, 34, 0.1) 100%)',
  },
  commentInputFieldContainer: {
    height: 'auto',
    boxSizing: 'border-box',
    border: `1px solid ${color.darkThemeDarkBorder}`,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.deepBlue,
    borderRadius: 3,
    margin: theme.spacing(0, 4, 4),
    '&.hide-border': {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderTop: 0,
    },
  },
  commentInputField: {
    color: color.white,
    width: '100%',
    border: '1px solid transparent',
    backgroundColor: 'transparent',
    fontSize: fontsize.base,
    resize: 'none',
    padding: theme.spacing(3, 0),
    paddingLeft: theme.spacing(4),
    '&:focus': {
      outline: 'none',
    },
  },
  commentInputSendIcon: {
    height: 18,
    alignSelf: 'flex-end',
    width: 18,
    color: color.themeBlue,
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(2),
  },
  commentQuotedCommentContainer: {
    margin: theme.spacing(0, 4),
    border: `1px solid ${color.darkThemeDarkBorder}`,
    padding: theme.spacing(2, 3, 0.5, 3),
    borderRadius: 3,
    borderBottom: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    background: color.deepBlue,
    '& p': {
      width: '100%',
      fontSize: fontsize.small,
      borderLeft: `6px solid ${color.themeBlue}`,
      background: color.themeBlueLighter,
      padding: theme.spacing(2),
      margin: 0,
    },
  },
  commentNotLive: {
    color: `${color.darkThemeDarkBorder} !important`,
  },
  commentDateSeperatorContainer: {
    position: 'sticky',
    top: 0,
    display: 'flex',
    paddingTop: 10,
    alignItems: 'center',
    background: color.deepBlue,
    zIndex: 2000,
  },
  commentDateSeperatorHr: {
    border: 0,
    borderTop: '1px solid rgba(53,55,59,1)',
    position: 'relative',
    width: '100%',
    margin: 0,
  },
  commentDateSeperatorText: {
    fontSize: fontsize.base,
  },
  commentStickyDateContainer: {
    top: 12,
    position: 'sticky',
    display: 'flex',
    zIndex: 3000,
    justifyContent: 'center',
    '& div': {
      marginTop: -12,
      background: color.deepBlue,
      ...padding(0, 'tb'),
      ...padding(10, 'lr'),
    },
  },
}));
