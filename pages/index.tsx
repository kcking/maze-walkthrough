import { useMap, usePresence, useRoom } from "@roomservice/react";
import { CSSProperties, useEffect } from "react";
import generator from "generate-maze";
import { clearLine } from "readline";

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

  useEffect(() => {
    const keyDown = (ev: KeyboardEvent) => {
      const myPosition = positionClient.getMine() || { x: 0, y: 0 };

      if (["w", "ArrowUp"].includes(ev.key)) {
        myPosition.y--;
      }
      if (["s", "ArrowDown"].includes(ev.key)) {
        myPosition.y++;
      }
      if (["d", "ArrowRight"].includes(ev.key)) {
        myPosition.x++;
      }
      if (["a", "ArrowLeft"].includes(ev.key)) {
        myPosition.x--;
      }

      positionClient.set(myPosition);
    };
    window.addEventListener("keydown", keyDown);

    return () => {
      window.removeEventListener("keydown", keyDown);
    };
  }, []);

  const [mazes, mazesCli] = useMap<{ [key: string]: MazeCell[][] }>(
    ROOM,
    "mazes"
  );
  useEffect(() => {
    if (mazesCli) {
      if (mazesCli.get("maze_1") === undefined) {
        mazesCli.set(
          "maze_1",
          new generator(30, 30).map((row) => row.map(compressCell))
        );
      }
    }
  }, [mazesCli]);

  const maze = mazesCli?.get("maze_1");

  if (!maze) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{mazes["maze_1"]?.length}</h1>
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

interface MazeCell {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}
function compressCell(cell: MazeCell): number {
  let bitFlags = 0;
  if (cell.top) {
    bitFlags |= 1 << 0;
  }
  if (cell.bottom) {
    bitFlags |= 1 << 1;
  }
  if (cell.left) {
    bitFlags |= 1 << 2;
  }
  if (cell.right) {
    bitFlags |= 1 << 3;
  }

  return bitFlags;
}

function expandCell(compressedCell: number): MazeCell {
  return {
    top: (compressedCell & (1 << 0)) > 0,
    bottom: (compressedCell & (1 << 1)) > 0,
    left: (compressedCell & (1 << 2)) > 0,
    right: (compressedCell & (1 << 3)) > 0,
  };
}
