import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { color, useStyles as commonUseStyles } from '@javico/common/lib/design-language/Css';
import { MonacoEditor } from '@javico/common/lib/components';

import AppBar from '../components/AppBar';
import { getEditorState } from '../redux/editor/reducers';
import { SAVE_EDITOR_STATE } from '../redux/editor/actionTypes';
import { Storage } from '../utils/Storage';

function getKeyboardHeight() {
  const userSettings: any = Storage.getItem('settings') || {};
  return userSettings.keyboardHeight;
}

function getEditorHeightWhenKeyboardIsVisible(keyboardHeight: number) {
  return !!keyboardHeight === true ? window.innerHeight - (64 + keyboardHeight) : '100%';
}

interface IProps {
  toggleTabNavigator: (visible: boolean) => void;
}

const Editor: React.FC<IProps> = ({ toggleTabNavigator }) => {
  const classes = useStyles();
  const commonCss = commonUseStyles();
  const editorRef = useRef<any>(null);
  const hiddenInputRef = useRef<any>(null);
  const editorState = useSelector(getEditorState);
  const [keyboardHeight, setKeyboardHeight] = useState(getKeyboardHeight());
  const [editorHeight, setEditorHeight] = useState(
    getEditorHeightWhenKeyboardIsVisible(keyboardHeight),
  );
  const dispatch = useDispatch();
  const isEditorReady = !!keyboardHeight;

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

  function predictKeyboardHeight() {
    if (!!Storage.getItem('settings') === false) {
      hiddenInputRef.current.focus();
      setTimeout(() => {
        let keyboardHeight = hiddenInputRef.current.getBoundingClientRect().bottom;
        Storage.setItem('settings', { keyboardHeight });
        setKeyboardHeight(keyboardHeight);
        setEditorHeight(getEditorHeightWhenKeyboardIsVisible(keyboardHeight));
        if (!!editorRef.current === true && !!editorRef.current.getEditorRef() === true) {
          editorRef.current.getEditorRef().focus();
        }
      }, 500);
    }
  }

  function repositionToolbar() {
    toggleTabNavigator(false);
    setEditorHeight(getEditorHeightWhenKeyboardIsVisible(keyboardHeight));
  }

  function hideToolbar() {
    toggleTabNavigator(true);
    setEditorHeight('100%');
  }

  function handleKeyDown(e: any) {
    if (e.keyCode === 13) {
      let doc = document.getElementsByClassName('mango-pre')[0];
      doc.scrollTop = doc.scrollHeight;
    }
  }

  return (
    <div className={`${classes.monacoEditorContainer} ${commonCss.flexColumn}`}>
      <AppBar />
      <div onKeyDown={handleKeyDown} style={{ height: editorHeight }}>
        <MonacoEditor
          ref={editorRef}
          theme="light"
          model={editorState.model}
          viewState={editorState.viewState}
          onDidFocusEditorText={repositionToolbar}
          onDidBlurEditorText={hideToolbar}
          onChangeValue={() => null}
          onSaveValue={() => null}
          onHighlightValue={() => null}
        />
      </div>
      {isEditorReady === false && <input ref={hiddenInputRef} className={classes.hiddenInput} />}
      {isEditorReady === false && (
        <div
          onClick={predictKeyboardHeight}
          className={`${classes.pseudoContainer} ${commonCss.fullHeightAndWidth}`}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles({
  monacoEditorContainer: {
    width: '100%',
    position: 'fixed',
    height: 'calc(100% - 65px)',
    background: color.white,
  },
  hiddenInput: {
    opacity: 0,
  },
  pseudoContainer: {
    position: 'absolute',
    zIndex: 1000,
    background: 'transparent',
    left: 0,
    top: 0,
  },
});

export default React.memo(Editor);
