import React from 'react';
import axios from 'axios';

const LongPulling = () => {
  const [messages, setMessages] = React.useState([]);
  const [value, setValue] = React.useState('');

  // Подписка с запросом на сервер
  const subscribe = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/get-messages');
      setMessages((prev) => [data, ...prev]);
      await subscribe();
    } catch (error) {
      alert(error);
      setTimeout(() => {
        subscribe();
      }, 500);
    }
  };

  // Отправка сообщения на сервер
  const sendMessage = async () => {
    await axios.post('http://localhost:5000/new-messages', {
      message: value,
      id: Date.now(),
    });
  };

  // Вызываем подписку
  React.useEffect(() => {
    subscribe();
  }, []);

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
              {item.message}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default LongPulling;
