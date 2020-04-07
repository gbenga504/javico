import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import ReactDOM from "react-dom";

import { color } from "../../design-language/Css";

const draggableRoot = document.body;

interface IProps {
  isVisible: boolean;
  onRequestClose: () => void;
  className?: string;
  children: React.ReactNode;
}

const DraggableListener: React.FC<IProps> = ({
  onRequestClose,
  isVisible,
  className,
  children
}) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const draggableContainerRef = useRef<HTMLDivElement | null>(null);
  const isActive = useRef<null | boolean>(null);
  const [height, setHeight] = useState<string>("300px");
  const [shouldTransition, setShouldTransition] = useState<boolean>(true);
  const currentYCoordinate = useRef<number>(0);
  const classes = useStyles();

  function getElement() {
    if (elementRef.current === null) {
      elementRef.current = document.createElement("div");
    }
    return elementRef.current;
  }

  useEffect(() => {
    let element = getElement();
    draggableRoot.appendChild(element);
    const tempRef = draggableContainerRef.current;

    if (tempRef) {
      tempRef.addEventListener("touchstart", dragStart);
      tempRef.addEventListener("touchmove", dragMove);
      tempRef.addEventListener("touchend", dragEnd);
    }
    return () => {
      draggableRoot.removeChild(element);
      if (tempRef) {
        tempRef.removeEventListener("touchstart", dragStart);
        tempRef.removeEventListener("touchmove", dragMove);
        tempRef.removeEventListener("touchend", dragEnd);
      }
    };
    // eslint-disable-next-line
  }, []);

  function dragStart(e: any) {
    currentYCoordinate.current = e.touches[0].clientY;
  }

  function dragMove(e: any) {
    !isActive.current && (isActive.current = true);
    shouldTransition === true && setShouldTransition(false);
    currentYCoordinate.current = e.touches[0].clientY;
    setHeight(`calc(100% - ${e.touches[0].clientY}px)`);
  }

  function dragEnd(e: any) {
    if (isActive.current === true) {
      e.preventDefault();
      const windowHeight = document.body.getBoundingClientRect().height;
      if (currentYCoordinate.current <= windowHeight - 300) {
        setShouldTransition(true);
        setTimeout(() => setHeight(`300px`), 50);
      } else {
        setShouldTransition(true);
        setTimeout(() => {
          onRequestClose();
          setHeight(`300px`);
        }, 50);
      }
      isActive.current = false;
    }
  }

  function renderChildren() {
    return (
      <div
        className={`${classes.container} ${isVisible &&
          classes.containerVisible}`}
      >
        <div onClick={onRequestClose} className={classes.overlay} />
        <div
          className={`${classes.draggableContainer} ${className} ${isVisible &&
            classes.draggableContainerVisible}`}
          ref={draggableContainerRef}
          style={{
            height,
            transition: shouldTransition === true ? "all 0.5s" : "none"
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return ReactDOM.createPortal(renderChildren(), getElement());
};

const useStyles = makeStyles({
  container: {
    width: "100vw",
    height: 0,
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 100
  },
  containerVisible: {
    height: "100vh"
  },
  overlay: {
    height: "100%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  draggableContainer: {
    background: color.white,
    width: "100vw",
    position: "absolute",
    bottom: -300,
    zIndex: 1
  },
  draggableContainerVisible: {
    bottom: `0 !important`
  }
});

export default React.memo(DraggableListener);
