import { useEffect, useRef, useState } from "react";
import { deleteWindowData, getWindowsData, setWindowData } from "../../utils";
import Line from "./line";

interface ICircle {
  id: string;
}

function Circle({ id }: ICircle) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === "windowsData") {
        const windowsData = getWindowsData();

        if (windowsData) {
          setLines(
            Object.keys(windowsData).filter((windowId) => windowId !== id)
          );
        }
      }
    }
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [id]);

  useEffect(() => {
    function handleUnload() {
      deleteWindowData(id);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    }
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [id]);

  useEffect(() => {
    const updateWindowData = () => {
      if (!id || !elRef.current) return;

      const { x, y } = elRef.current.getBoundingClientRect();

      const navHeight = window.outerHeight - window.innerHeight;

      const absoluteY = window.screenY + navHeight + y + 28;
      const absoluteX = window.screenX + x + 28;

      setWindowData(id, {
        x: absoluteX,
        y: absoluteY,
      });

      rafRef.current = requestAnimationFrame(updateWindowData);
    };

    rafRef.current = requestAnimationFrame(updateWindowData);

    return () => {
      deleteWindowData(id);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [id]);

  return (
    <div
      ref={elRef}
      className="relative w-14 h-14 rounded-full bg-blue-400 flex items-center justify-center"
    >
      {lines.map((targetId) => (
        <Line key={targetId} id={id} targetId={targetId} />
      ))}
    </div>
  );
}

export default Circle;
