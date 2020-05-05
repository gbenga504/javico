import React, { useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { color } from "@javico/common/lib/design-language/Css";

interface IProps {
  resizeEditor: (width: number) => void;
  resizeWidth: any;
}

const ResizeListener: React.FC<IProps> = ({ resizeEditor, resizeWidth }) => {
  const draggableContainerRef = useRef<HTMLDivElement | null>(null);
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
  }, [resizeWidth]);

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
    opacity: 0,
    backgroundColor: color.gray20
  }
});

export default React.memo(ResizeListener);
