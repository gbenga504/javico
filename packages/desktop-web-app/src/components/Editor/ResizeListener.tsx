import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";

interface IProps {
  children: any;
  initialWidth?: string;
  initialHeight?: string;
  style?: object;
  resizeDirection: "height" | "width";
  resizePos?: object;
}

const ResizeListener: React.FC<IProps> = ({
  children,
  initialHeight,
  initialWidth,
  resizePos,
  resizeDirection,
  style
}) => {
  const draggableContainerRef = useRef<HTMLDivElement | null>(null);
  const [resizeWidth, setResizeWidth] = useState<any>(initialWidth);
  const [resizeHeight, setResizeHeight] = useState<any>(initialHeight);

  const resizeContainerRef = useRef<any>();
  const originalHeight = useRef<any>();
  const originalMouseY = useRef<any>();

  const originalWidth = useRef<any>();
  const originalMouseX = useRef<any>();
  const classes = useStyles();
  const isWidthResize = resizeDirection === "width";

  useEffect(() => {
    const tempRef = draggableContainerRef.current;

    if (tempRef) {
      tempRef.addEventListener("mousedown", (e: any) => {
        e.preventDefault();

        originalHeight.current = resizeContainerRef.current.getBoundingClientRect().height;
        originalMouseY.current = e.clientY;

        originalWidth.current = resizeContainerRef.current.getBoundingClientRect().width;
        originalMouseX.current = e.clientX;

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

  function dragMove(e: any) {
    const width = originalWidth.current + (e.pageX - originalMouseX.current);
    const height = originalHeight.current - (e.pageY - originalMouseY.current);
    isWidthResize && setResizeWidth(width);
    !isWidthResize && setResizeHeight(height);
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
        height: resizeHeight,
        ...style
      }}
      ref={resizeContainerRef}
    >
      <div
        style={{
          ...resizePos,
          cursor: isWidthResize ? "ew-resize" : "ns-resize",
          [isWidthResize ? "left" : ""]: resizeContainerRef.current
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
    backgroundColor: "#6c470f"
  }
});

export default React.memo(ResizeListener);
