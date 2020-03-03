import React, { useRef, useState, useEffect } from 'react';
import { DragHandle as DragHandleIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';

import { color, useStyles as commonCss, fontsize } from '../../Css';

const CommentContainer: React.FC<{ isVisible: boolean; hideComponent: () => void }> = ({
  isVisible,
  hideComponent,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [clientPos, setClientPos] = useState<number>(0);
  const [height, setHeight] = useState<number>(200);
  const classes = useStyles();
  const commonClass = commonCss();
  const commentContainerRef = useRef<any>(null);

  useEffect(() => {
    const tempRef = commentContainerRef.current;

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
      const tempRef = commentContainerRef.current;
      tempRef.focus();
      tempRef.style.height = `200px`;
    }
  }, [isVisible]);

  function handleTouchMove(e: any) {
    if (isDragging) {
      const tempRef = commentContainerRef.current,
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
      }, 1000);
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
      ref={commentContainerRef}
      className={`${classes.commentDrag} ${
        isVisible ? classes.slideCommentUp : classes.slideCommentDown
      }`}
      tabIndex={0}
      style={{ height, outline: 'none' }}>
      <button
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
        className={`${commonClass.flexRow} ${commonClass.center} ${classes.commentDragBtn}`}
        style={{ height: 40, borderBottom: '1px solid #ddd' }}>
        <DragHandleIcon style={{ color: '#ccc', fontSize: fontsize.xlarge * 2 }} />
      </button>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  commentDrag: {
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
  commentDragBtn: {
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
  slideCommentUp: {
    transform: 'translateY(0px)',
    transition: 'transform .3s ease-out',
  },
  slideCommentDown: {
    transform: 'translateY(500px)',
    transition: 'transform .3s ease-out',
  },
}));

export default CommentContainer;
