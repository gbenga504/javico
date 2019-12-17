import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Fab, withStyles } from '@material-ui/core';

import './index.css';
import MonacoIntegrator from '../../utils/MonacoIntegrator';
import MonacoThemes from '../../utils/MonacoThemes';
import { Icon, AnimatedCircularLoader } from '../../atoms';
import { any } from 'prop-types';

interface IProps {
  value?: string;
  onRunSourceCode?: (value: string) => void;
  theme?: 'light' | 'dark' | 'ace' | 'night-dark';
  language?: string;
  classes: any;
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
}) => {
  const [isMonacoReady, setIsMonacoReady] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [displayComment, setDisplayComment] = useState(false);
  const [mousePosition, setMousePosition] = useState<any>({});
  const [sourceCode, setSourceCode] = useState('');
  const monacoRef = useRef<any>(null);
  const editorRef = useRef<any>(null);
  const subscriptionRef = useRef<any>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const createEditor = useCallback(() => {
    const model = monacoRef.current.editor.createModel(value, language);
    editorRef.current = monacoRef.current.editor.create(nodeRef.current, { automaticLayout: true });
    editorRef.current.setModel(model);
    editorRef.current.onMouseUp(highlightText);

    for (let themeName in MonacoThemes) {
      monacoRef.current.editor.defineTheme(themeName, MonacoThemes[themeName]);
    }

    monacoRef.current.editor.setTheme(theme);
    subscriptionRef.current = model.onDidChangeContent(() => {
      setSourceCode(model.getValue());
    });
    editorRef.current.focus();
    setIsEditorReady(true);
  }, [language, theme, value]);

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

  function handleSourceCodeExecution() {
    onRunSourceCode && onRunSourceCode(sourceCode);
  }

  function colorHighlight(selection: any) {
    const { endColumn, endLineNumber, startColumn, startLineNumber } = selection;
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
          options: { inlineClassName: 'UPDATE' },
        },
        {
          range: new monacoRef.current.Range(startLineNumber, 1, endLineNumber, 1000),
          options: { inlineClassName: 'INSERT' },
        },
      ],
    );
  }

  function showCommentBox(position: any) {
    setDisplayComment(true);
    setMousePosition(position);
  }

  function highlightText(e: any) {
    const selection = editorRef.current.getSelection();
    const value = editorRef.current.getModel().getValueInRange(selection);
    if (!!value) {
      colorHighlight(selection);
      showCommentBox(e.event.pos);
      console.log('selection.startLineNumber ', selection, value, e.event.pos);
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

  return (
    <>
      <div className="monaco-editor__container pt-12">
        {renderLoading()}
        <div ref={nodeRef} className="monaco-editor-editor" />
      </div>
      <Fab
        onClick={handleSourceCodeExecution}
        variant="round"
        classes={{ root: classes.monacoEditorRunButton }}>
        <Icon name="play" className="monaco-editor-run-button-icon" />
      </Fab>
      {displayComment && (
        <div
          className="monaco-editor__code-comment"
          style={{
            position: 'absolute',
            top: mousePosition.y + 20,
            left: 150,
          }}></div>
      )}
    </>
  );
};

export default React.memo(withStyles(styles)(MonacoEditor));
