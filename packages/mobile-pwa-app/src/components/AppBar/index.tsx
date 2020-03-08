import React from 'react';
import { TextField } from '@material-ui/core';
import { Settings as SettingsIcon } from '@material-ui/icons';

import { useStyles } from './styles';
import { useStyles as commonUseStyles, color } from '../../Css';

const AppBar: React.FC = () => {
  const classes = useStyles();
  const commonCss = commonUseStyles();

  function renderAvatar() {
    return <div className={classes.avatarContainer}></div>;
  }

  return (
    <div className={classes.container}>
      <div className={`${classes.appBar} ${commonCss.flexRow}`}>
        <SettingsIcon style={{ color: color.gray60 }} />
        <input type="text" placeholder="Search Javico" className={classes.searchInput} />
        {renderAvatar()}
      </div>
    </div>
  );
};

export default AppBar;
