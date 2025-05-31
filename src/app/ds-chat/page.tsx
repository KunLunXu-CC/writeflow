'use client';
import clsx from 'clsx';
import Icon from '@/components/Icon';
import sendMessage from './sendMessage';
import { Button } from '@heroui/react';
import { Textarea } from '@heroui/input';
import { useCallback, useState } from 'react';

const loadingMessage = '正在思考...';

const Page = () => {
  const [value, setValue] = useState('');

  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const handleSend = useCallback(async () => {
    const currentMessage = {
      role: 'user',
      content: value,
    };

    setValue('');

    setMessages((pre) => [
      ...pre,
      currentMessage,
      {
        role: 'assistant',
        content: loadingMessage,
      },
    ]);

    await sendMessage({
      message: currentMessage,
      onMessage: (message) =>
        setMessages((pre) => {
          const list = [...pre];
          const lastMessage = list[list.length - 1];

          if (lastMessage.content === loadingMessage) {
            lastMessage.content = message.content;
          } else {
            lastMessage.content += message.content;
          }

          return list;
        }),
    });
  }, [value]);

  return (
    <div className="flex min-h-screen w-screen justify-center overflow-y-auto bg-[#080c22]">
      <div className="mt-10 w-1/2 pb-80">
        {messages.map((message, index) => (
          <div
            key={index}
            className={clsx('mb-3 flex', message.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={clsx(
                message.role === 'user' ? 'bg-[#f9e4df]' : 'bg-[#f5d797]',
                'flex size-9 flex-none items-center justify-center rounded-full',
              )}>
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="ml-2 flex rounded-lg bg-[#232325] p-2">{message.content}</div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-7 w-1/2 rounded-lg bg-[#2a2a2a]">
        <Textarea
          value={value}
          color="default"
          placeholder="输入你想说的话..."
          onChange={(e) => setValue(e.target.value)}
          classNames={{
            input: 'group-data-[has-value=true]:text-white/80',
            inputWrapper: 'bg-transparent group-data-[focus]:bg-[#29272e] data-[hover]:bg-[#29272e]',
          }}
        />
        <div className="absolute bottom-2 right-2">
          <Button
            isIconOnly
            size="sm"
            radius="full"
            onPress={handleSend}>
            <Icon
              name="icon-arrdown"
              className="text-xl text-white/50"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
