import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useImperativeHandle
} from "react";
import { Tooltip, CircularProgress } from "@material-ui/core";
import { ModeComment as ModeCommentIcon } from "@material-ui/icons";
import {
  useStyles as commonUseStyles,
  color,
  fontsize
} from "../../design-language/Css";
import { useStyles } from "./styles";
import MonacoIntegrator from "../../utils/MonacoIntegrator";
import MonacoThemes from "../../utils/MonacoThemes";

interface IProps {
  defaultValue?: string;
  onChangeValue: (value: string) => void;
  onSaveValue: (value: string) => void;
  onHighlightValue: (
    highlightedValue: string,
    anchorEl: HTMLDivElement | null,
    distanceY: number
  ) => void;
  theme?: "light" | "dark" | "ace" | "night-dark" | "vs-dark";
  language?: string;
}

const MonacoEditor = React.forwardRef(
  (
    {
      defaultValue,
      onChangeValue,
      onSaveValue,
      onHighlightValue,
      theme = "vs-dark",
      language = "javascript"
    }: IProps,
    ref
  ) => {
    const [shouldDisplayCommentIcon, setShouldDisplayCommentIcon] = useState<
      boolean
    >(false);
    const [mousePosition, setMousePosition] = useState<any>({});
    const [isMonacoReady, setIsMonacoReady] = useState<boolean>(false);
    const [isEditorReady, setIsEditorReady] = useState<boolean>(false);
    const [selectionRange, setSelectionRange] = useState<any>(null);
    const [selectionValue, setSelectionValue] = useState<string>("");
    const monacoRef = useRef<any>(null);
    const editorRef = useRef<any>(null);
    const changeSubscriptionRef = useRef<any>(null);
    const nodeRef = useRef<HTMLDivElement>(null);
    const commentIconRef = useRef<HTMLDivElement>(null);
    const classes = useStyles();
    const commonCss = commonUseStyles();

    const createEditor = useCallback(() => {
      const model = monacoRef.current.editor.createModel(
        defaultValue,
        language
      );
      editorRef.current = monacoRef.current.editor.create(nodeRef.current, {
        automaticLayout: true
      });
      editorRef.current.setModel(model);

      for (let themeName in MonacoThemes) {
        monacoRef.current.editor.defineTheme(
          themeName,
          MonacoThemes[themeName]
        );
      }

      monacoRef.current.editor.setTheme(theme);
      changeSubscriptionRef.current = model.onDidChangeContent(() => {
        onChangeValue(model.getValue());
      });
      editorRef.current.focus();
      setIsEditorReady(true);
    }, [language, theme]);

    useEffect(() => {
      MonacoIntegrator.init()
        .then((monaco: any) => {
          monacoRef.current = monaco;
          setIsMonacoReady(true);
        })
        .catch(error => {
          console.error(`An error ocurred while initializing monaco ${error}`);
        });

      return () => {
        editorRef.current && editorRef.current.dispose();
        changeSubscriptionRef.current &&
          changeSubscriptionRef.current.dispose();
      };
    }, []);

    useEffect(() => {
      isMonacoReady === true && isEditorReady === false && createEditor();
    }, [isMonacoReady, isEditorReady, createEditor]);

    useEffect(() => {
      if (monacoRef.current !== null) {
        monacoRef.current.editor.setTheme(theme);
      }
    }, [theme]);

    useEffect(() => {
      if (!!selectionValue === true) {
        setShouldDisplayCommentIcon(true);
      }
    }, [selectionValue, selectionRange]);

    useEffect(() => {
      if (editorRef.current !== null) {
        const model = editorRef.current.getModel();
        if (defaultValue !== model.getValue()) {
          model.pushEditOperations(
            [],
            [
              {
                range: model.getFullModelRange(),
                text: defaultValue
              }
            ]
          );
        }
      }
    }, [defaultValue]);

    useImperativeHandle(ref, () => ({
      getEditorRef: () => editorRef.current,
      pushEditOperations,
      setValue,
      disableEditor
    }));

    function pushEditOperations(value: string) {
      if (editorRef.current !== null) {
        const model = editorRef.current.getModel();
        if (value !== model.getValue()) {
          model.pushEditOperations(
            [],
            [
              {
                range: model.getFullModelRange(),
                text: value
              }
            ]
          );
        }
      }
    }

    function setValue(value: string) {
      editorRef.current.getModel().setValue(value);
    }

    function disableEditor(disable = false) {
      if (editorRef.current !== null)
        editorRef.current.updateOptions({
          readOnly: disable
        });
    }

    function colorHighlight() {
      const {
        endColumn,
        endLineNumber,
        startColumn,
        startLineNumber
      } = selectionRange;
      editorRef.current.deltaDecorations(
        [],
        [
          {
            range: new monacoRef.current.Range(
              startLineNumber,
              startColumn,
              endLineNumber,
              endColumn
            ),
            options: {
              inlineClassName: classes.monacoEditorHighlightMainContent
            }
          },
          {
            range: new monacoRef.current.Range(
              startLineNumber,
              1,
              startLineNumber,
              startColumn
            ),
            options: {
              inlineClassName: classes.monacoEditorHighlightRemainingContent
            }
          },
          {
            range: new monacoRef.current.Range(
              endLineNumber,
              endColumn,
              endLineNumber,
              1000
            ),
            options: {
              inlineClassName: classes.monacoEditorHighlightRemainingContent
            }
          }
        ]
      );
    }

    function handleHighlightSelectedValue() {
      colorHighlight();
      onHighlightValue(
        selectionValue,
        commentIconRef.current,
        commentIconRef.current
          ? commentIconRef.current.getBoundingClientRect().top
          : 0
      );
      handleHideCommentIcon();
    }

    function handleHighlightText(e: any) {
      const selection = editorRef.current.getSelection();
      const value = editorRef.current.getModel().getValueInRange(selection);
      if (!!value && value.trim().length > 0) {
        setSelectionRange(selection);
        setMousePosition({ x: e.clientX, y: e.clientY });
        setSelectionValue(value);
      } else {
        handleHideCommentIcon();
      }
    }

    function handleHideCommentIcon() {
      if (shouldDisplayCommentIcon === true) {
        setShouldDisplayCommentIcon(false);
      }
    }

    function handleSaveSourceCode(event: React.KeyboardEvent) {
      if (
        (event.ctrlKey === true || event.metaKey === true) &&
        event.keyCode === 83
      ) {
        event.preventDefault();
        let value = editorRef.current.getModel().getValue();
        onSaveValue(value);
      }
    }

    function renderLoading() {
      return isEditorReady === false ? (
        <div
          className={`${commonCss.flexRow} ${commonCss.center} ${commonCss.fullHeightAndWidth}`}
          style={{
            overflow: "hidden",
            background: color.darkThemeBlack
          }}
        >
          <CircularProgress color="primary" />
        </div>
      ) : null;
    }

    function renderCommentIcon() {
      if (shouldDisplayCommentIcon === false) return null;
      return (
        <div
          onClick={handleHighlightSelectedValue}
          className={classes.monacoEditorCodeCommentIcon}
          ref={commentIconRef}
          style={{
            left: mousePosition.x,
            top: mousePosition.y
          }}
        >
          <Tooltip title="Comment on code" placement="bottom" enterDelay={100}>
            <span className={commonCss.flexRow}>
              <ModeCommentIcon
                style={{
                  color: "#074e68",
                  margin: 12,
                  fontSize: fontsize.base
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
          <div
            onKeyUp={handleHideCommentIcon}
            onKeyDown={handleSaveSourceCode}
            onMouseUp={handleHighlightText}
            ref={nodeRef}
            className={classes.monacoEditor}
          />
        </div>
        {renderCommentIcon()}
      </>
    );
  }
);

export default React.memo(MonacoEditor);
