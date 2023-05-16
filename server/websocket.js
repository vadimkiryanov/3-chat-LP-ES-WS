const ws = require("ws");

const PORT = 5000;
// Создание нового сервера
const wsServer = new ws.Server({ port: 5000 }, () => console.log(`Server started on ${PORT} port`));

// Обработка события подключения к серверу
wsServer.on("connection", (ws) => {
  // Приватный ID при подключении
  // ws.id = Date.now();

  // Обработка отправки сообщений
  ws.on("message", (message) => {
    try {
      message = JSON.parse(message);
    } catch (error) {
      return console.error(error);
    }

    // События сообщения
    switch (message.event) {
      case "message":
        broadcastMessage(message);
        break;
      case "connection":
        broadcastMessage(message);
        break;
    }
  });
});

// Отправка сообщения для каждого пользователя
const broadcastMessage = (message = "hello world", id) => {
  wsServer.clients.forEach((client) => {
    // Проверка на наличие приватного ID
    // if (client.id === id) {
    client.send(JSON.stringify(message));
    // }
  });
};

// const message = {
//   event: 'message/connection',
//   id: 123,
//   date: '21.04.2023',
//   username: 'UserTest',
//   message: 'Hello world',
// };
