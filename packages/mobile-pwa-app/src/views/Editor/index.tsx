import React, { useRef, useEffect, useState } from 'react';
import { makeStyles, IconButton, Menu, MenuItem } from '@material-ui/core';
import {
  Menu as MenuIcon,
  MoreVert as MoreVertIcon,
  ModeComment as ModeCommentIcon,
  MenuBook as MenuBookIcon,
  PlayArrow as PlayArrowIcon,
} from '@material-ui/icons';
import { color, useStyles as commonCss, fontsize } from '@javico/common/lib/design-language/Css';

import UserImg from '../../assets/images/user.svg';
import Comments from './Comments';
import Terminal from './Terminal';
import Readme from './Readme';

const MonacoEditor: React.FC<{ setIsSideBarVisible: () => void }> = ({ setIsSideBarVisible }) => {
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | SVGSVGElement>(null);
  const [isScrollUp, setIsScrollUp] = useState<boolean>(true);
  const [isCommentVisible, setIsCommentVisible] = useState<boolean>(false);
  const [isTerminalVisible, setIsTerminalVisible] = useState<boolean>(false);
  const [isReadmeVisible, setIsReadmeVisible] = useState<boolean>(false);
  const classes = useStyles();
  const commonClass = commonCss();
  const navRef = useRef<any>(null);

  useEffect(() => {
    const tempNavRef: any = navRef.current;

    var c: any,
      currentScrollTop = 0;

    function handleScroll() {
      var a = tempNavRef.scrollTop;
      var b = 50;

      currentScrollTop = a;

      if (c < currentScrollTop && a > b) {
        setIsScrollUp(false);
      } else if (c > currentScrollTop && !(a <= b)) {
        setIsScrollUp(true);
      }
      c = currentScrollTop;
    }

    tempNavRef.addEventListener('scroll', handleScroll);

    return () => {
      tempNavRef.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isScrollUp) {
      setTimeout(cancelScrollUp, 5000);
    }
  }, [isScrollUp]);

  function cancelScrollUp() {
    setIsScrollUp(false);
  }

  function handleOpenComment() {
    if (!isCommentVisible) setIsCommentVisible(true);
  }

  function handleOpenReadme() {
    if (!isReadmeVisible) setIsReadmeVisible(true);
  }

  function handleSourceCodeExec() {
    if (!isTerminalVisible) setIsTerminalVisible(true);
  }

  function handleShowOptions(event: React.MouseEvent<SVGSVGElement>) {
    setOptionsAnchorEl(event.currentTarget);
  }

  function handleCloseOptions() {
    setOptionsAnchorEl(null);
  }

  function renderSourcecodeOptions() {
    return (
      <Menu
        anchorEl={optionsAnchorEl}
        keepMounted
        classes={{
          paper: classes.optionsMenuPaper,
        }}
        open={Boolean(optionsAnchorEl)}
        onClose={handleCloseOptions}>
        <MenuItem
          // onClick={handleRenameTitle}
          classes={{
            root: classes.titleMenuList,
          }}>
          Share code
        </MenuItem>
        <MenuItem
          // onClick={handleRenameTitle}
          classes={{
            root: classes.titleMenuList,
          }}>
          Fork code
        </MenuItem>
        <MenuItem
          // onClick={handleRenameTitle}
          classes={{
            root: classes.titleMenuList,
          }}>
          Rename code
        </MenuItem>
        <MenuItem
          // onClick={handleRenameTitle}
          classes={{
            root: classes.titleMenuList,
          }}>
          Change theme
        </MenuItem>
      </Menu>
    );
  }

  function renderNavBar() {
    return (
      <>
        <nav
          className={`${classes.navBar} ${classes.topNavBar} ${
            isScrollUp ? classes.topNavSlideDown : classes.topNavSlideUp
          }`}>
          <div
            className={`${commonClass.flexRow}`}
            style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              className={`${commonClass.flexRow}`}
              style={{ alignItems: 'center', color: color.themeBlue }}>
              <IconButton>
                <MenuIcon onClick={setIsSideBarVisible} style={{ color: color.themeBlue }} />
              </IconButton>
              <img
                alt="jdjjd"
                src={UserImg}
                style={{ height: 40, width: 40, borderRadius: 20, marginRight: 20 }}
              />
              <div className={`${commonClass.flexColumn}`} style={{ justifyContent: 'center' }}>
                <p style={{ margin: 0, fontSize: fontsize.small, fontWeight: 600 }}>Untitled.js</p>
                <p style={{ fontSize: fontsize.xsmall, margin: 0 }}>Anifowoshe gbenga</p>
              </div>
            </div>
            <div>
              <IconButton>
                <MoreVertIcon
                  onClick={e => handleShowOptions(e)}
                  style={{ color: color.themeBlue }}
                />
              </IconButton>
            </div>
          </div>
        </nav>
        {renderSourcecodeOptions()}
      </>
    );
  }

  function renderBottomNavBar() {
    return (
      <nav
        className={`${classes.navBar} ${classes.bottomNavBar} ${
          isScrollUp ? classes.bottomNavSlideDown : classes.bottomNavSlideUp
        } `}>
        <div
          className={`${commonClass.flexRow} bottom-nav__btn`}
          style={{ alignItems: 'center', height: 50 }}>
          <button
            className={commonClass.flexColumn}
            onClick={handleOpenComment}
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <ModeCommentIcon style={{ fontSize: fontsize.base }} />
            <span style={{ fontSize: fontsize.base }}>Comments</span>
          </button>
          <button
            className={commonClass.flexColumn}
            onClick={handleOpenReadme}
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <MenuBookIcon style={{ fontSize: fontsize.base }} />
            <span style={{ fontSize: fontsize.base }}>Readme</span>
          </button>
        </div>
      </nav>
    );
  }

  function renderPlayBtn() {
    const hasWhiteBg = isReadmeVisible || isCommentVisible || isTerminalVisible;
    return (
      <div
        className={`${classes.playBtnWrapper} ${
          isScrollUp ? classes.playBtnNavSlideDown : classes.playBtnNavSlideUp
        }`}
        style={{
          zIndex: isCommentVisible || isReadmeVisible ? 0 : 50,
        }}>
        <IconButton
          style={{
            backgroundColor: hasWhiteBg ? color.themeBlue : color.white,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1),0 12px 28px rgba(0,0,0,0.2)',
            transition: 'transform .3s ease-out',
          }}
          classes={{ root: classes.playIconBtn }}
          onClick={handleSourceCodeExec}>
          <PlayArrowIcon
            style={{
              color: hasWhiteBg ? color.white : color.themeBlue,
              fontSize: fontsize.large * 2,
            }}
          />
        </IconButton>
      </div>
    );
  }

  return (
    <div className={classes.editor} ref={navRef}>
      {renderNavBar()}
      <div
        style={{
          marginTop: isScrollUp ? 50 : 0,
          height: '2000px',
          color: 'white',
          transition: 'all .3s',
        }}>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus vitae sapiente, labore ea
        eveniet explicabo esse. Aliquid beatae earum iusto. Minus cumque accusantium repellat veniam
        minima quo sequi deserunt hic!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea vel optio, magnam laborum enim,
        inventore tempora repellat amet ab deserunt tempore saepe. Quam expedita vero illo nesciunt
        eius illum quis?
      </div>
      <div
        className={`${classes.navBar} ${classes.bottomNavBar} ${
          isScrollUp ? classes.bottomNavSlideDown : classes.bottomNavSlideUp
        } `}>
        <Comments isVisible={isCommentVisible} hideComponent={() => setIsCommentVisible(false)} />
        <Terminal isVisible={isTerminalVisible} hideComponent={() => setIsTerminalVisible(false)} />
        <Readme isVisible={isReadmeVisible} hideComponent={() => setIsReadmeVisible(false)} />
      </div>
      {renderPlayBtn()}
      {renderBottomNavBar()}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  editor: {
    width: '100vw',
    height: '100%',
    backgroundColor: color.darkThemeBlack,
    overflowY: 'scroll',
  },
  navBar: {
    position: 'fixed',
    left: 0,
    width: '100%',
    zIndex: 9,
    transition: 'all 0.5s',
  },
  topNavBar: {
    height: '50px',
    top: 0,
    backgroundColor: color.white,
    color: color.themeBlue,
    boxShadow: '0 1px 15px 1px rgba(52,40,104,.08)',
  },
  bottomNavBar: {
    height: '50px',
    borderTop: '1px solid #ddd',
    backgroundColor: color.white,
    bottom: 0,
    '& .bottom-nav__btn button': {
      border: 'none',
      height: '100%',
      backgroundColor: 'transparent',
      color: color.themeBlue,
      outline: 'transparent',
      transition: 'all 0.5s',
      '&:active': {
        backgroundColor: color.themeBlue,
        color: color.white,
      },
    },
  },
  playBtnWrapper: {
    position: 'fixed',
    bottom: 60,
    right: 10,
  },
  playIconBtn: { padding: 12 },
  topNavSlideUp: {
    transform: 'translateY(-50px)',
    transition: 'transform .3s ease-out',
  },
  topNavSlideDown: {
    transform: 'translateY(0)',
    transition: 'transform .3s ease-out',
  },
  bottomNavSlideUp: {
    transform: 'translateY(50px)',
    transition: 'transform .3s ease-out',
  },
  bottomNavSlideDown: {
    transform: 'translateY(0)',
    transition: 'transform .3s ease-out',
  },
  playBtnNavSlideUp: {
    transform: 'translateY(50px)',
    transition: 'transform .3s ease-out',
  },
  playBtnNavSlideDown: {
    transform: 'translateY(0)',
    transition: 'transform .3s ease-out',
  },
  optionsMenuPaper: {
    backgroundColor: color.white,
    marginTop: 25,
  },
  titleMenuList: {
    backgroundColor: color.darkThemeLightBorder,
    color: color.themeBlue,
    '&:hover': {
      backgroundColor: color.themeBlue,
      color: color.white,
    },
  },
}));

export default React.memo(MonacoEditor);
