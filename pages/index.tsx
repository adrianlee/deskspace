import Head from 'next/head';
import { useState, useEffect } from 'react';
import Toolbar from '../components/Toolbar';
import { BearState, useDeskspaceStore } from '../hooks/useDeskspaceStore';

export default function Home() {
  const bears = useDeskspaceStore((state: BearState) => state.bears);
  const increasePopulation = useDeskspaceStore(
    (state) => state.increasePopulation
  );

  const [startPos, setStartPos] = useState(null);
  const [endPos, setEndPos] = useState(null);

  function handleMouseDown(event) {
    event.preventDefault();
    setStartPos({ x: event.clientX, y: event.clientY });
  }

  function handleMouseUp(event) {
    event.preventDefault();
    if (startPos !== null && endPos !== null) {
      // Do something with the selected area
      console.log('Selected area:', {
        x: Math.min(startPos.x, endPos.x),
        y: Math.min(startPos.y, endPos.y),
        width: Math.abs(startPos.x - endPos.x),
        height: Math.abs(startPos.y - endPos.y),
      });
    }
    setStartPos(null);
    setEndPos(null);
  }

  function handleMouseMove(event) {
    if (startPos !== null) {
      const endX = Math.min(
        Math.max(event.clientX, 0),
        document.documentElement.clientWidth
      );
      const endY = Math.min(
        Math.max(event.clientY, 0),
        document.documentElement.clientHeight
      );
      setEndPos({ x: endX, y: endY });
    }
  }

  // handle mouse events that occur outside the viewport
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [startPos, endPos]);

  return (
    <div>
      <Head>
        <title>deskspace</title>
      </Head>

      <div className="fixed p-10">
        <Toolbar />
        <button onClick={increasePopulation}>one up</button>
      </div>

      <main
        className="flex flex-row min-h-screen min-w-screen"
        onMouseUp={handleMouseUp}
      >
        <section
          className="w-full bg-gray-50 grid"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          {startPos && endPos && (
            <div
              className="absolute border border-dashed border-blue-700"
              style={{
                top: Math.min(startPos.y, endPos.y),
                left: Math.min(startPos.x, endPos.x),
                width: Math.abs(startPos.x - endPos.x),
                height: Math.abs(startPos.y - endPos.y),
              }}
            />
          )}
        </section>
      </main>
    </div>
  );
}
