// Импорты
const express = require('express');
const cors = require('cors');
const events = require('events');

// Порт
const PORT = 5000;

const emitter = new events.EventEmitter();

const app = express();

app.use(cors());
app.use(express.json());

// Метотд получение
app.get('/connect', (req, res) => {
  // Указываем заголовки
  res.writeHead(200, {
    Connection: 'keep-alive', // - Держать подключение
    'Content-Type': 'text/event-stream', // - Тип контента - строка
    'Cache-Control': 'no-cache', // - Не кэшировать
  });

  // Тут не обходимо писать таким способом, так как
  // тип контента у нас текст
  // то и передаем мы тоже JSON строку
  emitter.on('newMessage', (message) => {
    res.write(`data: ${JSON.stringify(message)} \n\n`);
  });
});

// Метотд отправки
app.post('/new-messages', (req, res) => {
  // Достаем сообщение
  const message = req.body;
  emitter.emit('newMessage', message);
  // При успешной операции - статус 200
  res.status(200);
});

// Прослушивание
app.listen(PORT, () => console.log(`server started on ${PORT}`));
