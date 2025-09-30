import { BubbleMenu } from '@/components/BubbleMenu';

export const RichBubbleMenu = () => {

  const items = [
    {
      key: 'bold',
      label: '加粗',
      onClick: () => {},
    },
    {
      key: 'italic',
      label: '斜体',
      onClick: () => {},
    },
    {
      key: 'underline',
      label: '下划线',
      onClick: () => {},
    },
    {
      key: 'strikethrough',
      label: '删除线',
      onClick: () => {},
    },
    {
      key: 'code',
      label: '代码',
      onClick: () => {},
    },
    {
      key: 'link',
      label: '链接',
      onClick: () => {},
    },
    {
      key: 'image',
      label: '图片',
      onClick: () => {},
    },
    {
      key: 'video',
      label: '视频',
      onClick: () => {},
    },
    {
      key: 'audio',
      label: '音频',
      onClick: () => {},
    },
    {
      key: 'table',
      label: '表格',
      onClick: () => {},
    },    
  ];

  return (
    <BubbleMenu items={items} />
  );
};
