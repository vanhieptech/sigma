'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ReactNode } from 'react';

// Animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const scale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Default transition
const defaultTransition = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  duration: 0.3,
};

interface MotionProps {
  children: ReactNode;
  className?: string;
  variant?: Variants;
  transition?: any;
  delay?: number;
  animate?: string | object;
  initial?: string | object;
  exit?: string | object;
  whileHover?: string | object;
  whileTap?: string | object;
  viewport?: object;
}

export function Motion({
  children,
  className,
  variant = fadeIn,
  transition = defaultTransition,
  delay = 0,
  animate = 'visible',
  initial = 'hidden',
  exit,
  whileHover,
  whileTap,
  viewport,
  ...props
}: MotionProps) {
  return (
    <motion.div
      className={className}
      variants={variant}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{
        ...transition,
        delay,
      }}
      whileHover={whileHover}
      whileTap={whileTap}
      viewport={viewport}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  viewport?: object;
}

export function StaggerContainer({
  children,
  className,
  delay = 0,
  staggerDelay = 0.1,
  viewport,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedPresence({ children }: { children: ReactNode }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
