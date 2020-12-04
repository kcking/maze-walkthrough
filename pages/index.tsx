import { usePresence, useRoom } from "@roomservice/react";
import { CSSProperties, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

const ROOM = "maze-global";

export default function Home() {
  const room = useRoom(ROOM);

  const [positions, positionClient] = usePresence<Position>(ROOM, "position");

  useEffect(() => {
    positionClient.set({ x: 0, y: 0 });
  }, []);

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {Object.entries(positions).map(([userID, position]) => {
        return <Player key={userID} position={position}></Player>;
      })}
    </div>
  );
}

function Player(props: { position: Position }) {
  const style: CSSProperties = {
    position: "absolute",
    top: `${props.position.y}px`,
    left: `${props.position.x}px`,
  };
  return <div style={style}>🧐</div>;
}
