import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Fab, Tooltip } from '@material-ui/core';

import { useStyles } from './styles';
import { useStyles as commonUseStyles, color } from '../../Css';
import MonacoIntegrator from '../../utils/MonacoIntegrator';
import MonacoThemes from '../../utils/MonacoThemes';
import { withApi } from '../../utils/ApiConnector';
import CodeService from '../../services/sourceCodeServices';
import { Icon, AnimatedCircularLoader } from '../../atoms';
import SignInViaGithubModal from '../SignInViaGithubModal';
import InlineCodeComment from '../InlineCodeComment';
import { generateID } from '../../utils/misc';

interface IProps {
  value?: string;
  onRunSourceCode?: (value: string) => void;
  theme?: 'light' | 'dark' | 'ace' | 'night-dark';
  language?: string;
  Api: any;
}

const MonacoEditor: React.FC<IProps> = ({
  value,
  onRunSourceCode,
  theme = 'vs-dark',
  language = 'javascript',
  Api,
}) => {
  const [shouldDisplayCommentBox, setShouldDisplayCommentBox] = useState<boolean>(false);
  const [shouldDisplayCommentIcon, setShouldDisplayCommentIcon] = useState<boolean>(false);
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
  const classes = useStyles();
  const commonCss = commonUseStyles();

  const createEditor = useCallback(() => {
    const model = monacoRef.current.editor.createModel(value, language);
    editorRef.current = monacoRef.current.editor.create(nodeRef.current, { automaticLayout: true });
    editorRef.current.setModel(model);
    editorRef.current.onMouseUp(highlightText);
    editorRef.current.onKeyDown(function(event: any) {
      if ((event.ctrlKey === true || event.metaKey === true) && event.keyCode === 49) {
        event.preventDefault();
        let me = Api.getCurrentUser();
        if (!!me && me.email) {
          CodeService.createSourceCode({
            data: {
              foreignKey: '',
              sourceCode,
              readme: '',
              title: '',
              tags: [],
            },
          });
        } else {
          handleOpenSignInModal();
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
  }, [language, theme, value, Api, sourceCode]);

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
    Api.onAuthStateChanged(function(user: any) {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, [Api]);

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
      setShouldDisplayCommentIcon(true);
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
          options: { inlineClassName: classes.monacoEditorHighlightMainContent },
        },
        {
          range: new monacoRef.current.Range(startLineNumber, 1, startLineNumber, startColumn),
          options: { inlineClassName: classes.monacoEditorHighlightRemainingContent },
        },
        {
          range: new monacoRef.current.Range(endLineNumber, endColumn, endLineNumber, 1000),
          options: { inlineClassName: classes.monacoEditorHighlightRemainingContent },
        },
      ],
    );
  }

  function handleShowCommentBox() {
    colorHighlight();
    setShouldDisplayCommentBox(true);
    setShouldDisplayCommentIcon(false);
  }

  function handleHideCommentBox() {
    setShouldDisplayCommentBox(false);
    setSelectionRange(null);
    setSelectionValue(null);
    editorRef.current.getModel().setValue(sourceCode);
  }

  function highlightText(e: any) {
    const selection = editorRef.current.getSelection();
    const value = editorRef.current.getModel().getValueInRange(selection);
    if (!!value && value.trim().length > 0) {
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

  function handleOpenSignInModal() {
    setIsSignInModalVisible(true);
  }

  function handleKeyUp() {
    if (shouldDisplayCommentIcon === true) {
      setShouldDisplayCommentIcon(false);
    }
  }

  function renderLoading() {
    return isEditorReady === false ? (
      <div
        className={`${commonCss.flexRow} ${commonCss.center} ${commonCss.fullHeightAndWidth}`}
        style={{
          overflow: 'hidden',
          background: color.darkThemeBlack,
        }}>
        <AnimatedCircularLoader />
      </div>
    ) : null;
  }

  function renderCommentIcon() {
    if (shouldDisplayCommentIcon === false) return null;
    return (
      <div
        onClick={handleShowCommentBox}
        className={classes.monacoEditorCodeCommentIcon}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}>
        <Tooltip title="Comment on code" placement="bottom" enterDelay={100}>
          <span className={commonCss.flexRow}>
            <Icon
              name="chatboxes"
              size="small"
              style={{
                color: '#074e68',
                margin: 12,
              }}
            />
          </span>
        </Tooltip>
      </div>
    );
  }

  return (
    <>
      <div className={classes.monacoEditorContainer}>
        {renderLoading()}
        <div onKeyUp={handleKeyUp} ref={nodeRef} className={classes.monacoEditor} />
        {shouldDisplayCommentBox && (
          <InlineCodeComment
            onHideCommentBox={handleHideCommentBox}
            onOpenSignInModal={handleOpenSignInModal}
            user={user}
            mousePosition={mousePosition}
          />
        )}
      </div>
      <Fab
        color="primary"
        onClick={handleSourceCodeExecution}
        variant="round"
        classes={{ root: classes.monacoEditorRunButton }}>
        <Icon name="play" className={classes.monacoEditorRunButtonIcon} />
      </Fab>
      <SignInViaGithubModal
        visible={isSignInModalVisible}
        onRequestClose={handleCloseSignInModal}
        onSignInSuccess={handleSaveDeveloperCode}
      />
      {renderCommentIcon()}
    </>
  );
};

export default React.memo(withApi(MonacoEditor));
