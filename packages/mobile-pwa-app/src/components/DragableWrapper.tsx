import React, { useRef, useState, useEffect } from 'react';
import { DragHandle as DragHandleIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';

import { color, useStyles as commonCss, fontsize } from '../Css';

const DragableWrapper: React.FC<{
  isVisible: boolean;
  isScrollUp: boolean;
  hideComponent: () => void;
  children: any;
}> = ({ isVisible, hideComponent, children, isScrollUp }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [clientPos, setClientPos] = useState<number>(0);
  const [height, setHeight] = useState<number>(200);
  const classes = useStyles();
  const commonClass = commonCss();
  const dragableWrapperRef = useRef<any>(null);

  useEffect(() => {
    const tempRef = dragableWrapperRef.current;

    function handleFocusout(e: any) {
      const leavingComp = !tempRef.contains(e.relatedTarget);

      if (leavingComp) {
        hideComponent();
      }
    }

    tempRef.addEventListener('focusout', handleFocusout);
    return () => {
      tempRef.removeEventListener('focusout', handleFocusout);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isVisible) {
      const tempRef = dragableWrapperRef.current;
      tempRef.focus();
      tempRef.style.height = `200px`;
    }
  }, [isVisible]);

  function handleTouchMove(e: any) {
    if (isDragging) {
      const tempRef = dragableWrapperRef.current,
        height = tempRef.getBoundingClientRect().height,
        clientY = e.targetTouches[0].clientY,
        newHeight = height + (clientPos - clientY);
      setTimeout(() => {
        setHeight(height);
        if (clientY < 100) return setIsDragging(false);
        if (newHeight < 50) {
          hideComponent();
          return;
        }
        tempRef.style.height = `${newHeight}px`;
      }, 500);
    }
  }

  function handleTouchEnd(e: any) {
    if (isDragging) {
      setIsDragging(false);
      setClientPos(e.clientY);
    }
  }

  function handleTouchStart(e: any) {
    var touchLocation = e.targetTouches[0].clientY;
    setClientPos(touchLocation);
    setIsDragging(true);
  }

  return (
    <div
      ref={dragableWrapperRef}
      className={`${classes.dragableWrapper} ${
        isVisible ? classes.slideDragableWrapperUp : classes.slideDragableWrapperDown
      } 
       
      `}
      tabIndex={0}
      style={{ height, outline: 'none' }}>
      <button
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
        className={`${commonClass.flexRow} ${commonClass.center} ${classes.dragableWrapperBtn}`}
        style={{ height: 40 }}>
        <DragHandleIcon style={{ color: '#ccc', fontSize: fontsize.xlarge * 2 }} />
      </button>
      {children}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  dragableWrapper: {
    position: 'fixed',
    bottom: 45,
    zIndex: 50,
    left: 0,
    width: '100%',
    backgroundColor: color.white,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    transition: 'all 0.5s',
  },
  dragableWrapperBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    overflow: 'hide',
    width: '100%',
    height: '100%',
    outline: 'transparent',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    transition: 'all .3s',
    '&:active': {
      backgroundColor: '#eee',
    },
  },
  slideDragableWrapperUp: {
    transform: 'translateY(0px)',
    transition: 'transform .3s ease-out',
  },
  slideDragableWrapperDown: {
    transform: 'translateY(500px)',
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
}));

export default DragableWrapper;

// ${isScrollUp ? classes.bottomNavSlideDown : classes.bottomNavSlideUp}
