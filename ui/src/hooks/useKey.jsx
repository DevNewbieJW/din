import { useEffect, useRef } from "react";

const useKey = (key, fun) => {
  const callbackRef = useRef(fun);

  useEffect(() => {
    callbackRef.current = fun;
  });

  useEffect(() => {
    const handle = (event) => {
      if (event.code === key) {
        callbackRef.current(event);
      }
    };

    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [key]);
};

export default useKey;
