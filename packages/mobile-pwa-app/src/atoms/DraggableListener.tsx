import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import ReactDOM from 'react-dom';

import { color } from '../Css';

const draggableRoot = document.body;

interface IProps {
  isVisible: boolean;
  onRequestClose: () => void;
  className?: string;
}

const DraggableListener: React.FC<IProps> = ({
  onRequestClose,
  isVisible,
  className,
  children,
}) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const classes = useStyles();

  function getElement() {
    if (elementRef.current === null) {
      elementRef.current = document.createElement('div');
    }
    return elementRef.current;
  }

  useEffect(() => {
    let element = getElement();
    draggableRoot.appendChild(element);
    return () => {
      draggableRoot.removeChild(element);
    };
  }, []);

  function renderChildren() {
    return (
      <div className={`${classes.container} ${isVisible && classes.containerVisible}`}>
        <div onClick={onRequestClose} className={classes.overlay} />
        <div
          className={`${classes.draggableContainer} ${className} ${isVisible &&
            classes.draggableContainerVisible}`}>
          {children}
        </div>
      </div>
    );
  }

  return ReactDOM.createPortal(renderChildren(), getElement());
};

const useStyles = makeStyles({
  container: {
    width: '100vw',
    height: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 100,
  },
  containerVisible: {
    height: '100vh',
  },
  overlay: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  draggableContainer: {
    background: color.white,
    width: '100vw',
    height: 300,
    position: 'absolute',
    bottom: -300,
    transition: 'all 0.8s',
    zIndex: 1,
  },
  draggableContainerVisible: {
    bottom: `0 !important`,
  },
});

export default DraggableListener;
