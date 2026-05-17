import { io, type Socket } from "socket.io-client";

export function createSocket(): Socket {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";

  return io(url, {
    transports: ["websocket"],
    autoConnect: false,
  });
}
