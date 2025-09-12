"use client"; // Esta linha é essencial aqui

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Send, Users } from "lucide-react";

interface ChatMessage {
  userId: string;
  userName: string;
  userColor: string;
  content: string;
  type?: "chat" | "system";
}

interface ChatRoomProps {
  teamId: string;
  teamName: string; // Recebe o nome do time como propriedade, não busca aqui
}

const ChatRoom = ({ teamId, teamName }: ChatRoomProps) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session || !teamId) return;

    const websocket = new WebSocket(
      `ws://192.168.1.130:3000/?teamId=${teamId}`
    );
    setWs(websocket);

    websocket.onopen = () => {
      console.log("WebSocket conectado!");
      if (session?.user?.name) {
        websocket.send(
          JSON.stringify({
            type: "connection",
            userName: session.user.name,
          })
        );
      }
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "user_count") {
        setOnlineCount(data.count);
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket desconectado.");
    };

    return () => {
      websocket.close();
    };
  }, [session, teamId]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem(
      "message"
    ) as HTMLInputElement;
    const content = input.value.trim();

    if (content && session?.user && ws) {
      const message: ChatMessage = {
        type: "chat",
        userId: session.user.id,
        userName: session.user.name || "Usuário Anônimo",
        userColor: "#8884d8",
        content: content,
      };
      ws.send(JSON.stringify(message));
      input.value = "";
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] w-full flex-col">
      <div className="flex items-center justify-between border-b p-3">
        <h2 className="text-lg font-bold">Sala: {teamName}</h2>
        <div className="flex items-center gap-2">
          <Users className="size-5 text-black dark:text-white" />
          <span className="font-bold text-green-600">{onlineCount}</span>
          <span className="text-sm text-muted-foreground">online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4" ref={chatMessagesRef}>
        <div className="flex flex-col gap-4">
          {messages.map((msg, index) => {
            if (msg.type === "system") {
              return (
                <div
                  key={index}
                  className="text-center text-sm text-muted-foreground italic"
                >
                  {msg.content}
                </div>
              );
            }
            return (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  msg.userId === session?.user?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 md:max-w-md ${
                    msg.userId === session?.user?.id
                      ? "rounded-br-none bg-primary text-primary-foreground"
                      : "rounded-bl-none bg-muted"
                  }`}
                >
                  <p
                    className="text-xs font-semibold"
                    style={{ color: msg.userColor }}
                  >
                    {msg.userName}
                  </p>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t p-4">
        <form className="flex items-center gap-2" onSubmit={sendMessage}>
          <Input
            name="message"
            autoComplete="off"
            className="flex-1"
            placeholder="Digite sua mensagem..."
          />
          <Button type="submit" size="icon">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
