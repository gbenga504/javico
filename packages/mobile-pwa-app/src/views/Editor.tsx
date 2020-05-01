import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { color } from '@javico/common/lib/design-language/Css';
import { MonacoEditor } from '@javico/common/lib/components';

import AppBar from '../components/AppBar';
import { getEditorState } from '../redux/editor/reducers';
import { SAVE_EDITOR_STATE } from '../redux/editor/actionTypes';

const Editor: React.FC = () => {
  const classes = useStyles();
  const editorRef = useRef<any>(null);
  const editorState = useSelector(getEditorState);
  const dispatch = useDispatch();

  useEffect(() => {
    let _editorRef = editorRef.current;
    return () => {
      dispatch({
        type: SAVE_EDITOR_STATE,
        payload: {
          model: _editorRef.getEditorRef().getModel(),
          viewState: _editorRef.getEditorRef().saveViewState(),
        },
      });
    };
  }, [dispatch]);

  return (
    <div className={classes.monacoEditorContainer}>
      <AppBar />
      <MonacoEditor
        ref={editorRef}
        theme="light"
        model={editorState.model}
        viewState={editorState.viewState}
        onChangeValue={() => null}
        onSaveValue={() => null}
        onHighlightValue={() => null}
      />
    </div>
  );
};

const useStyles = makeStyles({
  monacoEditorContainer: {
    width: '100%',
    height: 'calc(100% - 57px)',
    position: 'relative',
    background: color.white,
  },
  monacoEditorRunButton: {
    position: 'fixed',
    zIndex: 2000,
    bottom: 10,
    right: 10,
  },
  monacoEditorRunButtonIcon: {
    color: color.white,
  },
});

export default React.memo(Editor);
