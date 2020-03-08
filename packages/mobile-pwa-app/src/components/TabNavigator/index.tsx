import React, { useState } from 'react';
import {
  ModeComment as CommentIcon,
  Code as CodeIcon,
  MenuBook as ReadMeIcon,
  MoreVert as CallToActionIcon,
} from '@material-ui/icons';
import { ButtonBase } from '@material-ui/core';

import { useStyles } from './styles';
import { useStyles as commonUseStyles, color } from '../../Css';
import Typography from '../../atoms/Typography';
import ActionsModal from '../ActionsModal';

type Menus = 'editor' | 'comment' | 'readme' | 'action';
const menuList = [
  { text: 'Editor', action: 'editor', icon: CodeIcon },
  { text: 'Comment', action: 'comment', icon: CommentIcon },
  { text: 'ReadMe', action: 'readme', icon: ReadMeIcon },
  { text: 'Action', action: 'action', icon: CallToActionIcon },
] as Array<{ text: string; action: Menus; icon: any }>;

const TabNavigator: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<Menus>('editor');
  const [isActionsModalVisible, setIsActionsModalVisible] = useState<boolean>(false);
  const classes = useStyles();
  const commonCss = commonUseStyles();

  function handleSetActiveMenu(activeMenu: Menus) {
    setActiveMenu(activeMenu);
    handleActions(activeMenu);
  }

  function handleToggleActionsModal() {
    setIsActionsModalVisible(!isActionsModalVisible);
  }

  function handleActions(action: Menus) {
    switch (action) {
      case 'action':
        handleToggleActionsModal();
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div className={`${classes.container} ${commonCss.flexRow}`}>
        {menuList.map((menu, index) => {
          let Icon = menu.icon;
          let isMenuActive = activeMenu === menu.action;
          return (
            <ButtonBase
              key={index}
              className={classes.menuButton}
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
      <ActionsModal onRequestClose={handleToggleActionsModal} isVisible={isActionsModalVisible} />
    </>
  );
};

export default TabNavigator;
