import type { JSX } from 'solid-js/jsx-runtime';
import '@material-design-icons/font/filled.css';
import { css } from 'solid-styled-components';
import { classNames } from '@libs/utils/classNames';
import { splitProps } from 'solid-js';
import type { MaterialIcon } from '@material-design-icons/font';

interface IconProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  name: MaterialIcon;
  /** 图标尺寸（px），material-icons 类默认 24 */
  size?: number;
}
export function Icon(props: IconProps) {
  const [local, restProps] = splitProps(props, ['name', 'class', 'size', 'style']);
  return (
    <span
      class={classNames('material-icons', styleClass, local.class)}
      {...restProps}
      style={
        local.size === undefined
          ? local.style
          : typeof local.style === 'string'
            ? `${local.style};font-size:${local.size}px`
            : { ...local.style, 'font-size': `${local.size}px` }
      }
    >
      {local.name}
    </span>
  );
}

const styleClass = css`
  user-select: none;
`;
