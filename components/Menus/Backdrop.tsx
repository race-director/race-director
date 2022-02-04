import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface BackdropProps {
  onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({ onClick, children }) => {
  return (
    <motion.div
      onClick={onClick}
      className="fixed top-0 right-0 bottom-0 left-0 z-50 grid items-center justify-center bg-zinc-900/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
