// components/ResizablePanel.tsx
'use client';

import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { useEffect, useState, ReactNode } from "react";

interface ResizablePanelProps {
  children: ReactNode;
}

const ResizablePanel = ({ children }: ResizablePanelProps) => {
  const [ref, { height }] = useMeasure();
  const [initialHeight, setInitialHeight] = useState("auto");

  useEffect(() => {
    if (height) setInitialHeight(`${height}px`);
  }, [height]);

  return (
    <motion.div
      animate={height ? { height } : {}}
      style={{ height: height ? `${height}px` : initialHeight }}
      className="relative w-full overflow-y-hidden mb-20"
      transition={{ type: "tween", duration: 0.5 }}
    >
      <div ref={ref} className={height ? "absolute inset-x-0" : "relative"}>
        {children}
      </div>
    </motion.div>
  );
};

export default ResizablePanel;
