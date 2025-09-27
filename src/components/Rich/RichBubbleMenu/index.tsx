import { BubbleMenu } from '@/components/BubbleMenu';
import { Card, CardBody } from '@heroui/react';
import { Button } from '@heroui/react';

export const RichBubbleMenu = () => {
  return (
    <BubbleMenu>
      <Card>
        <CardBody>
          <Button>加粗</Button>
          <Button>删除</Button>
          <Button>斜体</Button>
          <Button>下划线</Button>
          <Button>链接</Button>
          <Button>图片</Button>
          <Button>表格</Button>
          <Button>代码</Button>
          <Button>引用</Button>
        </CardBody>
      </Card>
    </BubbleMenu>
  );
};
