interface Message {
  role: string;
  content: string;
}

interface SendMessageParams {
  message: Message;
  onMessage: (message: Message) => void;
}

const sendMessage = async ({ message, onMessage }: SendMessageParams) => {
  // 发送请求(其实就是正常发个 POST 请求)
  const eventSource = new EventSource(`/api/ds-chat?question=${message.content}`);

  eventSource.addEventListener('message', (event) => {
    if (event.data === '[DONE]') {
      eventSource.close();
      return;
    }

    if (event.data !== '') {
      const message = JSON.parse(event.data).choices[0].delta;
      onMessage(message);
    }
  });

  eventSource.addEventListener('end', () => {
    eventSource.close();
  });
};

export default sendMessage;
