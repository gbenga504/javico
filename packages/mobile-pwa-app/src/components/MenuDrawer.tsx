import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { fontsize } from '../Css';

const MenuDrawer: React.FC<{ isSideBarVisible: boolean; onBlur: () => void }> = ({
  isSideBarVisible,
  onBlur,
}) => {
  const menuDrawerRef = useRef<any>(null);
  const classes = useStyles();

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
      className={`${classes.sideBar} ${classes.navBox} ${isSideBarVisible && classes.open}`}>
      <nav className={classes.menuSideNav}>
        <ul></ul>
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
    top: 0,
    zIndex: 999,
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  navBox: {
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease-out',
    zIndex: 900,
    fontSize: `${fontsize.large * 3}px !important`,
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
    padding: '80px 0',
    overflowX: 'scroll',
    display: 'block',
  },
}));

export default MenuDrawer;
