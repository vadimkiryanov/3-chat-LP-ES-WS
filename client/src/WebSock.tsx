import React from "react";
import axios from "axios";

const WebSock = () => {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [value, setValue] = React.useState("");

  const [statusConnected, setStatusConnected] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState("");

  // Хранение сокета
  const socket = React.useRef<WebSocket>();

  // Отправка сообщения на сервер
  const sendMessage = async () => {
    const message = {
      event: "message",
      username,
      id: Date.now(),
      message: value,
    };

    socket.current?.send(JSON.stringify(message));
    setValue("");
  };

  // Ф-я подключения
  const toConnect = () => {
    socket.current = new WebSocket("ws://localhost:5000"); // Установка соединения

    socket.current.onopen = () => {
      setStatusConnected(true); // Смена статуса подключения

      // Конструкция месседжа для сервера
      const message = {
        event: "connection",
        username,
        id: Date.now(),
      };

      // Отправка месседжа на
      socket.current?.send(JSON.stringify(message));

      console.log("Socket connected");
    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };
    socket.current.onclose = () => {
      console.log("Socket closed");
    };
    socket.current.onerror = () => {
      console.log("Socket has been mistake");
    };
  };

  if (!statusConnected) {
    return (
      <div className="flex flex-col">
        <div className="flex gap-4">
          <input className="rounded-md pl-4" placeholder="Введите ваше имя" value={username} onChange={(e) => setUsername(e.currentTarget.value)} type="text" />
          <button onClick={toConnect}>Войти</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-4">
        <input className="rounded-md pl-4" value={value} onChange={(e) => setValue(e.target.value)} type="text" />
        <button onClick={sendMessage}>Отправить</button>
      </div>
      <div className="flex flex-col justify-center items-start">
        {messages?.map((item, itemID) => {
          return (
            <span className="border px-2 mt-2 border-solid rounded-md border-gray-400" key={item.id}>
              {item.event === "connection" ? (
                <span>
                  Пользователь<span className="text-blue-300"> {item.username}</span> подключен
                </span>
              ) : (
                <span>
                  <span className="text-blue-300"> {item.username}:</span> {item.message}{" "}
                </span>
              )}
              {/* {item.message} */}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default WebSock;
