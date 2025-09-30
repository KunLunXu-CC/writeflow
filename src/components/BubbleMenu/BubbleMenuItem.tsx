import { BubbleMenuItemProps } from '.';

export const BubbleMenuItem: React.FC<BubbleMenuItemProps> = (props) => {
  const { label, onClick } = props;
  return <div onClick={onClick}>{label}</div>;
};
