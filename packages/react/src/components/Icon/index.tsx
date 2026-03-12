import clsx from 'clsx';
import Script from 'next/script';
import { FC } from 'react';

const ICON_FONT_CDN = '//at.alicdn.com/t/c/font_5034983_fdxtdsdypdo.js';

interface IconProps {
  name: string;
  className?: string;
}

export const Icon: FC<IconProps> = ({ name, className }) => {
  return (
    <>
      <Script src={ICON_FONT_CDN} />
      <svg
        aria-hidden="true"
        className={clsx('size-[1em] overflow-hidden fill-current align-[-0.15em]', className)}>
        <use xlinkHref={`#${name}`} />
      </svg>
    </>
  );
};
