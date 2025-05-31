import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.KIMI_API_KEY, // 鉴权, 填写你的 API Key
  baseURL: 'https://api.moonshot.cn/v1/',
});

const img2text = async (image: string, prompt: string): Promise<string> => {
  const completion = await client.chat.completions.create({
    stream: false, // 关闭流式输出
    model: 'moonshot-v1-8k-vision-preview', // 设置模型
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt }, // 提示词(要根据图片输出啥)
          {
            type: 'image_url', // 设置消息类型为图片
            image_url: { url: image }, // 这里的 url 是 base64 的图片数据
          },
        ],
      },
    ],
  });

  return completion.choices[0].message.content || '';
};

const text2audio = async (text: string): Promise<string> => {
  const res = await fetch('https://openspeech.bytedance.com/api/v1/tts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer;${process.env.VOLCENGINE_ACCESS_TOKEN}`, // 鉴权信息
    },
    body: JSON.stringify({
      // 应用信息
      app: {
        token: process.env.VOLCENGINE_ACCESS_TOKEN, // 语音合成大模型的 Access Token
        appid: process.env.VOLCENGINE_APP_ID, // 语音合成大模型的应用 ID
        cluster: 'volcano_tts', // 业务集群: 不用管, 固定填写该值就行
      },
      // 用户信息
      user: {
        uid: 'bearbobo', // 用户标识: 可传任意非空字符串, 传入值可以通过服务端日志追溯
      },
      // 音频相关配置
      audio: {
        encoding: 'ogg_opus', // 音频编码格式: wav / pcm / ogg_opus / mp3，默认为 pcm 注意的是 wav 不支持流式
        voice_type: 'zh_female_wanqudashu_moon_bigtts', // 音色类型: 可取值查阅音色详情列表 Voice_type 一栏
        rate: 24000, // 音频采样率: 默认为 24000, 可选8000，16000
        speed_ratio: 1.0, // 语速: 取值范围为 [0.8,2], 默认为 1 通常保留一位小数即可
        loudness_ratio: 1.0, // 音量: 1.0 是正常音量。
        emotion: 'happy', // 音色情感: 大模型根据它来调整语音的情感色彩 happy 表示欢快, 语音可能会更轻松愉快, 语气上会有更多的高低起伏
      },
      // 请求相关配置
      request: {
        text, // 文本: 合成语音的文本, 长度限制 1024 字节(UTF-8 编码)
        reqid: Math.random().toString(36).substring(7), // 请求标识: 需要保证每次调用传入值唯一, 建议使用 UUID
        operation: 'query', // 操作: query(非流式, http 只能 query)/submit(流式)
        silence_duration: '125', // 句尾静音: 设置该参数可在句尾增加静音时长, 范围 0 ~ 30000ms
      },
    }),
  });

  const { data } = await res.json();
  return data;
};

export async function POST(req: Request) {
  const { image, prompt = '请描述图片的内容。' } = await req.json();

  const text = await img2text(image, prompt);
  const audio = await text2audio(text);

  return new Response(JSON.stringify({ data: audio, code: 0, message: 'success' }));
}
