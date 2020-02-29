import { useRef, useEffect } from "react";

const usePrevious = (value: any) => {
  const previousRef = useRef(null);
  useEffect(() => {
    previousRef.current = value;
  });
  return previousRef.current;
};

export default usePrevious;
