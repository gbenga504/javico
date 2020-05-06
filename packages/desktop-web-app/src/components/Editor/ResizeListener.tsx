import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { color } from "@javico/common/lib/design-language/Css";

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
  const originalY = useRef<any>();
  const originalMouseY = useRef<any>();
  const classes = useStyles();

  useEffect(() => {
    const tempRef = draggableContainerRef.current;

    if (tempRef) {
      tempRef.addEventListener("mousedown", (e: any) => {
        e.preventDefault();

        originalHeight.current = resizeContainerRef.current.getBoundingClientRect().height;
        originalY.current = resizeContainerRef.current.getBoundingClientRect().top;
        originalMouseY.current = e.clientY;

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
    setResizeWidth(e.clientX);
    setResizeHeight(
      originalHeight.current - (e.pageY - originalMouseY.current)
    );
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
          cursor: resizeDirection === "width" ? "ew-resize" : "ns-resize",
          [resizeDirection === "width"
            ? "left"
            : ""]: resizeContainerRef.current
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
