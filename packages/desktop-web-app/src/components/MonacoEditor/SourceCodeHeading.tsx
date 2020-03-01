import React, { useState, useEffect } from 'react';
import { makeStyles, MenuItem, Menu, IconButton, Tooltip } from '@material-ui/core';
import {
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  DeviceHub as ForkIcon,
  NoteAdd as AddNewSourceCodeIcon,
} from '@material-ui/icons';

import { useStyles as commonUseStyles, color } from '../../Css';
import { withNotificationBanner } from '../../atoms';
import { getSourceCodeIdFromUrl } from '../../utils/UrlUtils';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';
import SignInViaGithubModal from '../SignInViaGithubModal';

interface IProps {
  sourceCodeTitle: string;
  isFetchingSourcecode: boolean;
  onHandleLoading: (isLoading?: boolean) => void;
  saveNewSourcecode: (data: any) => void;
  updateSourcecode: (id: string, data: any) => void;
  sourceCode: string;
  ownerId: string;
  readme: string;
  user: any;
  onSetNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
}

const SourceCodeHeading: React.FC<IProps> = ({
  onSetNotificationSettings,
  sourceCodeTitle,
  isFetchingSourcecode,
  saveNewSourcecode,
  updateSourcecode,
  onHandleLoading,
  ownerId,
  readme,
  user,
  sourceCode,
}) => {
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | SVGSVGElement>(null);
  const [isRenameTitle, setIsRenameTitle] = useState<boolean>(false);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState<boolean>(false);
  const [renameTitleValue, setRenameTitleValue] = useState<string>(sourceCodeTitle);
  const [activeAction, setActiveAction] = useState<'' | 'fork' | 'create'>('');
  const classes = useStyles();
  const commonCss = commonUseStyles();
  const isOwner = user ? user.uid === ownerId : false;

  useEffect(() => {
    setRenameTitleValue(sourceCodeTitle);
    if (isRenameTitle) {
      setIsRenameTitle(false);
    }
    // eslint-disable-next-line
  }, [sourceCodeTitle]);

  function handleShowOptions(event: React.MouseEvent<SVGSVGElement>) {
    setOptionsAnchorEl(event.currentTarget);
  }

  function handleCloseOptions() {
    setOptionsAnchorEl(null);
  }

  function handleRenameTitle() {
    setIsRenameTitle(true);
    setOptionsAnchorEl(null);
  }

  function cancelRenameTitle(e: any) {
    e = e || window.event;
    let isEscape = false;
    if ('key' in e) {
      isEscape = e.key === 'Escape' || e.key === 'Esc';
    } else {
      isEscape = e.keyCode === 27;
    }
    if (isEscape) {
      closeRenameTitle();
    }
  }

  function handleRenameTitleChange(event: any) {
    setRenameTitleValue(event.target.value);
  }

  function handleCloseSignInModal() {
    setIsSignInModalVisible(false);
  }

  function saveRenameTitle(e: any) {
    if (e.keyCode === 13) {
      e.preventDefault();
      const id = getSourceCodeIdFromUrl();
      if (!renameTitleValue) {
        onSetNotificationSettings("Sourcecode title can't be empty", 'danger', 'long');
        return;
      }
      onHandleLoading(true);
      if (id) {
        if (renameTitleValue === sourceCodeTitle) {
          onHandleLoading();
          closeRenameTitle();
          return;
        }
        let data = { title: renameTitleValue, sourceCode };
        updateSourcecode(id, data);
      } else {
        if (!!user) {
          saveSourceCode();
        } else {
          onHandleLoading();
          setIsSignInModalVisible(true);
        }
      }
    }
  }

  function forkSourcecode() {
    let data = {
      sourceCode,
      readme,
      title: renameTitleValue,
      tags: [],
      fork: {
        ownerId,
        sourcecodeId: getSourceCodeIdFromUrl(),
      },
    };
    if (!user) {
      setIsSignInModalVisible(true);
      setActiveAction('fork');
      return;
    }
    saveNewSourcecode(data);
  }

  function createNewSourcecode() {
    if (!user) {
      setIsSignInModalVisible(true);
      setActiveAction('create');
      return;
    }
    let data = {
      sourceCode: '',
      readme: '',
      title: 'Untitled',
      tags: [],
    };
    saveNewSourcecode(data);
  }

  function saveSourceCode() {
    let data;
    if (activeAction === 'fork') {
      data = {
        sourceCode,
        readme,
        title: renameTitleValue,
        tags: [],
        fork: {
          ownerId,
          sourcecodeId: getSourceCodeIdFromUrl(),
        },
      };
      setActiveAction('');
    } else if (activeAction === 'create') {
      data = {
        sourceCode: '',
        readme: '',
        title: 'Untitled',
        tags: [],
      };
      setActiveAction('');
    } else {
      data = {
        sourceCode,
        readme: '',
        title: renameTitleValue,
        tags: [],
      };
    }

    saveNewSourcecode(data);
  }

  function handleRenameTitleInputKeydown(event: any) {
    if (isRenameTitle) {
      cancelRenameTitle(event);
      saveRenameTitle(event);
    }
  }

  function closeRenameTitle() {
    setIsRenameTitle(false);
    setRenameTitleValue(sourceCodeTitle);
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
      </Menu>
    );
  }

  function renderSourcecodeTitle() {
    return (
      <>
        {!isRenameTitle ? (
          <>
            {(!isFetchingSourcecode || getSourceCodeIdFromUrl()) && (
              <span className={classes.monacoEditorTitle}>
                <span style={{ fontSize: 14, padding: 5 }}>
                  {!!sourceCodeTitle
                    ? `${sourceCodeTitle}.js`
                    : getSourceCodeIdFromUrl()
                    ? ''
                    : 'Untitled.js'}
                </span>
                {(isOwner ||
                  !getSourceCodeIdFromUrl() ||
                  (!user === true && !ownerId === true && !!ownerId)) && (
                  <MoreVertIcon
                    className={`${classes.commentTitleMenuIcon} comment__hide-title-menu-icon`}
                    onClick={e => handleShowOptions(e)}
                  />
                )}
              </span>
            )}
          </>
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
            <CloseIcon
              className={classes.commentTitleMenuIcon}
              onClick={closeRenameTitle}
              style={{
                fontSize: 14,
              }}
            />
          </span>
        )}
      </>
    );
  }

  return (
    <div className={classes.monacoEditorTitleHead}>
      <div style={{ display: 'flex', flex: 0.9, height: '100%' }}>
        {renderSourcecodeTitle()}
        {renderTitleMenuOptions()}
      </div>
      <div className={`${classes.createSourcecode} ${commonCss.flexRow}`}>
        {!!ownerId && !isOwner && (
          <Tooltip title="Fork project" leaveDelay={100} placement="bottom" enterDelay={100}>
            <IconButton
              onClick={forkSourcecode}
              color="secondary"
              classes={{ root: classes.createSourcecodeButton }}>
              <ForkIcon className={classes.createSourcecodeIcon} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Create new project" leaveDelay={100} placement="bottom" enterDelay={100}>
          <IconButton
            onClick={createNewSourcecode}
            color="secondary"
            classes={{ root: classes.createSourcecodeButton }}>
            <AddNewSourceCodeIcon className={classes.createSourcecodeIcon} />
          </IconButton>
        </Tooltip>
      </div>
      <SignInViaGithubModal
        visible={isSignInModalVisible}
        onRequestClose={handleCloseSignInModal}
        onSignInSuccess={saveSourceCode}
      />
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  monacoEditorTitleHead: {
    height: 30,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: color.darkThemeLightBorder,
  },
  createSourcecode: {
    flex: 0.1,
  },
  createSourcecodeButton: {
    padding: '0 12px',
  },
  createSourcecodeIcon: {
    color: color.white,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      color: color.themeBlue,
    },
  },
  monacoEditorTitle: {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: color.deepBlue,
    height: '100%',
    cursor: 'default',
    padding: 10,
    '& .comment__hide-title-menu-icon': {
      display: 'block',
    },
  },
  commentTitleMenuIcon: {
    cursor: 'pointer',
    fontSize: 20,
    visibility: 'visible',
    color: color.white,
  },
  monacoEditorRenameTitleInput: {
    backgroundColor: 'transparent',
    outline: 'none',
    color: color.white,
    fontSize: 14,
    border: 'none',
  },
  titleMenuPaper: {
    backgroundColor: color.deepBlue,
  },
  titleMenuList: {
    backgroundColor: color.darkThemeLightBorder,
    color: color.white,
    '&:hover': {
      backgroundColor: color.deepBlue,
    },
  },
}));

export default withNotificationBanner(SourceCodeHeading);
