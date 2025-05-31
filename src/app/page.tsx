import { Button } from '@heroui/react';
import Icon from '@/components/Icon';

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <Button color="primary">Button</Button>
      <Icon
        name="icon-send-fill"
        className="text-red-500"
      />
    </div>
  );
}
