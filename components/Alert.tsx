import React from "react";
import { motion } from "framer-motion";

interface AlertBarProps {
  message: any;
}

export const AlertBar: React.FC<AlertBarProps> = ({ message }) => {
  return (
    <div className="relative bg-green-500 text-red-600 overflow-hidden h-8 flex items-center">
      <motion.div
        className="absolute whitespace-nowrap text-lg font-semibold w-full"
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
      >
        {message}
      </motion.div>
    </div>
  );
};

