import { ReactNode } from "react";

export interface BubbleMenuItemProps {
  key: string;
  // icon: ReactNode;
  label: ReactNode;
  onClick?: () => void;
}

export interface BubbleMenuPortalProps {
  children: ReactNode;
}

export interface BubbleMenuProps {
  children?: ReactNode;
  className?: string;
  items?: BubbleMenuItemProps[];
}
