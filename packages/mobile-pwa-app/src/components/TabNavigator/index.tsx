import React from 'react';
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
import { IMenus } from '../../App';

const menuList = [
  { text: 'Editor', action: 'editor', icon: CodeIcon },
  { text: 'Comment', action: 'comment', icon: CommentIcon },
  { text: 'ReadMe', action: 'readme', icon: ReadMeIcon },
  { text: 'Action', action: 'action', icon: CallToActionIcon },
] as Array<{ text: string; action: IMenus; icon: any }>;

const TabNavigator: React.FC<{
  activeMenu: string;
  onSetActiveMenu: (menu: IMenus) => any;
  onHandleToggleActionsModal: () => void;
}> = ({ activeMenu, onSetActiveMenu, onHandleToggleActionsModal }) => {
  const classes = useStyles();
  const commonCss = commonUseStyles();

  function handleSetActiveMenu(activeMenu: IMenus) {
    if (activeMenu === 'action') return onHandleToggleActionsModal();
    onSetActiveMenu(activeMenu);
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
            onClick={() => handleSetActiveMenu(menu.action)}>
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

export default TabNavigator;
