import { useRoom } from "@roomservice/react";

export default function Home() {
  const room = useRoom("global");

  if (!room) {
    return <div>Loading...</div>;
  }

  return <div>My username is {room.me}</div>;
}
