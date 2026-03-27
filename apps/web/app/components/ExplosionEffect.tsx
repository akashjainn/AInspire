import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ExplosionEffectProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

const ExplosionEffect: React.FC<ExplosionEffectProps> = ({ x, y, onComplete }) => {
  const [particles, setParticles] = useState<Array<{ id: number; angle: number; distance: number }>>([]);

  useEffect(() => {
    const particleCount = 12;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      angle: (i / particleCount) * Math.PI * 2,
      distance: 80 + Math.random() * 40,
    }));
    setParticles(newParticles);

    const timeout = setTimeout(() => {
      onComplete?.();
    }, 800);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <>
      {particles.map((particle) => {
        const endX = Math.cos(particle.angle) * particle.distance;
        const endY = Math.sin(particle.angle) * particle.distance;

        return (
          <motion.div
            key={particle.id}
            className="explosion-particle"
            initial={{ x, y, scale: 1, opacity: 1 }}
            animate={{ x: x + endX, y: y + endY, scale: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 8,
              height: 8,
              background: `hsl(${Math.random() * 60}, 100%, 50%)`,
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
};

export default ExplosionEffect;
