import React, { useState } from 'react';
import { Settings as SettingsIcon } from '@material-ui/icons';
import { useStyles as commonUseStyles, color } from '@javico/common/lib/design-language/Css';

import { useStyles } from './styles';
import ProfilePreviewModal from '../ProfilePreviewModal';

const AppBar: React.FC = () => {
  const classes = useStyles();
  const commonCss = commonUseStyles();
  const [anchorElForProfilePreview, setAnchorElForProfilePreview] = useState<HTMLDivElement | null>(
    null,
  );
  const isVisible = Boolean(anchorElForProfilePreview);
  const profilePreviewId = isVisible ? 'profile-popover' : undefined;

  function handleOpenProfilePreview(event: React.MouseEvent<HTMLDivElement>) {
    setAnchorElForProfilePreview(event.currentTarget);
  }

  function handleCloseProfilePreview() {
    setAnchorElForProfilePreview(null);
  }

  function renderAvatar() {
    return <div className={classes.avatarContainer} onClick={handleOpenProfilePreview}></div>;
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
        isVisible={isVisible}
        id={profilePreviewId}
        anchorElement={anchorElForProfilePreview}
        onRequestClose={handleCloseProfilePreview}
      />
    </React.Fragment>
  );
};

export default AppBar;
