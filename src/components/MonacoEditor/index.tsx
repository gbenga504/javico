import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Fab, Tooltip } from '@material-ui/core';
import { ModeComment as ModeCommentIcon, PlayArrow as PlayArrowIcon } from '@material-ui/icons';

import { useStyles } from './styles';
import { useStyles as commonUseStyles, color } from '../../Css';
import MonacoIntegrator from '../../utils/MonacoIntegrator';
import MonacoThemes from '../../utils/MonacoThemes';
import { withApi } from '../../utils/ApiConnector';
import { AnimatedCircularLoader, withNotificationBanner } from '../../atoms';
import SignInViaGithubModal from '../SignInViaGithubModal';
import InlineCodeComment from '../InlineCodeComment';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';
import { getSourceCodeIdFromUrl, updateUrl } from '../../utils/UrlUtils';
import SourceCodeService from '../../services/SourceCodeServices';
import SourceCodeHeading from './SourceCodeHeading';

interface IProps {
  value?: string;
  onRunSourceCode?: (value: string) => void;
  theme?: 'light' | 'dark' | 'ace' | 'night-dark';
  language?: string;
  onHandleLoading: any;
  fetchedSourceCode: string;
  sourceCodeTitle: string;
  onSetSourcecodeOwner: any;
  ownerId: string;
  isFetchingSourcecode: boolean;
  onSetNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
  Api: any;
  user: any;
  sourceCodeId: string;
  currentSection: 'comments' | 'console';
  onChangeCurrentSection: () => void;
  fetchSourceCode: (cb: any) => void;
}

const MonacoEditor: React.FC<IProps> = ({
  value,
  onRunSourceCode,
  theme = 'vs-dark',
  onHandleLoading,
  language = 'javascript',
  fetchedSourceCode,
  onSetNotificationSettings,
  sourceCodeTitle,
  onSetSourcecodeOwner,
  isFetchingSourcecode,
  user: _user,
  ownerId,
  Api,
  sourceCodeId,
  currentSection,
  onChangeCurrentSection,
  fetchSourceCode,
}) => {
  const [shouldDisplayCommentBox, setShouldDisplayCommentBox] = useState<boolean>(false);
  const [shouldDisplayCommentIcon, setShouldDisplayCommentIcon] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<any>({});
  const [isMonacoReady, setIsMonacoReady] = useState<boolean>(false);
  const [isEditorReady, setIsEditorReady] = useState<boolean>(false);
  const [selectionRange, setSelectionRange] = useState<any>(null);
  const [selectionValue, setSelectionValue] = useState<string>('');
  const [user, setUser] = useState<any>(_user);
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
      .catch(error => {
        console.error(`An error ocurred while initializing monaco ${error}`);
      });

    return () => {
      editorRef.current && editorRef.current.dispose();
      subscriptionRef.current && subscriptionRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (editorRef.current !== null) {
      editorRef.current.getModel().setValue(fetchedSourceCode);
      disableEditor(user ? user.uid !== ownerId : true);
    }
    // eslint-disable-next-line
  }, [fetchedSourceCode]);

  useEffect(() => {
    if (_user) {
      setUser(_user);
      disableEditor(_user.uid !== ownerId);
    } else {
      setUser(null);
      disableEditor(true);
    }
  }, [_user, ownerId]);

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
    if (!!selectionValue === true) {
      setShouldDisplayCommentIcon(true);
    }
  }, [selectionValue, selectionRange]);

  function handleSourceCodeExecution() {
    onRunSourceCode && onRunSourceCode(sourceCode);
  }

  function disableEditor(disable = false) {
    if (editorRef.current !== null)
      editorRef.current.updateOptions({ readOnly: !getSourceCodeIdFromUrl() ? false : disable });
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
    setSelectionValue('');
    setShouldDisplayCommentIcon(false);
    editorRef.current.getModel().setValue(sourceCode);
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

  function updateSourcecode(id: string, data: any) {
    SourceCodeService.saveSourceCode({
      data,
      params: { ID: id },
    })
      .then((res: any) => {
        fetchSourceCode(onHandleLoading());
      })
      .catch((error: any) => {
        onHandleLoading();
        onSetNotificationSettings(error.message, 'danger', 'long');
      });
  }

  function saveNewSourcecode(data: any) {
    let me = Api.getCurrentUser();
    onHandleLoading(true);
    SourceCodeService.saveSourceCode({
      data: {
        ownerId: me.uid,
        ...data,
      },
    })
      .then(res => {
        onHandleLoading();
        onSetSourcecodeOwner({
          sourceCode,
          ownerId: me.uid,
          sourceCodeId: res.id,
        });
        updateUrl(res, me.uid);
        fetchSourceCode(onHandleLoading());
      })
      .catch((error: any) => {
        onHandleLoading();
        onSetNotificationSettings(error.message, 'danger', 'long');
      });
  }

  function handleSaveDeveloperCode() {
    const id = getSourceCodeIdFromUrl();
    if (id) {
      if (sourceCode === fetchedSourceCode) {
        onSetNotificationSettings('Your code is up to date', 'info', 'long');
        return;
      }
      onHandleLoading(true);
      updateSourcecode(id, { sourceCode });
    } else {
      const data = {
        sourceCode,
        readme: '',
        title: 'Untitled',
        tags: [],
      };
      saveNewSourcecode(data);
    }
  }

  function handleCloseSignInModal() {
    setIsSignInModalVisible(false);
  }

  function handleOpenSignInModal() {
    setIsSignInModalVisible(true);
  }

  function handleHideCommentIcon() {
    if (shouldDisplayCommentIcon === true) {
      setShouldDisplayCommentIcon(false);
    }
  }

  function handleSaveSourceCode(event: React.KeyboardEvent) {
    if ((event.ctrlKey === true || event.metaKey === true) && event.keyCode === 83) {
      event.preventDefault();

      let me = Api.getCurrentUser();
      if (!!me && me.email) {
        handleSaveDeveloperCode();
      } else {
        handleOpenSignInModal();
      }
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
            <ModeCommentIcon
              style={{
                color: '#074e68',
                margin: 12,
                fontSize: 14,
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
        <SourceCodeHeading
          sourceCodeTitle={sourceCodeTitle}
          onHandleLoading={onHandleLoading}
          saveNewSourcecode={saveNewSourcecode}
          updateSourcecode={updateSourcecode}
          isFetchingSourcecode={isFetchingSourcecode}
          onSetSourcecodeOwner={onSetSourcecodeOwner}
          sourceCode={sourceCode}
          onHandleOpenSignInModal={handleOpenSignInModal}
          user={user}
          ownerId={ownerId}
          fetchSourceCode={fetchSourceCode}
          isOwner={user ? user.uid === ownerId : false}
        />
        {renderLoading()}
        <div
          onKeyUp={handleHideCommentIcon}
          onKeyDown={handleSaveSourceCode}
          onMouseUp={handleHighlightText}
          ref={nodeRef}
          className={classes.monacoEditor}
        />
        {shouldDisplayCommentBox && (
          <InlineCodeComment
            onHideCommentBox={handleHideCommentBox}
            onOpenSignInModal={handleOpenSignInModal}
            user={user}
            mousePosition={mousePosition}
            sourceCodeId={sourceCodeId}
            codeReference={selectionValue}
            currentSection={currentSection}
            onChangeCurrentSection={onChangeCurrentSection}
          />
        )}
      </div>
      <Fab
        color="primary"
        onClick={handleSourceCodeExecution}
        variant="round"
        classes={{ root: classes.monacoEditorRunButton }}>
        <PlayArrowIcon className={classes.monacoEditorRunButtonIcon} />
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

export default React.memo(withNotificationBanner(withApi(MonacoEditor)));
