import { ReactElement, ReactNode } from 'react';

export interface BubbleMenuItemProps {
  // Prefer `id`; keep `key` for backward compatibility.
  id?: string;
  key?: string;
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
