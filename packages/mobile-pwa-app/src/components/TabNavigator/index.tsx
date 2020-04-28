import React, { useState } from 'react';
import {
  ModeComment as CommentIcon,
  Code as CodeIcon,
  MenuBook as ReadMeIcon,
  MoreVert as CallToActionIcon,
} from '@material-ui/icons';
import { ButtonBase } from '@material-ui/core';
import { Typography } from '@javico/common/lib/components';
import { useStyles as commonUseStyles, color } from '@javico/common/lib/design-language/Css';

import { useStyles } from './styles';
import { Paths } from '../../Routes';
import history from '../../history';

type IMenus = 'editor' | 'comment' | 'readme' | 'action';

const TabNavigator: React.FC<{
  onToggleActionsModal: () => void;
}> = ({ onToggleActionsModal }) => {
  const [activeMenu, setActiveMenu] = useState<IMenus>('editor');
  const classes = useStyles();
  const commonCss = commonUseStyles();

  const menuList = [
    { text: 'Editor', action: 'editor', icon: CodeIcon, path: Paths.EDITOR },
    { text: 'Comment', action: 'comment', icon: CommentIcon, path: Paths.COMMENT },
    { text: 'ReadMe', action: 'readme', icon: ReadMeIcon, path: Paths.README },
    { text: 'Action', action: 'action', icon: CallToActionIcon },
  ] as Array<{ text: string; action: IMenus; icon: any; path?: string }>;

  function handleSetActiveMenu(activeMenu: IMenus, path: string | undefined) {
    if (activeMenu === 'action') return onToggleActionsModal();
    setActiveMenu(activeMenu);
    path !== undefined && history.push(path);
  }

  return (
    <div className={`${classes.container} ${commonCss.flexRow}`}>
      {menuList.map((menu, index) => {
        let Icon = menu.icon;
        let isMenuActive = activeMenu === menu.action;
        return (
          <ButtonBase
            key={index}
            className={classes.menuButton}
            style={{ width: menu.action === 'action' ? 50 : '100%' }}
            onClick={() => handleSetActiveMenu(menu.action, menu.path)}>
            <Icon style={{ color: isMenuActive ? color.themeBlue : '#5F6368' }} />
            {isMenuActive && (
              <p style={{ margin: 0 }}>
                <Typography style={{ color: color.themeBlue, marginTop: 2 }}>
                  {menu.text}
                </Typography>
              </p>
            )}
          </ButtonBase>
        );
      })}
    </div>
  );
};

export default React.memo(TabNavigator);
