import React, { useState, useEffect } from 'react';
import { makeStyles, MenuItem, Menu } from '@material-ui/core';

import { color } from '../../Css';
import { Icon, withNotificationBanner } from '../../atoms';
import { getIdFromUrl, updateUrl } from '../../utils/UrlUtils';
import SourceCodeService from '../../services/SourceCodeServices';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';

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
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | HTMLElement>(null);
  const [isRenameTitle, setIsRenameTitle] = useState<boolean>(false);
  const [renameTitleValue, setRenameTitleValue] = useState<string>(sourceCodeTitle);
  const classes = useStyles();

  useEffect(() => {
    setRenameTitleValue(sourceCodeTitle);
  }, [sourceCodeTitle]);

  function handleShowOptions(event: React.MouseEvent<HTMLButtonElement>) {
    setOptionsAnchorEl(event.currentTarget);
  }

  function handleCloseOptions() {
    setOptionsAnchorEl(null);
  }

  function handleRenameTitle() {
    setIsRenameTitle(true);
    setOptionsAnchorEl(null);
  }

  function upsertSourcecodeCb() {
    onHandleLoading();
    closeRenameTitle();
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

  function saveRenameTitle(e: any) {
    if (e.keyCode === 13) {
      e.preventDefault();
      onHandleLoading(true);
      const id = getIdFromUrl();
      if (id) {
        if (renameTitleValue === sourceCodeTitle) {
          onHandleLoading();
          closeRenameTitle();
          return;
        }
        let data = { title: renameTitleValue, sourceCode };
        updateSourcecode(data, id);
      } else {
        let data = {
          ownerId: user.uid,
          sourceCode,
          readme: '',
          title: renameTitleValue,
          tags: [],
        };
        saveSourceCode(data);
      }
    }
  }

  function saveSourceCode(data: any) {
    SourceCodeService.saveSourceCode({
      data,
    })
      .then(res => {
        onSetSourcecodeOwner({
          sourceCode,
          ownerId: user.uid,
          sourceCodeId: res.id,
        });
        updateUrl(res);
        fetchSourceCode(upsertSourcecodeCb());
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
        fetchSourceCode(upsertSourcecodeCb());
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

  const isOwner = user ? user.uid === ownerId : false;

  return (
    <div className={classes.monacoEditorTitleHead}>
      {!isRenameTitle ? (
        <>
          {(!isFetchingSourcecode || getIdFromUrl()) && (
            <span className={classes.monacoEditorTitle}>
              <span style={{ fontSize: 14, padding: 5 }}>
                {!!sourceCodeTitle ? `${sourceCodeTitle}.js` : getIdFromUrl() ? '' : 'Untitled.js'}
              </span>
              {(isOwner || !getIdFromUrl()) && (
                <Icon
                  className={`${classes.commentTitleMenuIcon} comment__hide-title-menu-icon`}
                  onClick={handleShowOptions}
                  name="more"
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
          <Icon
            className={classes.commentTitleMenuIcon}
            onClick={closeRenameTitle}
            style={{
              fontSize: 14,
            }}
            name="close"
          />
        </span>
      )}
      {renderTitleMenuOptions()}
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
    // '&:hover .comment__hide-title-menu-icon': {
    //   display: 'block',
    // },
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
