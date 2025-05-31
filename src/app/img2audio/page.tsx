'use client';
import { ChangeEvent, useCallback, useState } from 'react';
import { Textarea, Button, Image, Skeleton } from '@heroui/react';
import Icon from '@/components/Icon/index';

function createBlobURL(base64AudioData: string): string {
  const byteArrays = [];
  const byteCharacters = atob(base64AudioData);

  for (let offset = 0; offset < byteCharacters.length; offset++) {
    const byteArray = byteCharacters.charCodeAt(offset);
    byteArrays.push(byteArray);
  }

  const blob = new Blob([new Uint8Array(byteArrays)], { type: 'audio/mp3' });

  return URL.createObjectURL(blob); // 创建一个临时 URL 供音频播放
}

const Page = () => {
  const [imgData, setImgData] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = useCallback(async () => {
    setIsLoading(true);

    const res = await fetch('/api/img2audio', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        image: imgData,
      }),
    });

    const { data } = await res.json();
    setAudioUrl(createBlobURL(data));

    setIsLoading(false);
  }, [imgData, prompt]);

  const handleUpload = useCallback(async (e: ChangeEvent) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    // 读取图片文件
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImgData(reader.result as string);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center overflow-y-auto bg-[#131313]">
      {isLoading || audioUrl ? (
        <div className="flex w-1/2 justify-center pb-5">
          {isLoading ? (
            <Skeleton className="h-[54px] w-3/5 rounded-full" />
          ) : (
            <audio
              controls
              src={audioUrl!}
              className="w-3/5"
            />
          )}
        </div>
      ) : null}
      <div className="relative flex w-1/2">
        <input
          type="file"
          id="img2audio-upload"
          onChange={handleUpload}
          className="size-0 opacity-0"
        />
        <label
          htmlFor="img2audio-upload"
          className="mr-3 flex size-[176px] flex-none cursor-pointer items-center justify-center rounded-xl border-2 border-dotted border-white/10 bg-[#1d1d1d]">
          {imgData ? (
            <Image
              width={160}
              height={160}
              src={imgData}
              alt="upload img"
            />
          ) : (
            <Icon
              name="icon-upload"
              className="text-6xl text-white/10 transition-all hover:text-white/50"
            />
          )}
        </label>
        <Textarea
          minRows={8}
          maxRows={8}
          value={prompt}
          onValueChange={setPrompt}
          placeholder="需要根据图片输出什么?"
          classNames={{ inputWrapper: 'flex-1 bg-[#1d1d1d]' }}
        />
        <Button
          isIconOnly
          size="sm"
          radius="full"
          color="primary"
          className="absolute bottom-4 right-4"
          onPress={handleSend}>
          <Icon
            name="icon-arrdown"
            className="text-xl text-white/80"
          />
        </Button>
      </div>
    </div>
  );
};

export default Page;
