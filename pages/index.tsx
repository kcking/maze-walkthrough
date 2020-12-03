import { usePresence, useRoom } from "@roomservice/react";
import { useEffect } from "react";

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

  return <div>My username is {room.me}</div>;
}
