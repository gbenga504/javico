import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { color } from "@javico/common/lib/design-language/Css";

interface IProps {
  resizeEditor: (width: number) => void;
  currentBoundary: any;
  resizeWidth: any;
}

const ResizeListener: React.FC<IProps> = ({
  resizeEditor,
  currentBoundary,
  resizeWidth
}) => {
  const draggableContainerRef = useRef<HTMLDivElement | null>(null);
  const initialXCoordinate = useRef<number>(0);
  const [width, setWidth] = useState<number>(parseInt(currentBoundary.width));
  const [shouldTransition, setShouldTransition] = useState<boolean>(true);
  const isActive = useRef<null | boolean>(null);
  const currentXCoordinate = useRef<number>(0);
  const classes = useStyles();

  useEffect(() => {
    // if (!width) {
    setWidth(currentBoundary.width);
    // }
  }, [currentBoundary]);

  useEffect(() => {
    const tempRef = draggableContainerRef.current;

    if (tempRef) {
      tempRef.addEventListener("mousedown", dragStart);
      tempRef.addEventListener("mousemove", dragMove);
      tempRef.addEventListener("mouseup", dragEnd);
    }
    return () => {
      if (tempRef) {
        tempRef.removeEventListener("mousedown", dragStart);
        tempRef.removeEventListener("mousemove", dragMove);
        tempRef.removeEventListener("mouseup", dragEnd);
      }
    };
    // eslint-disable-next-line
  }, []);

  function dragStart(e: any) {
    initialXCoordinate.current = e.clientX;
    isActive.current = true;
  }

  function dragMove(e: any) {
    if (isActive.current) {
      currentXCoordinate.current = e.clientX;
      resizeEditor(e.clientX);
      // setWidth(e.clientX);
    }
  }

  function dragEnd(e: any) {
    e.preventDefault();
    const tempRef = draggableContainerRef.current;
    if (tempRef) {
      tempRef.removeEventListener("mousedown", dragStart);
      tempRef.removeEventListener("mousemove", dragMove);
      tempRef.removeEventListener("mouseup", dragEnd);
    }
    isActive.current = false;
  }

  return (
    <div
      style={{
        left: resizeWidth
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
