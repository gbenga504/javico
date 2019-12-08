import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Button, withStyles } from '@material-ui/core';

import './index.css';
import MonacoIntegrator from '../../utils/MonacoIntegrator';
import MonacoThemes from '../../utils/MonacoThemes';
import { Icon, AnimatedCircularLoader } from '../../atoms';

interface IProps {
  value?: string;
  onRunSourceCode?: (value: string) => void;
  theme?: 'light' | 'dark' | 'ace' | 'night-dark';
  language?: string;
  classes: any;
}

const styles = {
  monacoEditorRunButton: {
    height: 50,
    width: 50,
    minWidth: 50,
    borderRadius: '50%',
    background: '#0076C6',
    position: 'absolute',
    bottom: 10,
    right: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  const [sourceCode, setSourceCode] = useState('');
  const monacoRef = useRef<any>(null);
  const editorRef = useRef<any>(null);
  const subscriptionRef = useRef<any>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const createEditor = useCallback(() => {
    const model = monacoRef.current.editor.createModel(value, language);
    editorRef.current = monacoRef.current.editor.create(nodeRef.current, { automaticLayout: true });
    editorRef.current.setModel(model);

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
    <div className="monaco-editor__container">
      {renderLoading()}
      <div ref={nodeRef} className="monaco-editor-editor" />
      <Button
        onClick={handleSourceCodeExecution}
        variant="contained"
        classes={{ root: classes.monacoEditorRunButton }}>
        <Icon name="play" className="monaco-editor-run-button-icon" />
      </Button>
    </div>
  );
};

export default React.memo(withStyles(styles)(MonacoEditor));
