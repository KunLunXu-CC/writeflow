import { FC } from 'react';
import Script from 'next/script';
import clsx from 'clsx';

const CDN = '//at.alicdn.com/t/c/font_4923964_1mlgt4xxwk1.js';

interface IconProps {
  name: string;
  className?: string;
}

const Icon: FC<IconProps> = ({ name, className }) => {
  return (
    <>
      <Script src={CDN} />
      <svg
        aria-hidden="true"
        className={clsx('size-[1em] overflow-hidden fill-current align-[-0.15em]', className)}>
        <use xlinkHref={`#${name}`} />
      </svg>
    </>
  );
};

export default Icon;
