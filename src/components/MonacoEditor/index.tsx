import React, { useEffect, useState, useRef, useCallback } from 'react';

import './index.css';
import MonacoIntegrator from '../../utils/MonacoIntegrator';
import MonacoThemes from '../../utils/MonacoThemes';
import AnimatedCircularLoader from '../../atoms/AnimatedCircularLoader';

interface IProps {
  value?: string;
  onChangeValue?: (value: string) => void;
  theme?: 'light' | 'dark' | 'ace' | 'night-dark';
  language?: string;
}

const MonacoEditor: React.FC<IProps> = ({
  value,
  onChangeValue,
  theme = 'vs-dark',
  language = 'javascript',
}) => {
  const [isMonacoReady, setIsMonacoReady] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
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
      onChangeValue && onChangeValue(model.getValue());
    });
    editorRef.current.focus();
    setIsEditorReady(true);
  }, [onChangeValue, language, theme, value]);

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

  function renderLoading() {
    return isEditorReady === false ? (
      <div
        style={{
          display: 'flex',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          background: '#1E1E1E',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AnimatedCircularLoader />
      </div>
    ) : null;
  }

  return (
    <React.Fragment>
      {renderLoading()}
      <div ref={nodeRef} className="monaco-editor" />
    </React.Fragment>
  );
};

export default React.memo(MonacoEditor);
