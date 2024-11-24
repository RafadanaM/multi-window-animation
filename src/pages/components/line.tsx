import { useEffect, useRef } from "react";
import { getWindowsData } from "../../utils";

interface ILineProps {
  id: string;
  targetId: string;
}

function Line({ id, targetId }: ILineProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function animate() {
      const windowsData = getWindowsData();
      if (!windowsData || !elRef.current) return;

      const windowData = windowsData[id];
      const targetWindowData = windowsData[targetId];
      if (!windowData || !targetWindowData) return;

      const dx = Math.pow(targetWindowData.x - windowData.x, 2);
      const dy = Math.pow(targetWindowData.y - windowData.y, 2);
      const length = Math.sqrt(dx + dy);

      const angleDeg = Math.atan2(
        targetWindowData.y - windowData.y,
        targetWindowData.x - windowData.x
      );

      elRef.current.style.width = `${length}px`;
      elRef.current.style.transform = `rotate(${angleDeg}rad)`;

      rafRef.current = requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [id, targetId]);

  return <div ref={elRef} className="absolute w-4 h-4 bg-black" />;
}

export default Line;
