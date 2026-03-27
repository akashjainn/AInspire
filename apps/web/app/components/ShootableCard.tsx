import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import ExplosionEffect from "./ExplosionEffect";

interface ShootableCardProps {
  imageUrl: string;
  imageId: string;
  onShot: () => void;
}

const ShootableCard: React.FC<ShootableCardProps> = ({ imageUrl, imageId, onShot }) => {
  const [cursorX, setCursorX] = useState<number | null>(null);
  const [cursorY, setCursorY] = useState<number | null>(null);
  const [hasShot, setHasShot] = useState(false);
  const [explosionPos, setExplosionPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasShot) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCursorX(x);
      setCursorY(y);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasShot) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setExplosionPos({ x, y });
      setHasShot(true);
    }
  };

  const handleExplosionComplete = () => {
    // Small delay before triggering the callback to let animation complete
    setTimeout(() => {
      onShot();
    }, 100);
  };

  return (
    <motion.div
      ref={containerRef}
      className="shootable-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (!hasShot) {
          setCursorX(null);
          setCursorY(null);
        }
      }}
      onClick={handleClick}
      animate={hasShot ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <img src={imageUrl} alt={imageId} className="shootable-card-image" />

      {/* Crosshair */}
      <AnimatePresence>
        {cursorX !== null && cursorY !== null && !hasShot && (
          <motion.div
            className="crosshair"
            style={{
              left: cursorX,
              top: cursorY,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Explosion Effect */}
      <AnimatePresence>
        {hasShot && (
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
            <ExplosionEffect x={explosionPos.x} y={explosionPos.y} onComplete={handleExplosionComplete} />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShootableCard;
