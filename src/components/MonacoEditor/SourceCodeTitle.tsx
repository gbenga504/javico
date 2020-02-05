import React, { useState, useEffect } from 'react';
import { makeStyles, MenuItem, Menu } from '@material-ui/core';

import { color } from '../../Css';
import { Icon, withNotificationBanner } from '../../atoms';
import { getIdFromUrl } from '../../utils/UrlUtils';
import SourceCodeService from '../../services/SourceCodeServices';
import { IBannerStyle, IDuration } from '../../atoms/NotificationBanner';

interface IProps {
  sourceCodeTitle: string;
  onHandleLoading: any;
  sourceCode: string;
  onSetNotificationSettings: (text: string, style?: IBannerStyle, duration?: IDuration) => null;
}

const SourceCodeTitle: React.FC<IProps> = ({
  onSetNotificationSettings,
  sourceCodeTitle,
  onHandleLoading,
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

  function handleRenameTitleInputKeydown(event: any) {
    if (isRenameTitle) {
      cancelRenameTitle(event);
      saveRenameTitle(event);
    }
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
    <div className={classes.monacoEditorTitleHead}>
      {!!sourceCodeTitle ? (
        !isRenameTitle ? (
          <span className={classes.monacoEditorTitle}>
            <span style={{ fontSize: 14, padding: 5 }}>{renameTitleValue}.js</span>

            <Icon
              className={`comment__hide-title-menu-icon`}
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
      cursor: 'pointer',
      fontSize: 20,
      display: 'none',
    },
    '&:hover .comment__hide-title-menu-icon': {
      display: 'block',
    },
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

export default withNotificationBanner(SourceCodeTitle);
