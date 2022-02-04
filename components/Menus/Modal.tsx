import { motion } from "framer-motion";
import React from "react";

interface ModalProps {}

const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      className="w-screen max-w-xl rounded-md bg-zinc-800"
      initial={{ opacity: 0, y: -300 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -300 }}
    >
      {children}
    </motion.div>
  );
};

export default Modal;
