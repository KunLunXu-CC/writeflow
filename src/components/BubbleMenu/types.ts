import { ReactNode } from 'react';

export interface BubbleMenuItemProps {
  key: string;
  label: ReactNode;
  tooltip?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface BubbleMenuPortalProps {
  children: ReactNode;
}

export interface BubbleMenuProps {
  children?: ReactNode;
  className?: string;
  items?: BubbleMenuItemProps[];
}
