import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { color } from "@javico/common/lib/design-language/Css";

const draggableRoot = document.body;

interface IProps {
  resizeEditor: (width: number) => void;
  currentBoundary: any;
  getEditorBoundary: () => any;
}

const ResizeListener: React.FC<IProps> = ({
  resizeEditor,
  currentBoundary,
  getEditorBoundary
}) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const draggableContainerRef = useRef<HTMLDivElement | null>(null);
  const isActive = useRef<null | boolean>(null);
  const initialXCoordinate = useRef<number>(0);
  const [height, setHeight] = useState<string>("300px");
  const [shouldTransition, setShouldTransition] = useState<boolean>(true);
  const currentXCoordinate = useRef<number>(0);
  const classes = useStyles();

  function getElement() {
    if (elementRef.current === null) {
      elementRef.current = document.createElement("div");
    }
    return elementRef.current;
  }
  // console.log("jkihkbfkljhbkljhvbnljvd currentBoundary ", currentBoundary);

  // useEffect(() => {
  //   if (draggableContainerRef.current)
  //     getBoundingClientRect = draggableContainerRef.current.getBoundingClientRect();
  // }, [draggableContainerRef.current]);

  useEffect(() => {
    let element = getElement();
    draggableRoot.appendChild(element);
    const tempRef = draggableContainerRef.current;

    if (tempRef) {
      tempRef.addEventListener("mousedown", dragStart);
      tempRef.addEventListener("mouseup", dragEnd);
    }
    return () => {
      draggableRoot.removeChild(element);
      if (tempRef) {
        tempRef.removeEventListener("mousedown", dragStart);
        tempRef.removeEventListener("mousemove", dragMove);
        tempRef.removeEventListener("mouseup", dragEnd);
      }
    };
    // eslint-disable-next-line
  }, []);

  function dragStart(e: any) {
    e.preventDefault();
    isActive.current = true;
    const tempRef = draggableContainerRef.current;
    if (tempRef) {
      tempRef.addEventListener("mousemove", dragMove);
    }
    currentXCoordinate.current = e.clientX;
    initialXCoordinate.current = e.clientX;
    // resizeEditor(currentXCoordinate.current);
    // console.log(
    //   "jkihkbfkljhbkljhvbnljvd dragStart currentXCoordinate ",
    //   currentXCoordinate.current
    // );
  }

  function dragMove(e: any) {
    !isActive.current && (isActive.current = true);
    currentXCoordinate.current = e.clientX;
    let offset = currentXCoordinate.current - initialXCoordinate.current;
    resizeEditor(getEditorBoundary().width + offset);

    // console.log(
    //   "jkihkbfkljhbkljhvbnljvd dragMove ",
    //   offset,
    //   getEditorBoundary(),
    //   getEditorBoundary().width
    // );
  }

  function dragEnd(e: any) {
    // if (isActive.current === true) {
    //   e.preventDefault();
    //   const windowHeight = document.body.getBoundingClientRect().height;
    //   if (currentXCoordinate.current <= windowHeight - 300) {
    //     setShouldTransition(true);
    //     setTimeout(() => setHeight(`300px`), 50);
    //   } else {
    //     setShouldTransition(true);
    //     // setTimeout(() => {
    //     //   onRequestClose();
    //     //   setHeight(`300px`);
    //     // }, 50);
    //   }
    //   isActive.current = false;
    // }
    if (isActive.current === true) {
      const tempRef = draggableContainerRef.current;
      if (tempRef) {
        tempRef.removeEventListener("mousedown", dragStart);
        tempRef.removeEventListener("mousemove", dragMove);
        tempRef.removeEventListener("mouseup", dragEnd);
      }
      isActive.current = false;
    }
  }

  return (
    <div
      style={{
        left: currentBoundary.width
      }}
      ref={draggableContainerRef}
      className={classes.resizeEditorAnchor}
    />
  );
};

const useStyles = makeStyles({
  resizeEditorAnchor: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    zIndex: 5,
    cursor: "ew-resize",
    opacity: 1,
    backgroundColor: color.gray20
  }
});

export default React.memo(ResizeListener);
