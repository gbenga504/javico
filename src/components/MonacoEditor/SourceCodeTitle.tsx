import React from 'react';
import { makeStyles } from '@material-ui/core';

import { color } from '../../Css';
import { Icon } from '../../atoms';

interface IProps {
  sourceCodeTitle: string;
  onHandleRenameTitleChange: any;
  isRenameTitle: boolean;
  onHandleShowOptions: any;
  renameTitleValue: string;
  onHandleRenameTitleInputKeydown: any;
}

const SourceCodeTitle: React.FC<IProps> = ({
  sourceCodeTitle,
  onHandleRenameTitleChange,
  isRenameTitle,
  onHandleShowOptions,
  renameTitleValue,
  onHandleRenameTitleInputKeydown,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.monacoEditorTitleHead}>
      {!!sourceCodeTitle ? (
        !isRenameTitle ? (
          <span className={classes.monacoEditorTitle}>
            <span style={{ fontSize: 14, padding: 5 }}>{renameTitleValue}.js</span>

            <Icon
              className={`comment__hide-title-menu-icon`}
              onClick={onHandleShowOptions}
              name="more"
            />
          </span>
        ) : (
          <span
            className={classes.monacoEditorTitle}
            style={{ border: `1px solid ${color.themeBlue}` }}>
            <input
              onKeyDown={onHandleRenameTitleInputKeydown}
              onChange={onHandleRenameTitleChange}
              className={classes.monacoEditorRenameTitleInput}
              value={renameTitleValue}
              autoFocus
            />
          </span>
        )
      ) : null}
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

export default SourceCodeTitle;
