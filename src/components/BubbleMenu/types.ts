import { ReactElement, ReactNode } from 'react';

export interface BubbleMenuItemProps {
  key: string;
  icon: string;
  tooltip?: ReactNode;
  onClick?: () => void;
  className?: string;

  shouldShow?: () => boolean;
}

export interface BubbleMenuPortalProps {
  children: ReactElement;
}

export interface BubbleMenuProps {
  children?: ReactNode;
  className?: string;
  items?: BubbleMenuItemProps[];
}
