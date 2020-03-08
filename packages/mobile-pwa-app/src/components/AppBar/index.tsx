import React, { useState } from 'react';
import { Settings as SettingsIcon } from '@material-ui/icons';

import { useStyles } from './styles';
import { useStyles as commonUseStyles, color } from '../../Css';
import ProfilePreviewModal from '../ProfilePreviewModal';

const AppBar: React.FC = () => {
  const classes = useStyles();
  const commonCss = commonUseStyles();
  const [isProfilePreviewModalVisible, setIsProfilePreviewModalVisible] = useState<boolean>(false);

  function renderAvatar() {
    return (
      <div
        className={classes.avatarContainer}
        onClick={() => setIsProfilePreviewModalVisible(true)}></div>
    );
  }

  return (
    <React.Fragment>
      <div className={classes.container}>
        <div className={`${classes.appBar} ${commonCss.flexRow}`}>
          <SettingsIcon style={{ color: color.gray60 }} />
          <input type="text" placeholder="Search Javico" className={classes.searchInput} />
          {renderAvatar()}
        </div>
      </div>
      <ProfilePreviewModal
        isVisible={isProfilePreviewModalVisible}
        onRequestClose={() => setIsProfilePreviewModalVisible(false)}
      />
    </React.Fragment>
  );
};

export default AppBar;
