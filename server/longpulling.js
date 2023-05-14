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
app.get('/get-messages', (req, res) => {
  // .once() - только один раз показать сообщение
  emitter.once('newMessage', (message) => {
    res.json(message);
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

/* 
Пользователь отправляет сообщение, тригеря событие "newMessage"
и в этот момент у других пользователей показывается 
новое сообщение в виде ответа message
*/
