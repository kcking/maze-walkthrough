import { RoomServiceProvider } from "@roomservice/react";
import Cookies from "js-cookie";
import { nanoid } from "nanoid";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (Cookies.get("roomservice-user") === undefined) {
      Cookies.set("roomservice-user", nanoid());
    }
  }, []);

  return (
    <RoomServiceProvider clientParameters={{ auth: "/api/roomservice" }}>
      <Component {...pageProps} />
    </RoomServiceProvider>
  );
}

export default MyApp;
