import React from "react";
import { makeStyles } from "@material-ui/core";

interface IProps {
  size?: number;
  color?: string;
}

const useStyles = makeStyles({
  animatedCircularLoader: {
    display: "inline-block",
    position: "relative",
    "& div": {
      boxSizing: "border-box",
      display: "block",
      position: "absolute",
      borderRadius: "50%",
      animation:
        "$animated-circular-loader 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite"
    },
    "& div:nth-child(1)": {
      animationDelay: "-0.45s"
    },
    "& div:nth-child(2)": {
      animationDelay: "-0.3s"
    },
    "& div:nth-child(3)": {
      animationDelay: "-0.15s"
    }
  },
  "@keyframes animated-circular-loader": {
    "0%": {
      transform: "rotate(0deg)"
    },
    "100%": {
      transform: "rotate(360deg)"
    }
  }
});

const AnimatedCircularLoader: React.FC<IProps> = ({
  size = 64,
  color = "#fff"
}) => {
  let classes = useStyles();

  return (
    <div
      className={classes.animatedCircularLoader}
      style={{ width: size, height: size }}
    >
      {Array.apply(null, Array(4)).map((value, i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            border: `${size / 8}px solid ${color}`,
            margin: size / 8,
            borderColor: `${color} transparent transparent transparent`
          }}
        ></div>
      ))}
    </div>
  );
};

export default AnimatedCircularLoader;
