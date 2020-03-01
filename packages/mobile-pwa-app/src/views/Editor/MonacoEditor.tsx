import React, { useRef, useEffect, useState } from 'react';
import { makeStyles, IconButton } from '@material-ui/core';
import {
  Menu as MenuIcon,
  MoreVert as MoreVertIcon,
  ModeComment as ModeCommentIcon,
  MenuBook as MenuBookIcon,
  PlayArrow as PlayArrowIcon,
  DeviceHub as ForkIcon,
  NoteAdd as AddNewSourceCodeIcon,
} from '@material-ui/icons';

import UserImg from '../../assets/images/user.svg';
import { color, useStyles as commonCss, fontsize } from '../../Css';

const MonacoEditor: React.FC<{}> = () => {
  const [isScrollUp, setIsScrollUp] = useState<boolean>(true);
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

  return (
    <div className={classes.editor} ref={navRef}>
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
              <MenuIcon style={{ color: color.themeBlue }} />
            </IconButton>
            <img
              src={UserImg}
              style={{ height: 40, width: 40, borderRadius: 20, marginRight: 20 }}
            />
            <div className={`${commonClass.flexColumn}`} style={{ justifyContent: 'center' }}>
              <p style={{ margin: 0, fontSize: fontsize.small }}>Untitled.js</p>
              <p style={{ fontSize: fontsize.xsmall, margin: 0 }}>Anifowoshe gbenga</p>
            </div>
          </div>
          <div>
            <IconButton>
              <MoreVertIcon style={{ color: color.themeBlue }} />
            </IconButton>
          </div>
        </div>
      </nav>
      <div
        style={{
          marginTop: 50,
          height: '2000px',
          color: 'white',
        }}>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus vitae sapiente, labore ea
        eveniet explicabo esse. Aliquid beatae earum iusto. Minus cumque accusantium repellat veniam
        minima quo sequi deserunt hic!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea vel optio, magnam laborum enim,
        inventore tempora repellat amet ab deserunt tempore saepe. Quam expedita vero illo nesciunt
        eius illum quis?
      </div>
      {console.log('isScrollUp isScrollUp ', isScrollUp)}
      <nav
        className={`${classes.navBar} ${classes.bottomNavBar} ${
          isScrollUp ? classes.bottomNavSlideDown : classes.bottomNavSlideUp
        } `}>
        <div
          className={`${commonClass.flexRow}`}
          style={{
            height: 50,
            alignItems: 'center',
            justifyContent: 'space-around',
            marginBottom: 5,
          }}>
          <IconButton
            style={{ backgroundColor: color.white }}
            classes={{ root: classes.createIconBtn }}>
            <AddNewSourceCodeIcon style={{ color: color.themeBlue }} />
          </IconButton>
          <IconButton
            style={{ backgroundColor: color.white }}
            classes={{ root: classes.playIconBtn }}>
            <PlayArrowIcon style={{ color: color.themeBlue, fontSize: 30 }} />
          </IconButton>
          <IconButton
            style={{ backgroundColor: color.white }}
            classes={{ root: classes.forkIconBtn }}>
            <ForkIcon style={{ color: color.themeBlue }} />
          </IconButton>
        </div>
        <div
          className={`${commonClass.flexRow} bottom-nav__btn`}
          style={{ alignItems: 'center', height: 50, backgroundColor: color.white }}>
          <button
            className={commonClass.flexColumn}
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <ModeCommentIcon style={{ fontSize: fontsize.base }} />
            <span style={{ fontSize: fontsize.base }}>Comments</span>
          </button>
          <button
            className={commonClass.flexColumn}
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <MenuBookIcon style={{ fontSize: fontsize.base }} />
            <span style={{ fontSize: fontsize.base }}>Readme</span>
          </button>
        </div>
      </nav>
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
  },
  bottomNavBar: {
    height: '100px',
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
  playIconBtn: { padding: 7 },
  forkIconBtn: { padding: 5 },
  createIconBtn: { padding: 5 },
  topNavSlideUp: {
    transform: 'translateY(-50px)',
    transition: 'transform .5s ease-out',
  },
  topNavSlideDown: {
    transform: 'translateY(0)',
    transition: 'transform .5s ease-out',
  },
  bottomNavSlideUp: {
    transform: 'translateY(50px)',
    transition: 'transform .5s ease-out',
  },
  bottomNavSlideDown: {
    transform: 'translateY(0)',
    transition: 'transform .5s ease-out',
  },
}));

export default React.memo(MonacoEditor);
