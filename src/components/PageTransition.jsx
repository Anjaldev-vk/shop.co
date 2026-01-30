import { motion } from 'framer-motion';

const variations = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={variations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
