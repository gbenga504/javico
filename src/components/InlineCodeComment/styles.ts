import { makeStyles } from '@material-ui/core';

import { color, fontsize, fonts } from '../../Css';

export const useStyles = makeStyles(theme => ({
  monacoEditorInlineComment: {
    backgroundColor: color.white,
    borderRadius: 5,
    textAlign: 'left',
    width: '100%',
    minHeight: 50,
    zIndex: 99999,
    '& > textarea': {
      width: '100%',
      border: 0,
      fontFamily: fonts.regular,
      padding: 5,
      fontSize: fontsize.base,
    },
    '&.hide': {
      display: 'none',
    },
    '&.show': {
      display: 'block',
    },
    '& > div': {
      marginRight: theme.spacing(1),
    },
    '&.left::before': {
      content: "''",
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderLeft: 0,
      borderWidth: 12,
      borderRightColor: color.white,
      bottom: '25%',
      left: -24,
      top: 15,
    },
  },
  commentBoxContainer: {
    position: 'absolute',
    background: 'transparent',
    zIndex: 2,
    top: 0,
    '& form': {
      margin: theme.spacing(3),
    },
  },
  commentBox: {
    position: 'absolute',
    left: 60,
    width: 'calc(100% - 160px)',
    backgroundColor: color.gray20,
  },
  commentUser: {
    height: 40,
    width: 40,
    borderRadius: '50%',
    border: '2px solid #074e68',
  },
  commentDialogContent: {
    fontSize: 15,
  },
  commentButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
}));
