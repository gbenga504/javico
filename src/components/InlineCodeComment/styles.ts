import { makeStyles } from '@material-ui/core';

import { color, fontsize, fonts } from '../../Css';

export const useStyles = makeStyles(theme => ({
  inlineCommentContainer: {
    backgroundColor: color.white,
    borderRadius: 5,
    textAlign: 'left',
    width: '100%',
    minHeight: 50,
    fontSize: fontsize.base,
    padding: theme.spacing(3),
    zIndex: 99999,
    '& > textarea': {
      width: '100%',
      border: 0,
      fontFamily: fonts.regular,
      fontSize: fontsize.base,
      outline: 'none',
      resize: 'none',
    },
    '& .inline-comment__header': {
      borderBottom: `1px solid ${color.gray20}`,
      marginBottom: 5,
    },
    '& .inline-comment__footer': {
      borderTop: `1px solid ${color.gray20}`,
      paddingTop: theme.spacing(1),
    },
  },
  nothingToPreview: {
    color: `${color.black} !important`,
    fontSize: fontsize.base,
  },
  markdownLink: {
    color: `${color.themeBlueDarker} !important`,
    fontSize: fontsize.small,
    fontFamily: `${fonts.semiBold} !important`,
    textDecoration: 'none',
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
    width: 'calc(100% - 100px)',
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
