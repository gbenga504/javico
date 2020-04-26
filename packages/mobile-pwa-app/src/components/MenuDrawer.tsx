import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';

import UserImg from '../assets/images/user.svg';
import { fontsize, useStyles as commonCss } from '../Css';

const MenuDrawer: React.FC<{ isSideBarVisible: boolean; onBlur: () => void }> = ({
  isSideBarVisible,
  onBlur,
}) => {
  const menuDrawerRef = useRef<any>(null);
  const classes = useStyles();
  const commonClass = commonCss();

  useEffect(() => {
    const tempRef = menuDrawerRef.current;

    function handleFocusout(e: any) {
      const leavingMenu = !tempRef.contains(e.relatedTarget);

      if (leavingMenu) {
        onBlur();
      }
    }

    tempRef.addEventListener('focusout', handleFocusout);
    return () => {
      tempRef.removeEventListener('focusout', handleFocusout);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isSideBarVisible) {
      menuDrawerRef.current.focus();
    }
  }, [isSideBarVisible]);

  return (
    <div
      ref={menuDrawerRef}
      tabIndex={0}
      style={{ overflow: 'scroll' }}
      className={`${classes.sideBar} ${classes.navBox} ${isSideBarVisible && classes.open}`}>
      <div
        style={{ borderBottom: '1px solid #ccc', padding: '20px 0' }}
        className={`${commonClass.flexColumn} ${commonClass.center}`}>
        <img
          src={UserImg}
          alt="owner"
          style={{
            height: 60,
            width: 60,
            borderRadius: '50%',
            marginBottom: 20,
          }}
        />
        <div className={`${commonClass.flexColumn} ${commonClass.center}`}>
          <p style={{ padding: 0, color: '#252946' }}>Olusola Oyinloye</p>
          <p style={{ fontSize: fontsize.large, padding: 0 }}>Front-end dev</p>
          <p style={{ fontSize: fontsize.large, padding: 0 }}>Elta solutions</p>
        </div>
      </div>
      <nav className={classes.menuSideNav} style={{ padding: '20px 0' }}>
        <ul style={{ margin: 0, paddingLeft: 0 }}>
          <li>Overview</li>
          <li>Overview</li>
          <li>Overview</li>
          <li>Overview</li>
          <li>Login</li>
        </ul>
      </nav>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  sideBar: {
    background: '#ffffff',
    boxShadow: '0 1px 15px 1px rgba(52, 40, 104, 0.08)',
    position: 'fixed',
    height: '100%',
    width: '75%',
    padding: 10,
    top: 0,
    zIndex: 999,
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  navBox: {
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease-out',
    zIndex: 900,
    fontSize: `${fontsize.xlarge * 1.2}px !important`,
    '& > div p': {
      margin: 0,
      padding: '20px 10px',
      textDecoration: 'none',
      display: 'block',
      fontWeight: 500,
    },
  },
  open: {
    transform: 'translateX(0)',
    color: '#bdbdbd',
  },
  menuSideNav: {
    width: 240,
    color: '#fff',
    position: 'relative',
    height: '100%',
    overflowX: 'scroll',
    display: 'block',
    '& li': {
      color: '#252946',
      padding: '10px',
      textDecoration: 'none',
      display: 'block',
      fontWeight: 500,
      fontSize: fontsize.xlarge,
    },
  },
}));

export default MenuDrawer;
