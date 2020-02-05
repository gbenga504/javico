import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Fab, Tooltip, Menu, MenuItem } from '@material-ui/core';

import { useStyles } from './styles';
import { useStyles as commonUseStyles, color } from '../../Css';
import MonacoIntegrator from '../../utils/MonacoIntegrator';
import MonacoThemes from '../../utils/MonacoThemes';
import { withApi } from '../../utils/ApiConnector';
import { Icon, AnimatedCircularLoader, withNotificationBanner } from '../../atoms';
import SignInViaGithubModal from '../SignInViaGithubModal';
import InlineCodeComment from '../InlineCodeComment';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';
import { getIdFromUrl, updateUrl } from '../../utils/UrlUtils';
import SourceCodeService from '../../services/SourceCodeServices';

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
  onSetNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
  Api: any;
  user: any;
  sourceCodeId: string;
  currentSection: 'comments' | 'console';
  onChangeCurrentSection: () => void;
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
  user: _user,
  ownerId,
  Api,
  sourceCodeId,
  currentSection,
  onChangeCurrentSection,
}) => {
  const [shouldDisplayCommentBox, setShouldDisplayCommentBox] = useState<boolean>(false);
  const [shouldDisplayCommentIcon, setShouldDisplayCommentIcon] = useState<boolean>(false);
  const [isRenameTitle, setIsRenameTitle] = useState<boolean>(false);
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState<any>({});
  const [isMonacoReady, setIsMonacoReady] = useState<boolean>(false);
  const [isEditorReady, setIsEditorReady] = useState<boolean>(false);
  const [selectionRange, setSelectionRange] = useState<any>(null);
  const [selectionValue, setSelectionValue] = useState<string>('');
  const [renameTitleValue, setRenameTitleValue] = useState<string>(sourceCodeTitle);
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
    setRenameTitleValue(sourceCodeTitle);
    // eslint-disable-next-line
  }, [fetchedSourceCode, sourceCodeTitle]);

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
      editorRef.current.updateOptions({ readOnly: !getIdFromUrl() ? false : disable });
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

  function handleShowOptions(event: React.MouseEvent<HTMLButtonElement>) {
    setOptionsAnchorEl(event.currentTarget);
  }

  function handleCloseOptions() {
    setOptionsAnchorEl(null);
  }

  function handleHighlightText(e: any) {
    const selection = editorRef.current.getSelection();
    const value = editorRef.current.getModel().getValueInRange(selection);
    if (!!value && value.trim().length > 0) {
      setSelectionRange(selection);
      setMousePosition({ x: e.clientX, y: e.clientY });
      setSelectionValue(value);
    }
  }

  function handleSaveDeveloperCode() {
    onHandleLoading(true);
    let me = Api.getCurrentUser();
    const id = getIdFromUrl();
    if (id) {
      if (sourceCode === fetchedSourceCode) {
        onHandleLoading();
        onSetNotificationSettings('Your code is up to date', 'info', 'long');
        return;
      }
      SourceCodeService.saveSourceCode({
        data: { sourceCode },
        params: { ID: id },
      })
        .then((res: any) => {
          onHandleLoading();
        })
        .catch((error: any) => {
          onHandleLoading();
          onSetNotificationSettings(error.message, 'danger', 'long');
        });
    } else {
      SourceCodeService.saveSourceCode({
        data: {
          ownerId: me.uid,
          sourceCode,
          readme: '',
          title: 'test.js',
          tags: [],
        },
      })
        .then(res => {
          onHandleLoading();
          onSetSourcecodeOwner({
            sourceCode,
            ownerId: me.uid,
            sourceCodeId: res.id,
          });
          updateUrl(res);
        })
        .catch((error: any) => {
          onHandleLoading();
          onSetNotificationSettings(error.message, 'danger', 'long');
        });
    }
  }

  function handleCloseSignInModal() {
    setIsSignInModalVisible(false);
  }

  function handleOpenSignInModal() {
    setIsSignInModalVisible(true);
  }

  function handleRenameTitleInputKeydown(event: any) {
    if (isRenameTitle) {
      cancelRenameTitle(event);
      saveRenameTitle(event);
    }
  }

  function handleHideCommentIcon() {
    if (shouldDisplayCommentIcon === true) {
      setShouldDisplayCommentIcon(false);
    }
  }

  function cancelRenameTitle(e: any) {
    e = e || window.event;
    var isEscape = false;
    if ('key' in e) {
      isEscape = e.key === 'Escape' || e.key === 'Esc';
    } else {
      isEscape = e.keyCode === 27;
    }
    if (isEscape) {
      setIsRenameTitle(false);
    }
  }

  function saveRenameTitle(e: any) {
    if (e.keyCode === 13) {
      e.preventDefault();
      onHandleLoading(true);
      const id = getIdFromUrl();
      if (id) {
        if (renameTitleValue === sourceCodeTitle) {
          onHandleLoading();
          setIsRenameTitle(false);
          return;
        }
        SourceCodeService.saveSourceCode({
          data: { title: renameTitleValue, sourceCode },
          params: { ID: id },
        })
          .then((res: any) => {
            onHandleLoading();
            setIsRenameTitle(false);
          })
          .catch((error: any) => {
            onHandleLoading();
            setRenameTitleValue(sourceCodeTitle);
            onSetNotificationSettings(error.message, 'danger', 'long');
          });
      }
    }
  }

  function handleRenameTitleChange(event: any) {
    setRenameTitleValue(event.target.value);
  }

  function handleRenameTitle() {
    setIsRenameTitle(true);
    setOptionsAnchorEl(null);
  }

  function handleSaveSourceCode(event: React.KeyboardEvent) {
    if (isRenameTitle) {
      cancelRenameTitle(event);
    }

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

  function renderTitleMenuOptions() {
    return (
      <Menu
        anchorEl={optionsAnchorEl}
        keepMounted
        classes={{
          paper: classes.titleMenuPaper,
        }}
        open={Boolean(optionsAnchorEl)}
        onClose={handleCloseOptions}>
        <MenuItem
          onClick={handleRenameTitle}
          classes={{
            root: classes.titleMenuList,
          }}>
          Rename
        </MenuItem>
        <MenuItem
          classes={{
            root: classes.titleMenuList,
          }}>
          Delete
        </MenuItem>
      </Menu>
    );
  }

  return (
    <>
      <div className={classes.monacoEditorContainer}>
        <div className={classes.monacoEditorTitleHead}>
          {!!sourceCodeTitle ? (
            !isRenameTitle ? (
              <span className={classes.monacoEditorTitle}>
                <span style={{ fontSize: 14, padding: 5 }}>{renameTitleValue}</span>

                <Icon
                  className={classes.monacoEditorTitleMoreIcon}
                  onClick={handleShowOptions}
                  name="more"
                />
              </span>
            ) : (
              <span
                className={classes.monacoEditorTitle}
                style={{ border: `1px solid ${color.themeBlue}` }}>
                <input
                  onKeyDown={handleRenameTitleInputKeydown}
                  onChange={handleRenameTitleChange}
                  className={classes.monacoEditorRenameTitleInput}
                  value={renameTitleValue}
                  autoFocus
                />
              </span>
            )
          ) : null}
        </div>
        {renderTitleMenuOptions()}
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

export default React.memo(withNotificationBanner(withApi(MonacoEditor)));
