import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", hover = true, glow = false }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      className={`glass-card p-6 ${glow ? 'glow-indigo' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
