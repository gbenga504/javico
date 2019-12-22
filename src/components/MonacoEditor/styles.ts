import { makeStyles } from '@material-ui/core';

import { color, fontsize } from '../../Css';

export const useStyles = makeStyles(theme => ({
  monacoEditorContainer: {
    flex: 1,
    position: 'relative',
    background: color.darkThemeBlack,
    paddingTop: theme.spacing(3),
  },
  monacoEditor: {
    flex: 1,
    height: '100%',
  },
  monacoEditorRunButtonIcon: {
    color: color.white,
    fontSize: fontsize.xlarge,
    marginLeft: 2,
  },
  monacoEditorCodeComment: {
    height: 100,
    width: 500,
  },
  monacoEditorCodeCommentIcon: {
    position: 'absolute',
    backgroundColor: color.white,
    cursor: 'pointer',
    borderRadius: '50%',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  monacoEditorHighlightMainContent: {
    backgroundColor: '#074e68',
    color: '#fff !important',
  },
  monacoEditorHighlightRemainingContent: {
    backgroundColor: '#8adaf7',
    color: 'black !important',
  },
  monacoEditorRunButton: {
    position: 'absolute',
    bottom: 15,
    right: '50%',
    zIndex: 2000,
  },
}));
