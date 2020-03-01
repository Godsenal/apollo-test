import { useRef, useEffect } from "react";

const useIO = <T extends Function>(target: HTMLElement | null, callback: T) => {
  const callBackRef = useRef(callback);

  useEffect(() => {
    callBackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleIntersection: IntersectionObserverCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callBackRef.current();
        }
      });
    };
    const io = new IntersectionObserver(handleIntersection, {
      rootMargin: "0px",
      threshold: 1.0
    });
    target && io.observe(target);
    return () => {
      target && io.unobserve(target);
    };
  }, [target]);
};

export default useIO;
