import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Fab, withStyles, Tooltip } from '@material-ui/core';

import './index.css';
import MonacoIntegrator from '../../utils/MonacoIntegrator';
import MonacoThemes from '../../utils/MonacoThemes';
import { withFirebase } from '../../utils/FirebaseConnector';
import { Icon, AnimatedCircularLoader } from '../../atoms';
import SignInViaGithubModal from '../SignInViaGithubModal';
import InlineCodeComment from '../InlineCodeComment';
import { initializeApp } from 'firebase';

interface IProps {
  value?: string;
  onRunSourceCode?: (value: string) => void;
  theme?: 'light' | 'dark' | 'ace' | 'night-dark';
  language?: string;
  classes: any;
  firebase: any;
}

const styles = {
  monacoEditorRunButton: {
    background: '#0076C6',
    position: 'absolute',
    bottom: 15,
    right: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    cursor: 'pointer',
    '&:hover': {
      background: '#0D47A1',
    },
  },
} as any;

const MonacoEditor: React.FC<IProps> = ({
  value,
  onRunSourceCode,
  theme = 'vs-dark',
  language = 'javascript',
  classes,
  firebase,
}) => {
  const [displayComment, setDisplayComment] = useState<boolean>(false);
  const [displayInitCommentIcon, setInitDisplayCommentIcon] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<any>({});
  const [isMonacoReady, setIsMonacoReady] = useState<boolean>(false);
  const [isEditorReady, setIsEditorReady] = useState<boolean>(false);
  const [selectionRange, setSelectionRange] = useState<any>(null);
  const [selectionValue, setSelectionValue] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState<boolean>(false);
  const [sourceCode, setSourceCode] = useState('');
  const monacoRef = useRef<any>(null);
  const editorRef = useRef<any>(null);
  const subscriptionRef = useRef<any>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  let currentUser = firebase.getCurrentUser();

  if (!user && !!currentUser) {
    setUser(currentUser);
  }

  const createEditor = useCallback(() => {
    const model = monacoRef.current.editor.createModel(value, language);
    editorRef.current = monacoRef.current.editor.create(nodeRef.current, { automaticLayout: true });
    editorRef.current.setModel(model);
    editorRef.current.onMouseUp(highlightText);
    editorRef.current.onKeyDown(function(event: any) {
      if ((event.ctrlKey === true || event.metaKey === true) && event.keyCode === 49) {
        event.preventDefault();
        if (user) {
          /**
           * @todo
           * Save the code
           */
        } else {
          setIsSignInModalVisible(true);
        }
      }
    });

    for (let themeName in MonacoThemes) {
      monacoRef.current.editor.defineTheme(themeName, MonacoThemes[themeName]);
    }

    monacoRef.current.editor.setTheme(theme);
    subscriptionRef.current = model.onDidChangeContent(() => {
      setSourceCode(model.getValue());
    });
    editorRef.current.focus();
    setIsEditorReady(true);
  }, [language, theme, value, firebase, displayInitCommentIcon]);

  useEffect(() => {
    MonacoIntegrator.init()
      .then((monaco: any) => {
        monacoRef.current = monaco;
        setIsMonacoReady(true);
      })
      .catch(error => console.error(`An error ocurred while initializing monaco ${error}`));

    return () => {
      editorRef.current && editorRef.current.dispose();
      subscriptionRef.current && subscriptionRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    isMonacoReady === true && isEditorReady === false && createEditor();
  }, [isMonacoReady, isEditorReady, createEditor]);

  useEffect(() => {
    if (editorRef.current !== null) {
      const model = editorRef.current.getModel();
      if (value !== model.getValue()) {
        model.pushEditOperations(
          [],
          [
            {
              range: model.getFullModelRange(),
              text: value,
            },
          ],
        );
      }
    }
  }, [value]);

  useEffect(() => {
    if (monacoRef.current !== null) {
      monacoRef.current.editor.setTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (selectionValue) {
      setInitDisplayCommentIcon(true);
    }
  }, [selectionValue, selectionRange]);

  function handleSourceCodeExecution() {
    onRunSourceCode && onRunSourceCode(sourceCode);
  }

  function colorHighlight() {
    const { endColumn, endLineNumber, startColumn, startLineNumber } = selectionRange;
    editorRef.current.deltaDecorations(
      [],
      [
        {
          range: new monacoRef.current.Range(
            startLineNumber,
            startColumn,
            endLineNumber,
            endColumn,
          ),
          options: { inlineClassName: 'highlight-main' },
        },
        {
          range: new monacoRef.current.Range(startLineNumber, 1, endLineNumber, 1000),
          options: { inlineClassName: 'highlight-remain' },
        },
      ],
    );
  }

  function showCommentBox() {
    colorHighlight();
    setDisplayComment(true);
    setInitDisplayCommentIcon(false);
  }

  function hideCommentBox() {
    setDisplayComment(false);
    setSelectionRange(null);
    setSelectionValue(null);
    editorRef.current.getModel().setValue(sourceCode);
  }

  function highlightText(e: any) {
    const selection = editorRef.current.getSelection();
    const value = editorRef.current.getModel().getValueInRange(selection);
    if (!!value) {
      setSelectionRange(selection);
      setMousePosition(e.event.pos);
      setSelectionValue(value);
    }
  }

  function handleSaveDeveloperCode() {
    /**
     * @todo
     * Save the developer code here
     */
  }

  function handleCloseSignInModal() {
    setIsSignInModalVisible(false);
  }

  function handleKeyUP() {
    if (displayInitCommentIcon) {
      setInitDisplayCommentIcon(false);
    }
  }

  function renderLoading() {
    return isEditorReady === false ? (
      <div
        className="flex-row center full-height-and-width"
        style={{
          overflow: 'hidden',
          background: 'var(--dark-theme-black-color)',
        }}>
        <AnimatedCircularLoader />
      </div>
    ) : null;
  }

  function renderCommentIcon() {
    if (!displayInitCommentIcon) return null;
    return (
      <div
        onClick={showCommentBox}
        className="monaco-editor__code-comment-icon"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}>
        <Tooltip title="Comment on code" placement="bottom" enterDelay={100}>
          <span className="flex-row">
            <Icon
              name="chatboxes"
              size="small"
              className="m-12"
              style={{
                color: '#074e68',
              }}
            />
          </span>
        </Tooltip>
      </div>
    );
  }

  return (
    <>
      <div className="monaco-editor__container pt-12">
        {renderLoading()}
        <div onKeyUp={handleKeyUP} ref={nodeRef} className="monaco-editor-editor" />
      </div>
      <Fab
        onClick={handleSourceCodeExecution}
        variant="round"
        classes={{ root: classes.monacoEditorRunButton }}>
        <Icon name="play" className="monaco-editor-run-button-icon" />
      </Fab>
      {displayComment && (
        <InlineCodeComment
          hideCommentBox={hideCommentBox}
          user={user}
          mousePosition={mousePosition}
          displayComment={displayComment}
        />
      )}
      <SignInViaGithubModal
        visible={isSignInModalVisible}
        onRequestClose={handleCloseSignInModal}
        onSignInSuccess={handleSaveDeveloperCode}
      />
      {renderCommentIcon()}
    </>
  );
};

export default React.memo(withFirebase(withStyles(styles)(MonacoEditor)));
