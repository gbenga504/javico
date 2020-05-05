import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";

interface IProps {
  children: any;
  initialWidth?: string;
  initialHeight?: string;
  style?: object;
}

const ResizeListener: React.FC<IProps> = ({
  children,
  initialHeight,
  initialWidth,
  style
}) => {
  const draggableContainerRef = useRef<HTMLDivElement | null>(null);
  const [resizeWidth, setResizeWidth] = useState<any>(initialWidth);
  const resizeContainerRef = useRef<any>();
  const classes = useStyles();

  useEffect(() => {
    const tempRef = draggableContainerRef.current;

    if (tempRef) {
      tempRef.addEventListener("mousedown", (e: any) => {
        e.preventDefault();
        window.addEventListener("mousemove", dragMove);
        window.addEventListener("mouseup", dragEnd);
      });
    }
    return () => {
      if (tempRef) {
        tempRef.removeEventListener("mousedown", () => null);
        window.removeEventListener("mousemove", dragMove);
        window.removeEventListener("mouseup", dragEnd);
      }
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (resizeContainerRef.current) {
      setResizeWidth(getEditorBoundary().width);
    }
  }, []);

  function getEditorBoundary() {
    if (resizeContainerRef.current)
      return resizeContainerRef.current.getBoundingClientRect();
    return {};
  }

  function resizeEditor(width: number) {
    if (resizeContainerRef.current) {
      setResizeWidth(width);
    }
  }

  function dragMove(e: any) {
    resizeEditor(e.clientX);
  }

  function dragEnd(e: any) {
    e.preventDefault();
    const tempRef = draggableContainerRef.current;
    if (tempRef) {
      tempRef.removeEventListener("mousedown", () => null);
      window.removeEventListener("mousemove", dragMove);
      window.removeEventListener("mouseup", dragEnd);
    }
  }

  return (
    <div
      style={{
        position: "relative",
        width: resizeWidth,
        ...style
      }}
      ref={resizeContainerRef}
    >
      <div
        style={{
          left: resizeContainerRef.current
            ? resizeContainerRef.current.clientWidth
            : resizeWidth
        }}
        ref={draggableContainerRef}
        className={classes.resizeEditorAnchor}
      />
      {children}
    </div>
  );
};

const useStyles = makeStyles({
  resizeEditorAnchor: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    zIndex: 5,
    cursor: "ew-resize"
  }
});

export default React.memo(ResizeListener);
