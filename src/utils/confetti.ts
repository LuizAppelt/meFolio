import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']
  });
};
