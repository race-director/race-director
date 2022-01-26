import { motion } from "framer-motion";
import React from "react";

interface ModalProps {}

const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      className="max-w-xl w-screen bg-zinc-800 rounded-md"
      initial={{ opacity: 0, y: -300 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -300 }}
    >
      {children}
    </motion.div>
  );
};

export default Modal;
