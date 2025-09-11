// src/app/(private)/chat/_components/chat.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

// Interface para tipar as mensagens do chat
interface ChatMessage {
  userId: string;
  userName: string;
  userColor: string;
  content: string;
}

const ChatPage = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://192.168.1.130:3000/");
    setWs(websocket);

    websocket.onopen = () => {
      console.log("WebSocket conectado!");
    };

    websocket.onmessage = (event) => {
      console.log("Mensagem recebida do servidor:", event.data);
      try {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      } catch (error) {
        console.log("Mensagem de boas-vindas ou não-JSON:", event.data);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket desconectado.");
    };

    return () => {
      websocket.close();
    };
  }, []);

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
        userId: session.user.id,
        userName: session.user.name || "Usuário Anônimo",
        userColor: "#8884d8",
        content: content,
      };

      console.log("Enviando mensagem:", message);
      ws.send(JSON.stringify(message));
      input.value = "";
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] w-full flex-col">
      <div className="flex-1 overflow-y-auto p-4" ref={chatMessagesRef}>
        <div className="flex flex-col gap-4">
          {messages.map((msg, index) => (
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
          ))}
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

export default ChatPage;
