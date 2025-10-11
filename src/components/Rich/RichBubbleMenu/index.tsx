import { BubbleMenu } from '@/components/BubbleMenu';
import Icon from '@/components/Icon';

export const RichBubbleMenu = () => {
  const items = [
    {
      key: 'bold',
      onClick: () => {},
      tooltip: '加粗',
      label: <Icon name="icon-zitixiahuaxian" />,
    },
    {
      key: 'italic',
      onClick: () => {},
      tooltip: '斜体',
      label: <Icon name="icon-zitixiahuaxian" />,
    },
    {
      key: 'underline',
      onClick: () => {},
      tooltip: '下划线',
      label: <Icon name="icon-zitixiahuaxian" />,
    },
    {
      key: 'strikethrough',
      onClick: () => {},
      tooltip: '删除线',
      label: <Icon name="icon-zitixiahuaxian" />,
    },
    {
      key: 'link',
      onClick: () => {},
      tooltip: '链接',
      label: <Icon name="icon-zitixiahuaxian" />,
    },
    {
      key: 'audio',
      onClick: () => {},
      tooltip: '音频',
      label: <Icon name="icon-zitixiahuaxian" />,
    },
  ];

  return <BubbleMenu items={items} />;
};
