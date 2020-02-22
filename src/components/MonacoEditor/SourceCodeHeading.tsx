import React, { useState, useEffect } from 'react';
import { makeStyles, MenuItem, Menu, IconButton, Tooltip } from '@material-ui/core';
import {
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  DeviceHub as DeviceHubIcon,
  NoteAdd as NoteAddIcon,
} from '@material-ui/icons';

import { useStyles as commonUseStyles, color } from '../../Css';
import { withNotificationBanner } from '../../atoms';
import { getSourceCodeIdFromUrl, updateUrl } from '../../utils/UrlUtils';
import SourceCodeService from '../../services/SourceCodeServices';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';
import SignInViaGithubModal from '../SignInViaGithubModal';

interface IProps {
  sourceCodeTitle: string;
  isFetchingSourcecode: boolean;
  onSetSourcecodeOwner: any;
  onHandleLoading: (isLoading?: boolean) => void;
  fetchSourceCode: (cb: any) => void;
  sourceCode: string;
  ownerId: string;
  user: any;
  onSetNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
}

const SourceCodeHeading: React.FC<IProps> = ({
  onSetNotificationSettings,
  sourceCodeTitle,
  onSetSourcecodeOwner,
  isFetchingSourcecode,
  fetchSourceCode,
  onHandleLoading,
  ownerId,
  user,
  sourceCode,
}) => {
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | SVGSVGElement>(null);
  const [isRenameTitle, setIsRenameTitle] = useState<boolean>(false);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState<boolean>(false);
  const [renameTitleValue, setRenameTitleValue] = useState<string>(sourceCodeTitle);
  const classes = useStyles();
  const commonCss = commonUseStyles();

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
      onHandleLoading(true);
      const id = getSourceCodeIdFromUrl();
      if (!renameTitleValue) {
        onSetNotificationSettings("Sourcecode title can't be empty", 'danger', 'long');
        onHandleLoading();
        return;
      }
      if (id) {
        if (renameTitleValue === sourceCodeTitle) {
          onHandleLoading();
          closeRenameTitle();
          return;
        }
        let data = { title: renameTitleValue, sourceCode };
        updateSourcecode(data, id);
      } else {
        if (!!user) {
          saveSourceCode(user);
        } else {
          onHandleLoading();
          setIsSignInModalVisible(true);
        }
      }
    }
  }

  function saveSourceCode(user: any) {
    let data = {
      ownerId: user.uid,
      sourceCode,
      readme: '',
      title: renameTitleValue,
      tags: [],
    };
    SourceCodeService.saveSourceCode({
      data,
    })
      .then(res => {
        onSetSourcecodeOwner({
          sourceCode,
          ownerId: user.uid,
          sourceCodeId: res.id,
        });
        updateUrl(res, user.uid);
        fetchSourceCode(onHandleLoading());
      })
      .catch((error: any) => {
        onHandleLoading();
        onSetNotificationSettings(error.message, 'danger', 'long');
      });
  }

  function updateSourcecode(data: any, id: any) {
    SourceCodeService.saveSourceCode({
      data,
      params: { ID: id },
    })
      .then((res: any) => {
        fetchSourceCode(onHandleLoading());
      })
      .catch((error: any) => {
        onHandleLoading();
        setRenameTitleValue(sourceCodeTitle);
        onSetNotificationSettings(error.message, 'danger', 'long');
      });
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
    const isOwner = user ? user.uid === ownerId : false;
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
                  (!user === true && !ownerId === true)) && (
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
      <div style={{ display: 'flex', flex: 0.8, height: '100%' }}>
        {renderSourcecodeTitle()}
        {renderTitleMenuOptions()}
      </div>
      <div className={`${classes.createSourcecode} ${commonCss.flexRow} ${commonCss.center}`}>
        <Tooltip title="Fork project" leaveDelay={100} placement="bottom" enterDelay={100}>
          <IconButton color="secondary" classes={{ root: classes.createSourcecodeButton }}>
            <DeviceHubIcon className={classes.createSourcecodeIcon} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Create new project" leaveDelay={100} placement="bottom" enterDelay={100}>
          <IconButton color="secondary" classes={{ root: classes.createSourcecodeButton }}>
            <NoteAddIcon className={classes.createSourcecodeIcon} />
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
    flex: 0.2,
  },
  createSourcecodeButton: { padding: '0 12px' },
  createSourcecodeIcon: { color: color.white },
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
